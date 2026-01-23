import Anthropic from '@anthropic-ai/sdk'

// During build time, use a placeholder. At runtime, the actual key must exist.
const apiKey = process.env.ANTHROPIC_API_KEY || 'build-time-placeholder'

export const anthropic = new Anthropic({
  apiKey: apiKey,
})

// Runtime validation - will throw error when API is actually called if key is missing
export function validateApiKey() {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'build-time-placeholder') {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable')
  }
}

export const MODELS = {
  SONNET: 'claude-sonnet-4-20250514',
  HAIKU: 'claude-3-5-haiku-20241022',
  OPUS: 'claude-opus-4-5-20251101',
} as const

export type ModelName = typeof MODELS[keyof typeof MODELS]
