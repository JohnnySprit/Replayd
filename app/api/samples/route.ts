import { NextResponse } from 'next/server';
import { SAMPLE_MATCH_IDS } from '@/lib/samples';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const samples = await db.report.findMany({
            where: { matchId: { in: [...SAMPLE_MATCH_IDS] } },
        })
        return NextResponse.json({ success: true, samples: samples })
    } catch (error) {
        console.error('Error fetching samples:', error)
        return NextResponse.json({ error: 'Failed to fetch samples' }, { status: 500 })
    }
}