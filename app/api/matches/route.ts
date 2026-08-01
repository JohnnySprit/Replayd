import { NextRequest, NextResponse } from 'next/server'
import { getPuuid, getRecentMatchIds, getMatch } from '@/lib/riot'
import { trimMatchPreview, MatchPreview } from '@/lib/trimmer'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { gameName, tagLine, region } = body

        if (!gameName || !tagLine || !region) {
            return NextResponse.json(
                { error: 'gameName, tagLine, and region are required' },
                { status: 400 }
            )
        }

        // step 1: get puuid from riot id
        const puuid = await getPuuid(gameName, tagLine, region)

        // step 2: get all recent match ids (10) for the user to select from
        const matchIds = await getRecentMatchIds(puuid, region)

        const matchPreviews: MatchPreview[] = []

        // step 3: get the match previews for the user
        for (const matchId of matchIds) {
            const matchData = await getMatch(matchId, region)
            const matchPreview = trimMatchPreview(matchData, puuid)
            matchPreviews.push(matchPreview)
        }

        return NextResponse.json({
            success: true,
            matchPreviews: matchPreviews,
        })

    } catch (err: any) {
        console.error('Analysis error:', err)
        return NextResponse.json(
            { error: err.message || 'Something went wrong' },
            { status: 500 }
        )
    }
}