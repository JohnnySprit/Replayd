import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

function buildCoachingPrompt(summary: any, timeline: any): string {
    const p = summary.targetPlayer
    const our = summary.teamObjectives.ourTeam
    const enemy = summary.teamObjectives.enemyTeam

    const teammates = summary.allPlayers
        .filter((player: any) => player.win === p.win && player.summonerName !== p.summonerName)
        .map((player: any) =>
            `${player.summonerName} (${player.champion}, ${player.role}): ${player.kills}/${player.deaths}/${player.assists}, ${player.cs} CS, ${player.damageToChampions} damage`
        )
        .join('\n')

    const enemies = summary.allPlayers
        .filter((player: any) => player.win !== p.win)
        .map((player: any) =>
            `${player.champion} (${player.role}): ${player.kills}/${player.deaths}/${player.assists}, ${player.cs} CS`
        )
        .join('\n')

    const deathSummary = timeline.deathTimings
        .map((d: any) => `minute ${d.minute} (killed by ${d.killerChampion})`)
        .join(', ')

    const objectiveSummary = timeline.keyEvents
        .map((e: any) => `minute ${e.minute}: ${e.description}`)
        .join('\n')


    return `You are an expert League of Legends coach reviewing a ranked game. Be honest, specific, and actionable. Focus on decisions and patterns, not just stats.

GAME SUMMARY
Match: ${summary.matchId}
Duration: ${summary.gameDurationMinutes} minutes
Queue: ${summary.queueType}
Result: ${p.win ? 'WIN' : 'LOSS'}

PLAYER BEING COACHED
Summoner: ${p.summonerName}
Champion: ${p.champion}
Role: ${p.role}
KDA: ${p.kills}/${p.deaths}/${p.assists}
CS: ${p.cs} (${(p.cs / summary.gameDurationMinutes).toFixed(1)} per minute)
Gold Earned: ${p.goldEarned}
Damage to Champions: ${p.damageToChampions}
Items: ${p.items.map((item: { id: number, name: string }) => `${item.id}: ${item.name}`).join(', ')}
Vision Score: ${p.visionScore}
Wards Placed: ${p.wardsPlaced}
Role Quest Bonus Item: ${p.roleQuestItem ? p.roleQuestItem.name : 'None'}

LANE PERFORMANCE
Gold vs lane opponent at 10 min: ${timeline.goldDiffAt10 > 0 ? '+' : ''}${timeline.goldDiffAt10}
Gold vs lane opponent at 15 min: ${timeline.goldDiffAt15 > 0 ? '+' : ''}${timeline.goldDiffAt15}
Gold vs lane opponent at 20 min: ${timeline.goldDiffAt20 > 0 ? '+' : ''}${timeline.goldDiffAt20}
CS vs lane opponent at 10 min: ${timeline.csDiffAt10 > 0 ? '+' : ''}${timeline.csDiffAt10}
CS vs lane opponent at 15 min: ${timeline.csDiffAt15 > 0 ? '+' : ''}${timeline.csDiffAt15}

DEATH TIMINGS
${deathSummary || 'No deaths recorded'}

TEAMMATES
${teammates}

ENEMIES
${enemies}

TEAM OBJECTIVES (chronological)
${objectiveSummary}

TEAM TOTALS
Our team: ${our.kills} kills, ${our.barons} barons, ${our.dragons} dragons, ${our.towers} towers, ${our.riftHeralds} rift heralds
Enemy team: ${enemy.kills} kills, ${enemy.barons} barons, ${enemy.dragons} dragons, ${enemy.towers} towers, ${enemy.riftHeralds} rift heralds

Please provide a coaching review covering:
1. Overall performance assessment for this champion and role
2. What they did well
3. Specific areas to improve with actionable advice — reference specific minutes and events where possible
4. One key focus point to work on in their next game`
}

export async function getCoachingReport(summary: any, timeline: any): Promise<string> {
    const prompt = buildCoachingPrompt(summary, timeline)

    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error('Did not get a response from OpenAI')
    return content
}