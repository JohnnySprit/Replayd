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
    items: number[]
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

export function transformMatch(matchData: any, targetPuuid: string): MatchSummary {
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
        items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5],
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