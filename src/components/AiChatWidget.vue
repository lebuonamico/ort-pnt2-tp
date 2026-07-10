<script setup>
import { nextTick, ref, watch } from 'vue'
import { geminiDisponible, getFinanceChatModel } from '../lib/gemini'
import { crearRespuestaDemo, useFinanceAiContext } from '../composables/useFinanceAiContext'

const abierto = ref(false)
const input = ref('')
const enviando = ref(false)
const mensajesRef = ref(null)

const { crearContextoFinanciero } = useFinanceAiContext()

const mensajes = ref([
  {
    role: 'assistant',
    text: 'Hola, soy tu asistente financiero. Puedo ayudarte a entender tus gastos, ingresos, saldo y movimientos del proyecto.',
  },
])

const sugerencias = [
  'Como viene mi ahorro?',
  'En que categoria gasto mas?',
  'Dame 3 consejos para mejorar mi saldo',
]

const patronesRestringidos = [
  /\btod[ao]s?\s+la\s+informacion\b/i,
  /\btod[ao]s?\s+la\s+info\b/i,
  /\btodo\s+supabase\b/i,
  /\bsupabase\b.*\b(informacion|datos|complet|usuarios?)\b/i,
  /\bbase\s+de\s+datos\b.*\bcomplet/i,
  /\botros?\s+usuarios?\b/i,
  /\bdatos?\s+de\s+usuarios?\b/i,
  /\bemails?\b/i,
  /\bpasswords?\b/i,
  /\bcontrasenas?\b/i,
  /\bclaves?\b/i,
  /\bapi\s*keys?\b/i,
  /\btokens?\b/i,
  /\bsecretos?\b/i,
]

watch(mensajes, async () => {
  await nextTick()
  if (mensajesRef.value) {
    mensajesRef.value.scrollTop = mensajesRef.value.scrollHeight
  }
}, { deep: true })

function toggleChat() {
  abierto.value = !abierto.value
}

function usarSugerencia(texto) {
  input.value = texto
  enviarMensaje()
}

function esSolicitudRestringida(texto) {
  const textoNormalizado = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return patronesRestringidos.some((patron) => patron.test(textoNormalizado))
}

function responderSolicitudRestringida() {
  mensajes.value.push({
    role: 'assistant',
    text: 'Por seguridad no puedo mostrar toda la base de datos, datos sensibles, claves, emails ni informacion de otros usuarios. Si queres, puedo ayudarte con un resumen seguro de tus finanzas: saldo, ingresos, gastos, ahorro, categorias principales y tendencias del usuario logueado.',
  })
}

function historialParaPrompt() {
  return mensajes.value
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.text}`)
    .join('\n')
}

async function enviarMensaje() {
  const pregunta = input.value.trim()
  if (!pregunta || enviando.value) return

  input.value = ''
  mensajes.value.push({ role: 'user', text: pregunta })

  if (esSolicitudRestringida(pregunta)) {
    responderSolicitudRestringida()
    return
  }

  enviando.value = true

  try {
    const contexto = await crearContextoFinanciero()

    if (!geminiDisponible) {
      mensajes.value.push({
        role: 'assistant',
        text: crearRespuestaDemo(pregunta, contexto),
      })
      return
    }

    const model = getFinanceChatModel()
    const prompt = `
Sos el asistente IA de Finanzas Pro, una app de finanzas personales.
Responde siempre en espanol rioplatense, claro y breve.
Tu objetivo es responder preguntas sobre el proyecto y sobre los datos financieros del usuario logueado.
Usa solo el contexto recibido. No inventes datos de otros usuarios ni claves internas.
Si te piden informacion sensible, claves, emails o datos de otros usuarios, rechaza el pedido y ofrece un resumen financiero seguro.

Contexto financiero:
${JSON.stringify(contexto)}

Historial reciente:
${historialParaPrompt()}

Pregunta actual:
${pregunta}
`

    const result = await model.generateContent(prompt)
    const respuesta = result.response.text().trim()

    mensajes.value.push({
      role: 'assistant',
      text: respuesta || 'No pude generar una respuesta en este momento. Probemos con una pregunta mas concreta.',
    })
  } catch (err) {
    console.error('Error al consultar Gemini:', err)
    mensajes.value.push({
      role: 'assistant',
      text: 'No pude generar una respuesta en este momento. Revisa la API key de Gemini o intenta nuevamente en unos segundos.',
    })
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="ai-chat">
    <section v-if="abierto" class="ai-chat-panel" aria-label="Chat IA financiero">
      <header class="ai-chat-header">
        <div>
          <p>Chat IA</p>
          <span>Google Gemini</span>
        </div>
        <button class="ai-icon-button" type="button" title="Cerrar chat" @click="toggleChat">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <div ref="mensajesRef" class="ai-chat-messages">
        <div
          v-for="(mensaje, index) in mensajes"
          :key="index"
          :class="['ai-message', mensaje.role === 'user' ? 'ai-message-user' : 'ai-message-assistant']"
        >
          {{ mensaje.text }}
        </div>
        <div v-if="enviando" class="ai-message ai-message-assistant ai-message-loading">
          Pensando...
        </div>
      </div>

      <div class="ai-chat-suggestions">
        <button
          v-for="sugerencia in sugerencias"
          :key="sugerencia"
          type="button"
          @click="usarSugerencia(sugerencia)"
        >
          {{ sugerencia }}
        </button>
      </div>

      <form class="ai-chat-form" @submit.prevent="enviarMensaje">
        <textarea
          v-model="input"
          rows="2"
          placeholder="Preguntame sobre tus finanzas..."
          @keydown.enter.exact.prevent="enviarMensaje"
        ></textarea>
        <button class="ai-send-button" type="submit" title="Enviar mensaje" :disabled="enviando || !input.trim()">
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </section>

    <button class="ai-chat-fab" type="button" title="Abrir Chat IA" @click="toggleChat">
      <span class="material-symbols-outlined">{{ abierto ? 'expand_more' : 'smart_toy' }}</span>
    </button>
  </div>
</template>

<style scoped>
.ai-chat {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 220;
  font-family: var(--font-body);
}

.ai-chat-fab {
  width: 58px;
  height: 58px;
  border: 0;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 32px rgba(0, 106, 97, 0.28);
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease;
}

.ai-chat-fab:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.ai-chat-fab .material-symbols-outlined {
  font-size: 28px;
}

.ai-chat-panel {
  position: absolute;
  right: 0;
  bottom: 74px;
  width: min(380px, calc(100vw - 28px));
  height: min(560px, calc(100vh - 118px));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card-hover);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-chat-header {
  padding: 16px;
  background: #0b1c30;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ai-chat-header p {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 800;
}

.ai-chat-header span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}

.ai-icon-button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ai-icon-button .material-symbols-outlined {
  font-size: 20px;
}

.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-bg-page);
}

.ai-message {
  width: fit-content;
  max-width: 88%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ai-message-assistant {
  align-self: flex-start;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 5px;
}

.ai-message-user {
  align-self: flex-end;
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-bottom-right-radius: 5px;
}

.ai-message-loading {
  color: var(--color-text-muted);
}

.ai-chat-suggestions {
  padding: 10px 12px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  background: var(--color-surface);
}

.ai-chat-suggestions button {
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 7px 10px;
  cursor: pointer;
}

.ai-chat-suggestions button:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.ai-chat-form {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 10px;
  padding: 12px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.ai-chat-form textarea {
  width: 100%;
  min-width: 0;
  resize: none;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 10px 12px;
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  background: var(--color-surface-2);
  color: var(--color-text-primary);
}

.ai-chat-form textarea:focus {
  border-color: var(--color-accent);
}

.ai-send-button {
  width: 42px;
  height: 42px;
  align-self: end;
  border: 0;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ai-send-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ai-send-button .material-symbols-outlined {
  font-size: 20px;
}

@media (max-width: 480px) {
  .ai-chat {
    right: 14px;
    bottom: 14px;
  }

  .ai-chat-panel {
    bottom: 68px;
    height: min(540px, calc(100vh - 94px));
  }
}
</style>
