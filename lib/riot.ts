/* eslint-disable @typescript-eslint/no-explicit-any */
const matchCache = new Map<string, any>()

const REGIONAL_ROUTING: Record<string, string> = {
    NA: 'americas',
    BR: 'americas',
    LAN: 'americas',
    LAS: 'americas',
    EUW: 'europe',
    EUNE: 'europe',
    TR: 'europe',
    RU: 'europe',
    KR: 'asia',
    JP: 'asia',
}

function getRegionalBase(region: string): string {
    const routing = REGIONAL_ROUTING[region.toUpperCase()]
    if (!routing) throw new Error(`Unknown region: ${region}`)
    return `https://${routing}.api.riotgames.com`
}

export async function getPuuid(gameName: string, tagLine: string, region: string): Promise<string> {
    const regionBase = getRegionalBase(region)
    const res = await fetch(
        `${regionBase}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.RIOT_API_KEY}`
    )

    if (res.status === 404) {
        throw new Error(`No player found with name "${gameName}#${tagLine}".`)
    }
    if (!res.ok) {
        throw new Error(`Riot API error: ${res.status}`)
    }

    const data = await res.json()
    return data.puuid
}

export async function getRecentMatchIds(puuid: string, region: string, count = 10): Promise<string[]> {
    const regionBase = getRegionalBase(region)
    const res = await fetch(
        `${regionBase}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.RIOT_API_KEY}`
    )

    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)

    const matchIds = await res.json()

    if (matchIds.length === 0) {
        throw new Error('No recent matches found for this player.')
    }

    return matchIds
}

export async function getMatch(matchId: string, region: string): Promise<any> {
    const regionBase = getRegionalBase(region)
    if (matchCache.has(matchId)) {
        return matchCache.get(matchId)
    }

    const res = await fetch(
        `${regionBase}/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
    )
    if (res.status === 404) throw new Error(`No match found with ID ${matchId}.`)
    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)

    const data = await res.json()
    matchCache.set(matchId, data)
    return data
}

export async function getMatchTimeline(matchId: string, region: string): Promise<any> {
    const regionBase = getRegionalBase(region)
    const url = `${regionBase}/lol/match/v5/matches/${matchId}/timeline?api_key=${process.env.RIOT_API_KEY}`
    const res = await fetch(url)
    if (res.status === 404) {
        throw new Error(`No timeline found for match ID ${matchId}.`)
    }
    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)
    return res.json()
}