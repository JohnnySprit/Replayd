import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { getPuuid, getRecentMatchIds, getMatch, getMatchTimeline } from './lib/riot'
import { trimMatch, trimTimeline } from './lib/trimmer'

async function test() {
    try {

        const { getCoachingReport } = await import('./lib/openai')

        console.log('1. Getting puuid...')
        const puuid = await getPuuid('Cluimdid', 'NA1')
        console.log('puuid:', puuid)

        console.log('2. Getting recent matches...')
        const matchIds = await getRecentMatchIds(puuid)
        console.log('matchIds:', matchIds)

        console.log('3. Getting match data...')
        const matchData = await getMatch(matchIds[0])
        console.log('match fetched:', matchData.metadata.matchId)

        console.log('4. Transforming match...')
        const summary = trimMatch(matchData, puuid)
        console.log('summary built for:', summary.targetPlayer.summonerName)

        console.log('5. Getting timeline...')
        const timeline = await getMatchTimeline(matchIds[0])
        console.log('timeline frames:', timeline.info.frames.length)

        console.log('6. Transforming timeline...')
        const timelineInsights = trimTimeline(timeline, puuid, matchData)
        console.log('timeline insights:', JSON.stringify(timelineInsights, null, 2))

        console.log('7. Getting coaching report...')
        const report = await getCoachingReport(summary, timelineInsights)
        console.log('\nCOACHING REPORT:\n', report)

    } catch (err) {
        console.error('Error:', err)
    }
}

test()