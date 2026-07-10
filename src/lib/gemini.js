import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'

export const geminiDisponible = Boolean(apiKey)

const genAI = geminiDisponible ? new GoogleGenerativeAI(apiKey) : null

export function getFinanceChatModel() {
  if (!genAI) return null

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.45,
      topP: 0.9,
      maxOutputTokens: 700,
    },
  })
}
