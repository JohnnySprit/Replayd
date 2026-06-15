import { NextRequest, NextResponse } from 'next/server'
import { getPuuid, getRecentMatchIds, getMatch, getMatchTimeline } from '@/lib/riot'
import { trimMatch, trimTimeline } from '@/lib/trimmer'
import { getCoachingReport } from '@/lib/openai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { gameName, tagLine, region, matchId } = body

        if (!gameName || !tagLine) {
            return NextResponse.json(
                { error: 'gameName, tagLine, and region are required' },
                { status: 400 }
            )
        }

        // step 1: get puuid from riot id
        const puuid = await getPuuid(gameName, tagLine)

        // step 2: get match id — either user provided one or we use their most recent
        let targetMatchId = matchId
        if (!targetMatchId) {
            const matchIds = await getRecentMatchIds(puuid)
            targetMatchId = matchIds[0]
        }

        // step 3: fetch match and timeline in parallel
        const [matchData, timelineData] = await Promise.all([
            getMatch(targetMatchId),
            getMatchTimeline(targetMatchId),
        ])

        // step 4: transform both
        const summary = trimMatch(matchData, puuid)
        const timelineInsights = trimTimeline(timelineData, puuid, matchData)

        // step 5: get coaching report
        const report = await getCoachingReport(summary, timelineInsights)

        return NextResponse.json({
            success: true,
            matchId: targetMatchId,
            player: summary.targetPlayer,
            report,
        })

    } catch (err: any) {
        console.error('Analysis error:', err)
        return NextResponse.json(
            { error: err.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}