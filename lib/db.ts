import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Next.js does not override an already-set DATABASE_URL (e.g. a Cursor
// placeholder). Force the project env files so the app uses Supabase.
dotenv.config({ path: '.env', override: true })
dotenv.config({ path: '.env.local', override: true })

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}
