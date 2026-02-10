import { db } from './db'

export const DEFAULT_USER_ID = 'default-user-id'

/**
 * Ensures the default user exists in the database
 * Creates the user if it doesn't exist
 * Returns the user object
 */
export async function ensureDefaultUser() {
  if (!db) {
    throw new Error('Database not configured')
  }

  try {
    // Try to find existing user
    let user = await db.user.findUnique({
      where: { id: DEFAULT_USER_ID }
    })

    // Create user if it doesn't exist
    if (!user) {
      console.log('Creating default user...')
      user = await db.user.create({
        data: {
          id: DEFAULT_USER_ID,
          email: 'default@nochill.app',
          name: 'Default User',
          plan: 'pro',
          credits: 999999,
        }
      })
      console.log('✅ Default user created successfully')
    }

    return user
  } catch (error: any) {
    console.error('Error ensuring default user:', error)
    throw error
  }
}
