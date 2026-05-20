import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getPuuid, getRecentMatchIds, getMatchTimeline } from './lib/riot'
import { transformMatch } from './lib/trimmer'

async function test() {
    try {
        console.log('1. Getting puuid...')
        const puuid = await getPuuid('whitearmor', '662')
        console.log('puuid:', puuid)

        console.log('2. Getting recent matches...')
        const matchIds = await getRecentMatchIds(puuid)
        console.log('matchIds:', matchIds)

        console.log('3. Getting recent matches...')
        const matchTimeline = await getMatchTimeline(matchIds[0])
        console.log('matchTimeline:', matchTimeline)
        console.log('first frame:', JSON.stringify(matchTimeline.info.frames[1], null, 2))



    } catch (err) {
        console.error('Error:', err)
    }
}

test()