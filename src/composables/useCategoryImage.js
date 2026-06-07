import { supabase } from '../lib/supabase'

export const CATEGORIES_BUCKET = 'imagenesCategorias'

export function useCategoryImage() {
  const categoryImageUrl = (path) => {
    if (!path) return null
    return supabase.storage.from(CATEGORIES_BUCKET).getPublicUrl(path).data.publicUrl
  }

  return { categoryImageUrl }
}
