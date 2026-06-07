<script setup>
import { useNuevaTransaccion } from '../composables/useNuevaTransaccion'

const { tipo, monto, concepto, categorias, categoria, fecha, notas, guardar } = useNuevaTransaccion()

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'guardado'])

const cerrar = () => {
  emit('close')
}

const guardarYCerrar = async () => {
  await guardar()
  emit('guardado')
  cerrar()
}

</script>

<template>
  <div v-if="show" class="overlay" @click.self="cerrar"> <!-- fondo oscuro-->
    <div class="modal">                          <!-- popup blanco-->
        <!--titulo y boton de cerrar-->
        <div class="modal-header">                 <!-- alinea el titulo y el boton de cerrar-->
            <h2>Nueva Transacción</h2>               <!-- titulo-->
            <button class= "btn-cerrar"@click="cerrar">✕</button>      <!-- el boton cerrar-->
        </div>

        <!--toggle gasto ingreso-->
        <div class="toggle">                      <!-- toggle que sirve para cambiar entre ingreso y gasto-->
            <button :class="{ activo: tipo === 'ingreso' }" @click="tipo = 'ingreso'">Ingreso</button>
            <button :class="{ activo: tipo === 'gasto' }" @click="tipo = 'gasto'">Gasto</button>
        </div>

        <!--ingreso del monto-->
        <div class="campo">
        <label>MONTO</label>                <!-- descripcion-->
        <div class="monto-input">           <!-- caja con $ y el input -->
            <span>$</span>
            <input type="number" v-model="monto" min="0" step="0.01" />   <!-- con vmodel hacemos que este monto sea bidireccional con la variable-->
        </div>
        </div>

        <!--concepto de la transaccion-->
        <div class="campo">
            <label>CONCEPTO</label>         <!-- descripcion-->
            <input type="text" v-model="concepto" placeholder="Ej. Compra de supermercado" /><!-- con vmodel hacemos que el concepto sea bidireccional con la variable-->
        </div>
        
        <!--categoria de la transaccion-->
        <div class="campo">
            <label>CATEGORÍA</label>
            <select v-model="categoria">
              <option :value="null" disabled>Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat">
                {{ cat.nombre }}
              </option>
            </select>
        </div>

        <!--fecha-->
        <div class="campo">
            <label>FECHA</label>
            <input type="date" v-model="fecha" />  <!-- selecciono fecha-->
        </div>

        <!--notas-->
        <div class="campo">
            <label>NOTAS (OPCIONAL)</label>
            <textarea v-model="notas" placeholder="Detalles adicionales..."></textarea>
        </div>

        <!--botones de guardar y cancelar-->
        <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrar">Cancelar</button>
            <button class="btn-guardar" @click="guardarYCerrar">Guardar</button>
        </div>


</div>
</div>                                       
  
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: 700;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
}

.toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
}

.toggle button.activo {
  background: white;
  color: #006a61;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.campo input,
.campo select,
.campo textarea {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
}

.campo textarea {
  resize: none;
  height: 80px;
}

.monto-input {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  gap: 8px;
}

.monto-input span {
  color: #94a3b8;
  font-size: 18px;
}

.monto-input input {
  border: none;
  outline: none;
  font-size: 28px;
  font-weight: 700;
  text-align: right;
  width: 100%;
  padding: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancelar {
  padding: 12px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-guardar {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: #006a61;
  color: white;
  cursor: pointer;
  font-weight: 600;
}
</style>