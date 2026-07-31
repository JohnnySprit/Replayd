import { NextResponse, NextRequest } from 'next/server';
import { SAMPLE_MATCH_IDS } from '@/lib/samples';
import { db } from '@/lib/db';

export async function GET(  request: Request, context: { params: Promise<{ matchId: string }> }) {
    try {
        const { matchId } = await context.params

        if (!SAMPLE_MATCH_IDS.includes(matchId)) {
            return NextResponse.json({ error: 'Not a sample' }, { status: 404 })
        }

        const report = await db.report.findUnique({ where: { matchId } })
        if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({
            success: true,
            matchId: report.matchId,
            player: report.player,
            report: report.report,
        })

    } catch (error) {
        console.error('Error fetching samples:', error)
        return NextResponse.json({ error: 'Failed to fetch samples' }, { status: 500 })
    }
}