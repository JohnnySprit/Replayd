const RIOT_API_KEY = process.env.RIOT_API_KEY
const REGIONAL_BASE = 'https://americas.api.riotgames.com'
const PLATFORM_BASE = 'https://na1.api.riotgames.com'

export async function getPuuid(gameName: string, tagLine: string): Promise<string> {
    const res = await fetch(
        `${REGIONAL_BASE}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.RIOT_API_KEY}`
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

export async function getRecentMatchIds(puuid: string, count = 5): Promise<string[]> {
    const res = await fetch(
        `${REGIONAL_BASE}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.RIOT_API_KEY}`
    )

    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)

    const matchIds = await res.json()

    if (matchIds.length === 0) {
        throw new Error('No recent matches found for this player.')
    }

    return matchIds
}

export async function getMatch(matchId: string): Promise<any> {
    const res = await fetch(
        `${REGIONAL_BASE}/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
    )
    if (res.status === 404) {
        throw new Error(`No match found with ID ${matchId}.`)
    }
    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)
    return res.json()
}

export async function getMatchTimeline(matchId: string): Promise<any> {
    const url = `${REGIONAL_BASE}/lol/match/v5/matches/${matchId}/timeline?api_key=${process.env.RIOT_API_KEY}`
    const res = await fetch(url)
    if (res.status === 404) {
        throw new Error(`No timeline found for match ID ${matchId}.`)
    }
    if (!res.ok) throw new Error(`Riot API error: ${res.status}`)
    return res.json()
}