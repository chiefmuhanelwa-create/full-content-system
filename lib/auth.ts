import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'chiefmuhanelwa@gmail.com'
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || ''

let prisma: any = null
try {
  if (process.env.DATABASE_URL) {
    prisma = require('./db').db
  }
} catch {}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Owner bypass — direct comparison, works without DB
        if (
          OWNER_PASSWORD &&
          credentials.email === OWNER_EMAIL &&
          credentials.password === OWNER_PASSWORD
        ) {
          return { id: 'owner', email: OWNER_EMAIL, name: 'Ndivhuwo', image: null }
        }

        // DB user lookup
        if (prisma) {
          try {
            const user = await prisma.user.findUnique({ where: { email: credentials.email } })
            if (user?.password && await bcrypt.compare(credentials.password, user.password)) {
              return { id: user.id, email: user.email, name: user.name, image: user.image }
            }
          } catch {}
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.email = user.email }
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
