import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useCategoryImage } from './useCategoryImage'

const { categoryImageUrl } = useCategoryImage()
const categorias = ref([])
const loading = ref(false)

export function useCategories() {
  async function cargarCategorias() {
    if (categorias.value.length > 0) return
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nombre, tipo, imagen_path')
        .order('nombre', { ascending: true })

      if (error) throw error
      categorias.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  function imagenDeCategoria(nombre) {
    const cat = categorias.value.find((c) => c.nombre === nombre)
    return cat?.imagen_path ? categoryImageUrl(cat.imagen_path) : null
  }

  return {
    categorias,
    loading,
    cargarCategorias,
    imagenDeCategoria,
  }
}
