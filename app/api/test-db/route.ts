import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    const ping = await db.testPing.create({
        data: { message: 'hello from Replayd' },
    })

    const allPings = await db.testPing.findMany()

    return NextResponse.json({ created: ping, all: allPings })
}