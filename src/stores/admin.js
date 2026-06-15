import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase, createIsolatedClient } from '../lib/supabase'
import { useErrorTranslator } from '../composables/useErrorTranslator'
import { CATEGORIES_BUCKET } from '../composables/useCategoryImage'
import { useFechas } from '../composables/useFechas'
import { useTipoTransaccion } from '../composables/useTipoTransaccion'

const MONTHS_IN_HISTORY = 12

const { MESES_CORTOS } = useFechas()

const monthKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const monthLabel = (key) => {
  const [year, month] = key.split('-')
  return `${MESES_CORTOS[Number(month) - 1]} ${year.slice(2)}`
}

const emptyStats = () => ({
  totalUsers: 0,
  totalTransactions: 0,
  totalIncome: 0,
  totalExpenses: 0
})

const emptyMonthlyBuckets = () => {
  const since = new Date()
  since.setMonth(since.getMonth() - (MONTHS_IN_HISTORY - 1))
  since.setDate(1)
  since.setHours(0, 0, 0, 0)

  const buckets = []
  const cursor = new Date(since)
  for (let i = 0; i < MONTHS_IN_HISTORY; i += 1) {
    const key = monthKey(cursor)
    buckets.push({ mes: key, label: monthLabel(key), count: 0, ingresos: 0, gastos: 0 })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return buckets
}

export const useAdminStore = defineStore('admin', () => {

  const { translateError } = useErrorTranslator()

  const stats = ref(emptyStats())
  const monthlyActivity = ref([])
  const categoryDistribution = ref([])
  const allUsers = ref([])
  const transactions = ref([])
  const transactionsTotal = ref(0)
  const categories = ref([])

  const loading = ref(false)
  const errors = ref({
    stats: null,
    monthlyActivity: null,
    categoryDistribution: null,
    allUsers: null,
    addUser: null,
    transactions: null,
    categories: null
  })

  const { esIngreso: isIncome } = useTipoTransaccion()

  const allUserIds = computed(() => allUsers.value.map((u) => u.id))

  const runQuery = async (key, action) => {
    loading.value = true
    errors.value[key] = null
    try {
      const result = await action()
      return result
    } catch (err) {
      console.error(`[admin] ${key}:`, err)
      errors.value[key] = translateError(err?.message)
      return null
    } finally {
      loading.value = false
    }
  }

  const hasAnyError = computed(() =>
    Object.values(errors.value).some((v) => v !== null)
  )

  async function loadAllUsers() {
    return runQuery('allUsers', async () => {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, email, role, status, created_at')
        .order('created_at', { ascending: false })

      if (err) throw err
      allUsers.value = data ?? []
    })
  }

  async function createUser({ fullName, email, password, role = 'user' }) {
    errors.value.addUser = null
    loading.value = true
    try {
      const tempClient = createIsolatedClient()
      const { data, error: signUpErr } = await tempClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })

      if (signUpErr) throw signUpErr

      const newUser = data?.user
      if (!newUser?.id) throw new Error('No se pudo crear la cuenta del usuario.')

      const profile = {
        id: newUser.id,
        email,
        role,
        status: 'active',
        created_at: newUser.created_at ?? new Date().toISOString()
      }

      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })

      if (profileErr) throw profileErr

      await tempClient.auth.signOut()

      if (!allUsers.value.some((u) => u.id === newUser.id)) {
        allUsers.value = [profile, ...allUsers.value]
      }
      return true
    } catch (err) {
      console.error('[admin] createUser:', err)
      errors.value.addUser = translateError(err?.message) || err?.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    return runQuery('stats', async () => {
      const ids = allUserIds.value
      if (ids.length === 0) {
        stats.value = emptyStats()
        return
      }

      const [txCountRes, txAggRes] = await Promise.all([
        supabase.from('transacciones').select('*', { count: 'exact', head: true }).in('user_id', ids),
        supabase.from('transacciones').select('tipo, monto').in('user_id', ids)
      ])

      if (txCountRes.error) throw txCountRes.error
      if (txAggRes.error) throw txAggRes.error

      let totalIncome = 0
      let totalExpenses = 0

      for (const row of txAggRes.data ?? []) {
        const amount = Number(row.monto) || 0
        if (isIncome(row.tipo)) totalIncome += amount
        else totalExpenses += amount
      }

      stats.value = {
        totalUsers: ids.length,
        totalTransactions: txCountRes.count ?? 0,
        totalIncome,
        totalExpenses
      }
    })
  }

  async function loadMonthlyActivity() {
    return runQuery('monthlyActivity', async () => {
      const ids = allUserIds.value
      if (ids.length === 0) {
        monthlyActivity.value = emptyMonthlyBuckets()
        return
      }

      const since = new Date()
      since.setMonth(since.getMonth() - (MONTHS_IN_HISTORY - 1))
      since.setDate(1)
      since.setHours(0, 0, 0, 0)

      const { data, error: err } = await supabase
        .from('transacciones')
        .select('fecha, tipo, monto')
        .in('user_id', ids)
        .gte('fecha', since.toISOString())

      if (err) throw err

      const buckets = new Map()
      const cursor = new Date(since)
      for (let i = 0; i < MONTHS_IN_HISTORY; i += 1) {
        const key = monthKey(cursor)
        buckets.set(key, { mes: key, label: monthLabel(key), count: 0, ingresos: 0, gastos: 0 })
        cursor.setMonth(cursor.getMonth() + 1)
      }

      for (const row of data ?? []) {
        const date = row.fecha ? new Date(row.fecha) : null
        if (!date || Number.isNaN(date.getTime())) continue
        const key = monthKey(date)
        const bucket = buckets.get(key)
        if (!bucket) continue
        bucket.count += 1
        const amount = Number(row.monto) || 0
        if (isIncome(row.tipo)) bucket.ingresos += amount
        else bucket.gastos += amount
      }

      monthlyActivity.value = Array.from(buckets.values())
    })
  }

  async function loadCategoryDistribution() {
    return runQuery('categoryDistribution', async () => {
      const ids = allUserIds.value
      if (ids.length === 0) {
        categoryDistribution.value = []
        return
      }

      const { data, error: err } = await supabase
        .from('transacciones')
        .select('categoria, monto, tipo')
        .in('user_id', ids)

      if (err) throw err

      const totals = new Map()
      for (const row of data ?? []) {
        if (isIncome(row.tipo)) continue
        const key = row.categoria || 'Sin categoría'
        totals.set(key, (totals.get(key) || 0) + (Number(row.monto) || 0))
      }

      categoryDistribution.value = Array.from(totals.entries())
        .map(([categoria, total]) => ({ categoria, total }))
        .sort((a, b) => b.total - a.total)
    })
  }

  async function toggleUserStatus(id, currentStatus) {
    return runQuery('allUsers', async () => {
      const nextStatus = currentStatus === 'active' ? 'suspended' : 'active'
      const { error: err } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', id)

      if (err) throw err

      const target = allUsers.value.find((u) => u.id === id)
      if (target) target.status = nextStatus
    })
  }

  async function loadTransactions({ page = 1, pageSize = 25 } = {}) {
    return runQuery('transactions', async () => {
      const ids = allUserIds.value
      if (ids.length === 0) {
        transactions.value = []
        transactionsTotal.value = 0
        return
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error: err, count } = await supabase
        .from('transacciones')
        .select('id, user_id, tipo, monto, concepto, categoria, fecha, notas', { count: 'exact' })
        .in('user_id', ids)
        .order('fecha', { ascending: false })
        .range(from, to)

      if (err) throw err
      transactions.value = data ?? []
      transactionsTotal.value = count ?? 0
    })
  }

  async function loadCategories() {
    return runQuery('categories', async () => {
      const { data, error: err } = await supabase
        .from('categories')
        .select('id, nombre, tipo, imagen_path, descripcion, created_at')
        .order('nombre', { ascending: true })

      if (err) throw err
      categories.value = data ?? []
    })
  }

  async function uploadCategoryImage(file) {
    return runQuery('categories', async () => {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'png'
      const path = `${crypto.randomUUID()}.${ext}`

      const { error: err } = await supabase.storage
        .from(CATEGORIES_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (err) throw err
      return { path }
    })
  }

  async function removeCategoryImages(paths) {
    const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean)
    if (!list.length) return
    try {
      await supabase.storage.from(CATEGORIES_BUCKET).remove(list)
    } catch (err) {
      console.warn('[admin] removeCategoryImages:', err)
    }
  }

  async function createCategory(payload) {
    return runQuery('categories', async () => {
      const { data, error: err } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single()

      if (err) throw err
      categories.value = [...categories.value, data].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
      return data
    })
  }

  async function updateCategory(id, payload) {
    return runQuery('categories', async () => {
      const { data, error: err } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      categories.value = categories.value
        .map((c) => (c.id === id ? data : c))
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
      return data
    })
  }

  async function deleteCategory(id) {
    return runQuery('categories', async () => {
      const target = categories.value.find((c) => c.id === id)

      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (err) throw err

      if (target?.imagen_path) {
        await supabase.storage.from(CATEGORIES_BUCKET).remove([target.imagen_path])
      }

      categories.value = categories.value.filter((c) => c.id !== id)
    })
  }

  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.tipo === 'gasto')
  )

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.tipo === 'ingreso')
  )

  return {
    stats,
    monthlyActivity,
    categoryDistribution,
    allUsers,
    allUserIds,
    transactions,
    transactionsTotal,
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    errors,
    hasAnyError,
    loadAllUsers,
    createUser,
    loadStats,
    loadMonthlyActivity,
    loadCategoryDistribution,
    toggleUserStatus,
    loadTransactions,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    removeCategoryImages
  }
})
