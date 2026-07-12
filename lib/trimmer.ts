import { getItemNames, toDataDragonVersion } from "./datadragon"


export interface PlayerSummary {
    summonerName: string
    champion: string
    role: string
    kills: number
    deaths: number
    assists: number
    cs: number
    goldEarned: number
    damageToChampions: number
    visionScore: number
    wardsPlaced: number
    win: boolean
    items: { id: number, name: string }[]
    roleQuestItem: { id: number, name: string } | null
}

export interface MatchSummary {
    matchId: string
    gameDurationMinutes: number
    queueType: string
    targetPlayer: PlayerSummary
    allPlayers: PlayerSummary[]
    teamObjectives: {
        ourTeam: Record<string, number>
        enemyTeam: Record<string, number>
    }
}

export interface MatchPreview {
    matchId: string
    champion: string
    win: boolean
    kills: number
    deaths: number
    assists: number
}

export function trimMatchPreview(matchData: any, targetPuuid: string): MatchPreview {
    const p = matchData.info.participants.find((p: any) => p.puuid === targetPuuid)
    return {
        matchId: matchData.metadata.matchId,
        champion: p.championName,
        win: p.win,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
    }
}

export async function trimMatch(matchData: any, targetPuuid: string): Promise<MatchSummary> {
    const ddVersion = toDataDragonVersion(matchData.info.gameVersion)
    const itemNames = await getItemNames(ddVersion)
    const info = matchData.info
    const gameDurationMinutes = Math.round(info.gameDuration / 60)

    // find the player we care about
    const targetParticipant = info.participants.find(
        (p: any) => p.puuid === targetPuuid
    )

    if (!targetParticipant) {
        throw new Error('Player not found in match data')
    }

    const targetTeamId = targetParticipant.teamId

    // map all participants to clean summaries
    const allPlayers: PlayerSummary[] = info.participants.map((p: any) => ({
        summonerName: p.riotIdGameName,
        champion: p.championName,
        role: p.teamPosition,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        cs: p.totalMinionsKilled + p.neutralMinionsKilled,
        goldEarned: p.goldEarned,
        damageToChampions: p.totalDamageDealtToChampions,
        visionScore: p.visionScore,
        wardsPlaced: p.wardsPlaced,
        win: p.win,
        items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((itemId: number) => {
            if (itemId === 0) {
                return { id: 0, name: 'Empty' }
            }
            const name = itemNames[itemId.toString()]
            return { id: itemId, name: name || 'Unknown Item' }
        }),
        roleQuestItem: p.roleBoundItem ? { id: p.roleBoundItem, name: itemNames[p.roleBoundItem.toString()] || 'Unknown Item' } : null
    }))

    const targetPlayer = allPlayers.find(
        (p) => p.summonerName === targetParticipant.riotIdGameName
    )!

    // separate team objectives
    const ourTeamData = info.teams.find((t: any) => t.teamId === targetTeamId)
    const enemyTeamData = info.teams.find((t: any) => t.teamId !== targetTeamId)

    const extractObjectives = (team: any) => ({
        barons: team.objectives.baron.kills,
        dragons: team.objectives.dragon.kills,
        towers: team.objectives.tower.kills,
        riftHeralds: team.objectives.riftHerald.kills,
        kills: team.objectives.champion.kills,
    })

    return {
        matchId: matchData.metadata.matchId,
        gameDurationMinutes,
        queueType: info.queueId === 420 ? 'Ranked Solo' : 'Normal',
        targetPlayer,
        allPlayers,
        teamObjectives: {
            ourTeam: extractObjectives(ourTeamData),
            enemyTeam: extractObjectives(enemyTeamData),
        },
    }
}


export interface TimelineInsight {
    goldDiffAt10: number
    goldDiffAt15: number
    goldDiffAt20: number
    csDiffAt10: number
    csDiffAt15: number
    deathTimings: { minute: number, killerChampion: string }[]
    keyEvents: { minute: number, description: string }[]
}

export function trimTimeline(
    timelineData: any,
    targetPuuid: string,
    matchData: any
): TimelineInsight {
    const frames = timelineData.info.frames

    // find participant ID from puuid index
    const puuids = timelineData.metadata.participants
    const participantIndex = puuids.indexOf(targetPuuid)
    const participantId = (participantIndex + 1).toString()

    // find lane opponent (same role, opposite team)
    const participants = matchData.info.participants
    const targetParticipant = participants.find((p: any) => p.puuid === targetPuuid)
    const targetRole = targetParticipant.teamPosition
    const targetTeamId = targetParticipant.teamId

    const laneOpponent = participants.find(
        (p: any) => p.teamPosition === targetRole && p.teamId !== targetTeamId
    )

    const opponentIndex = laneOpponent
        ? puuids.indexOf(laneOpponent.puuid)
        : -1
    const opponentId = opponentIndex >= 0 ? (opponentIndex + 1).toString() : null

    // helper to get gold diff at a specific minute
    function getGoldDiff(minute: number): number {
        const frame = frames[minute]
        if (!frame || !opponentId) return 0
        const myGold = frame.participantFrames[participantId]?.totalGold || 0
        const theirGold = frame.participantFrames[opponentId]?.totalGold || 0
        return myGold - theirGold
    }

    // helper to get cs diff at a specific minute
    function getCsDiff(minute: number): number {
        const frame = frames[minute]
        if (!frame || !opponentId) return 0
        const myCs = frame.participantFrames[participantId]?.minionsKilled || 0
        const theirCs = frame.participantFrames[opponentId]?.minionsKilled || 0
        return myCs - theirCs
    }

    // extract death timings and key events
    const deathTimings: { minute: number, killerChampion: string }[] = []
    const keyEvents: { minute: number, description: string }[] = []

    frames.forEach((frame: any, frameIndex: number) => {
        frame.events.forEach((event: any) => {
            const minute = Math.floor(event.timestamp / 60000)

            // track player deaths
            if (event.type === 'CHAMPION_KILL' && event.victimId?.toString() === participantId) {
                const killer = participants.find(
                    (p: any) => puuids.indexOf(p.puuid) + 1 === event.killerId
                )
                deathTimings.push({
                    minute,
                    killerChampion: killer?.championName || 'Unknown',
                })
            }

            // track objective events
            if (event.type === 'ELITE_MONSTER_KILL') {
                const killer = participants.find(
                    (p: any) => puuids.indexOf(p.puuid) + 1 === event.killerId
                )
                const isOurTeam = killer?.teamId === targetTeamId
                keyEvents.push({
                    minute,
                    description: `${isOurTeam ? 'Allied' : 'Enemy'} team killed ${event.monsterType}`,
                })
            }

            // track tower kills
            if (event.type === 'BUILDING_KILL') {
                const isOurTeam = event.teamId !== targetTeamId
                keyEvents.push({
                    minute,
                    description: `${isOurTeam ? 'Allied' : 'Enemy'} team took a ${event.buildingType}`,
                })
            }
        })
    })

    return {
        goldDiffAt10: getGoldDiff(10),
        goldDiffAt15: getGoldDiff(15),
        goldDiffAt20: getGoldDiff(20),
        csDiffAt10: getCsDiff(10),
        csDiffAt15: getCsDiff(15),
        deathTimings,
        keyEvents,
    }
}