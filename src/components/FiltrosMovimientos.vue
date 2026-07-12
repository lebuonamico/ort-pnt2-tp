```vue
<script setup>
defineProps({
  busqueda: { type: String, required: true },
  filtroFecha: { type: String, required: true },
  filtroCategoria: { type: String, required: true },
  filtroTipo: { type: String, required: true },
  categorias: { type: Array, required: true },
})

defineEmits([
  'update:busqueda',
  'update:filtroFecha',
  'update:filtroCategoria',
  'update:filtroTipo',
])
</script>

<template>
  <div class="filtros-container">
    <div class="filtro-grupo">
      <label for="filtro-busqueda">Buscar</label>
      <div class="input-wrapper">
        <span class="icono-buscar">🔍</span>
        <input
          id="filtro-busqueda"
          :value="busqueda"
          @input="$emit('update:busqueda', $event.target.value)"
          type="text"
          placeholder="Nombre de transacción..."
          class="input-busqueda"
        />
      </div>
    </div>

    <div class="filtro-grupo">
      <label for="filtro-fecha">Fecha</label>
      <select
        id="filtro-fecha"
        :value="filtroFecha"
        @change="$emit('update:filtroFecha', $event.target.value)"
        class="select-filtro"
      >
        <option value="7">Últimos 7 días</option>
        <option value="30">Últimos 30 días</option>
        <option value="90">Últimos 3 meses</option>
        <option value="365">Este año</option>
      </select>
    </div>

    <div class="filtro-grupo">
      <label for="filtro-categoria">Categoría</label>
      <select
        id="filtro-categoria"
        :value="filtroCategoria"
        @change="$emit('update:filtroCategoria', $event.target.value)"
        class="select-filtro"
      >
        <option v-for="cat in categorias" :key="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="filtro-grupo">
      <label for="filtro-tipo">Tipo</label>
      <select
        id="filtro-tipo"
        :value="filtroTipo"
        @change="$emit('update:filtroTipo', $event.target.value)"
        class="select-filtro"
      >
        <option>Todos</option>
        <option>ingreso</option>
        <option>gasto</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filtros-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
  background: var(--color-surface);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.filtro-grupo label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.input-wrapper {
  position: relative;
}

.icono-buscar {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

.input-busqueda {
  padding: 8px 12px 8px 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.select-filtro {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }

  .input-busqueda,
  .select-filtro {
    width: 100%;
  }
}
</style>

```