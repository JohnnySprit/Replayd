import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Local only: force project .env over any inherited placeholder DATABASE_URL.
// On Vercel, use the project's Environment Variables — do not override them.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env', override: true })
    dotenv.config({ path: '.env.local', override: true })
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString })

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}
