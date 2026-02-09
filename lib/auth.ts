import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

// Only import db if DATABASE_URL is configured
let db: any = null
if (process.env.DATABASE_URL) {
  db = require('./db').db
}

const providers = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials')
      }

      // If no database is configured, use a demo user for testing
      if (!db) {
        // Demo credentials: demo@example.com / demo123
        if (credentials.email === 'demo@example.com') {
          const demoPasswordHash = '$2a$10$YourHashedPasswordHere' // This won't match, just for structure
          // For demo, accept password "demo123"
          if (credentials.password === 'demo123') {
            return {
              id: 'demo-user-id',
              email: 'demo@example.com',
              name: 'Demo User',
              image: null,
            }
          }
        }
        throw new Error('Invalid credentials - Database not configured')
      }

      const user = await db.user.findUnique({
        where: {
          email: credentials.email,
        },
      })

      if (!user || !user.password) {
        throw new Error('Invalid credentials')
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        user.password
      )

      if (!isCorrectPassword) {
        throw new Error('Invalid credentials')
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },
  }),
]

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Build auth options with conditional adapter
const authConfig: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
}

// Only add adapter if database is configured
if (db) {
  authConfig.adapter = PrismaAdapter(db)
}

export const authOptions = authConfig
