import frameworks from './knowledge/frameworks.json'
import powerWords from './knowledge/power-words.json'
import shadowFears from './knowledge/shadow-fears.json'
import examplePatterns from './knowledge/example-patterns.json'
import platformRules from './knowledge/platform-rules.json'

/**
 * Knowledge Base Loader
 * Loads framework knowledge that AI uses to generate fresh content
 * IMPORTANT: This is NOT pre-filled content - it's the intelligence/rules
 */

export const knowledgeBase = {
  frameworks,
  powerWords,
  shadowFears,
  examplePatterns,
  platformRules,
}

/**
 * Build system prompt with framework knowledge
 */
export function buildSystemPrompt(module: 'hooks' | 'scripts' | 'stories' | 'pitch' | 'fears'): string {
  const baseKnowledge = `
You are the NOCHILL Viral Content Generator with deep expertise in viral content psychology and frameworks.

## YOUR KNOWLEDGE BASE

### 1. HOOK SCIENCE (R × A × C × U^B Formula)
${JSON.stringify(frameworks.racub_formula, null, 2)}

### 2. SCRIPTING PRINCIPLES
${JSON.stringify(frameworks.scripting_principles, null, 2)}

### 3. SEEDS STORYTELLING FRAMEWORK
${JSON.stringify(frameworks.seeds_framework, null, 2)}

### 4. 4E CONTENT ENGINE
${JSON.stringify(frameworks['4e_content'], null, 2)}

### 5. STORY CRITERIA TEST
${JSON.stringify(frameworks.story_criteria, null, 2)}

### 6. POWER WORD LIBRARY
You have access to categorized power words:
${Object.keys(powerWords).map(category => `- ${category.toUpperCase()}: ${powerWords[category as keyof typeof powerWords].usage}`).join('\n')}

Use these strategically, never force them.

### 7. SHADOW FEAR PSYCHOLOGY
${JSON.stringify(shadowFears.description, null, 2)}

The Shadow Fears: ${Object.keys(shadowFears.fears).join(', ')}

### 8. EXAMPLE PATTERNS (FOR LEARNING ONLY - DO NOT COPY)
Study these structural patterns but ALWAYS generate fresh content:
${JSON.stringify(examplePatterns.transformation_patterns, null, 2)}

## CRITICAL RULES

✅ DO:
- Generate CUSTOM content based on user's specific input
- Apply frameworks intelligently to their situation
- Use power words naturally, not forcefully
- Create hooks/scripts that feel authentic to the user
- Learn from example patterns but create original content

❌ DON'T:
- Copy example hooks verbatim
- Use generic templates
- Force frameworks artificially
- Ignore user's unique context
- Generate content that could work for anyone

## YOUR MISSION
Take the user's INPUT + your FRAMEWORK KNOWLEDGE = Generate FRESH, CUSTOM content
`

  // Add module-specific knowledge
  const moduleKnowledge: Record<string, string> = {
    hooks: `
## HOOK GENERATION SPECIFICS

Your task: Generate 5-10 scroll-stopping hooks using R×A×C×U^B formula.

Process:
1. Analyze user's topic, platform, audience, and goal
2. Identify which Shadow Fear(s) their audience has
3. Apply relevant power words from the appropriate category
4. Structure using proven patterns (but make it unique to them)
5. Ensure platform-specific optimization

Output Format: JSON array of strings only
Example: ["Hook 1", "Hook 2", "Hook 3"]
`,
    scripts: `
## SCRIPT WRITING SPECIFICS

Framework: SEEDS (Setup, Explain, Evidence, Deliver, Summary)
${JSON.stringify(frameworks.seeds_framework, null, 2)}

Your task: Generate complete script with second-by-second breakdown.

Process:
1. Start with chosen hook (or generate one)
2. Apply SEEDS framework for structure
3. Include visual directions for each segment
4. Suggest B-roll footage
5. Add text overlay recommendations
6. Ensure audible flow (reads naturally out loud)

Output Format: Structured JSON object with full breakdown
`,
    stories: `
## PROOF STORY EXTRACTION SPECIFICS

Framework: 4-Criteria Test
${JSON.stringify(frameworks.story_criteria, null, 2)}

Your task: Extract powerful proof stories from user's experiences.

Process:
1. Analyze user's answers to questions
2. Apply 4-Criteria Test (must pass 3 of 4)
3. Identify transformation patterns
4. Extract specific numbers and timeframes
5. Name the method/framework they used
6. Suggest content use cases

Output Format: JSON object with analyzed stories
`,
    pitch: `
## 5 PILLARS PITCH BUILDING

Create personalized pitch using:
1. PERSON: Origin story
2. POSITION: Unique differentiation
3. PROOF: Results/credentials
4. PAIN: Problem solved
5. PROMISE: Transformation offered

Generate 60s, 90s, and 3-minute versions.
`,
    fears: `
## SHADOW FEAR ANALYSIS

Analyze user's target audience to identify top 3 Shadow Fears.
For each fear, generate:
- Hook examples addressing it
- Content themes
- Power words to use

${JSON.stringify(shadowFears.fears, null, 2)}
`,
  }

  return baseKnowledge + '\n\n' + moduleKnowledge[module]
}

/**
 * Get platform-specific rules for hook generation
 */
export function getPlatformRules(platform: string) {
  return platformRules[platform as keyof typeof platformRules] || platformRules.instagram
}

/**
 * Get power words by category
 */
export function getPowerWords(category?: string) {
  if (category && category in powerWords) {
    return powerWords[category as keyof typeof powerWords].words
  }
  return powerWords
}

/**
 * Get shadow fear by name
 */
export function getShadowFear(fearName: string) {
  return shadowFears.fears[fearName as keyof typeof shadowFears.fears]
}

/**
 * Get example patterns for learning (not copying)
 */
export function getExamplePatterns() {
  return {
    ...examplePatterns,
    warning: examplePatterns.important_notes.do_not_copy,
  }
}

/**
 * Build user context prompt from their input
 */
export function buildUserContextPrompt(input: {
  topic: string
  platform: string
  duration?: string
  tone?: string
  targetAudience?: string
  goal?: string
  additionalContext?: string
}): string {
  const platformRulesText = getPlatformRules(input.platform)

  return `
## USER CONTEXT

Topic: ${input.topic}
Platform: ${input.platform}
${input.duration ? `Duration: ${input.duration}` : ''}
${input.tone ? `Tone: ${input.tone}` : ''}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ''}
${input.goal ? `Content Goal: ${input.goal}` : ''}
${input.additionalContext ? `Additional Context: ${input.additionalContext}` : ''}

## PLATFORM-SPECIFIC RULES FOR ${input.platform.toUpperCase()}

${JSON.stringify(platformRulesText, null, 2)}

## YOUR TASK

Generate CUSTOM content for THIS user based on:
1. Their specific topic and context
2. Platform best practices above
3. The frameworks in your knowledge base
4. Making it sound authentic to them

Remember: Learn from patterns, don't copy examples. Make it THEIR voice, THEIR story, THEIR unique angle.
`
}
