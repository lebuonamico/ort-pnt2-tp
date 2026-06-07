import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { useErrorTranslator } from '../composables/useErrorTranslator'
import { CATEGORIES_BUCKET } from '../composables/useCategoryImage'

const MONTHS_IN_HISTORY = 12

const monthKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const monthLabel = (key) => {
  const [year, month] = key.split('-')
  const names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${names[Number(month) - 1]} ${year.slice(2)}`
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
  const supervisedUsers = ref([])
  const allUsers = ref([])
  const transactions = ref([])
  const transactionsTotal = ref(0)
  const categories = ref([])

  const loading = ref(false)
  const errors = ref({
    stats: null,
    monthlyActivity: null,
    categoryDistribution: null,
    supervision: null,
    allUsers: null,
    addUser: null,
    removeUser: null,
    transactions: null,
    categories: null
  })

  const incomeKeywords = ['ingreso', 'ingresos', 'income']
  const isIncome = (tipo) => incomeKeywords.includes(String(tipo).toLowerCase())

  const supervisedIds = computed(() => supervisedUsers.value.map((u) => u.id))
  const currentAdminId = ref(null)

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

  async function loadSupervision() {
    return runQuery('supervision', async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        supervisedUsers.value = []
        currentAdminId.value = null
        return
      }

      currentAdminId.value = user.id

      const { data: supRows, error: supErr } = await supabase
        .from('admin_supervision')
        .select('user_id, added_at')
        .eq('admin_id', user.id)
        .order('added_at', { ascending: false })

      if (supErr) throw supErr

      const ids = (supRows ?? []).map((r) => r.user_id)
      if (ids.length === 0) {
        supervisedUsers.value = []
        return
      }

      const { data: profs, error: profErr } = await supabase
        .from('profiles')
        .select('id, email, role, status, created_at')
        .in('id', ids)

      if (profErr) throw profErr

      const orderMap = new Map(ids.map((id, idx) => [id, idx]))
      supervisedUsers.value = (profs ?? []).sort((a, b) =>
        (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
      )
    })
  }

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

  async function addToSupervision(userId) {
    errors.value.addUser = null
    loading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Sesión inválida')
      if (user.id === userId) throw new Error('No podés agregarte a vos mismo al grupo.')

      const { data, error: err } = await supabase
        .from('admin_supervision')
        .insert({ admin_id: user.id, user_id: userId })
        .select()
        .single()

      if (err) throw err

      const added = allUsers.value.find((u) => u.id === userId)
      if (added && !supervisedUsers.value.some((u) => u.id === userId)) {
        supervisedUsers.value = [added, ...supervisedUsers.value]
      }
      return true
    } catch (err) {
      console.error('[admin] addToSupervision:', err)
      errors.value.addUser = err?.message || translateError(err?.message)
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeFromSupervision(userId) {
    errors.value.removeUser = null
    loading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Sesión inválida')

      const { error: err } = await supabase
        .from('admin_supervision')
        .delete()
        .eq('admin_id', user.id)
        .eq('user_id', userId)

      if (err) throw err
      supervisedUsers.value = supervisedUsers.value.filter((u) => u.id !== userId)
      return true
    } catch (err) {
      console.error('[admin] removeFromSupervision:', err)
      errors.value.removeUser = err?.message || translateError(err?.message)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    return runQuery('stats', async () => {
      const ids = supervisedIds.value
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
      const ids = supervisedIds.value
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
      const ids = supervisedIds.value
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
    return runQuery('supervision', async () => {
      const nextStatus = currentStatus === 'active' ? 'suspended' : 'active'
      const { error: err } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', id)

      if (err) throw err

      const target = supervisedUsers.value.find((u) => u.id === id)
      if (target) target.status = nextStatus

      const inAll = allUsers.value.find((u) => u.id === id)
      if (inAll) inAll.status = nextStatus
    })
  }

  async function loadTransactions({ page = 1, pageSize = 25 } = {}) {
    return runQuery('transactions', async () => {
      const ids = supervisedIds.value
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

  const availableUsers = computed(() => {
    const supervisedSet = new Set(supervisedIds.value)
    return allUsers.value.filter((u) =>
      !supervisedSet.has(u.id) && u.id !== currentAdminId.value
    )
  })

  return {
    stats,
    monthlyActivity,
    categoryDistribution,
    supervisedUsers,
    supervisedIds,
    currentAdminId,
    allUsers,
    availableUsers,
    transactions,
    transactionsTotal,
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    errors,
    hasAnyError,
    loadSupervision,
    loadAllUsers,
    addToSupervision,
    removeFromSupervision,
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
