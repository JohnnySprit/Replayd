import { NextRequest, NextResponse } from 'next/server'
import { getPuuid, getRecentMatchIds, getMatch, getMatchTimeline } from '@/lib/riot'
import { trimMatch, trimTimeline } from '@/lib/trimmer'
import { getCoachingReport } from '@/lib/openai'
import { db } from '@/lib/db'

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
        const puuid = await getPuuid(gameName, tagLine, region)

        // step 2: get match id thats either user provided one or we use their most recent
        let targetMatchId = matchId
        if (!targetMatchId) {
            const matchIds = await getRecentMatchIds(puuid, region)
            targetMatchId = matchIds[0]
        }

        const existingMatch = await db.report.findUnique({
            where: {
                matchId: targetMatchId,
                puuid,
            },
        })

        if (existingMatch) {
            return NextResponse.json({
                success: true,
                matchId: targetMatchId,
                player: existingMatch.player,
                report: existingMatch.report,
            })
        }

        // step 3: fetch match and timeline in parallel to speed up the process
        const [matchData, timelineData] = await Promise.all([
            getMatch(targetMatchId, region),
            getMatchTimeline(targetMatchId, region),
        ])

        // step 4: transform both
        const summary = await trimMatch(matchData, puuid)
        const timelineInsights = trimTimeline(timelineData, puuid, matchData)

        // step 5: finally get coaching report
        const report = await getCoachingReport(summary, timelineInsights)

        // step 6: save the match and report to the database
        await db.report.create({
            data: {
                matchId: targetMatchId,
                puuid,
                gameName: gameName,
                player: JSON.parse(JSON.stringify(summary.targetPlayer)),
                report: report,
            },
        })

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