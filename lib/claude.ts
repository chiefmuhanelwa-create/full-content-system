import Anthropic from '@anthropic-ai/sdk'

// Lazy initialization to handle both build and runtime
let _anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (_anthropic) {
    return _anthropic
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  // During build time, use a placeholder
  if (!apiKey || apiKey === '') {
    console.warn('ANTHROPIC_API_KEY not found, using placeholder for build')
    _anthropic = new Anthropic({
      apiKey: 'build-time-placeholder',
    })
    return _anthropic
  }

  _anthropic = new Anthropic({
    apiKey: apiKey,
  })

  return _anthropic
}

// Export getter function that returns the client
export const anthropic = new Proxy({} as Anthropic, {
  get: (target, prop) => {
    const client = getAnthropicClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

export const MODELS = {
  SONNET: 'claude-sonnet-4-6',
  HAIKU: 'claude-haiku-4-5-20251001',
  OPUS: 'claude-opus-4-7',
} as const

export type ModelName = typeof MODELS[keyof typeof MODELS]
