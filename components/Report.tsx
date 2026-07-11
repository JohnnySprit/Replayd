'use client'
import { PlayerSummary } from '@/lib/trimmer'
import ReactMarkdown from 'react-markdown'

interface ReportProps {
    matchId: string
    player: PlayerSummary
    report: string
}

export default function Report({ matchId, player, report }: ReportProps) {
    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto px-8 py-16 space-y-8">
            <h1 className="text-sm text-zinc-400">Report: {matchId}</h1>
            <p className="text-lg font-semibold text-white">Player: {player.summonerName} - {player.champion} - {player.role}</p>
            <p className="text-lg font-semibold text-white"> Kills: {player.kills} - Deaths: {player.deaths} - Assists: {player.assists} - Damage to Champions: {player.damageToChampions}</p>
            <p className="text-lg font-semibold text-white"> CS: {player.cs} - Gold Earned: {player.goldEarned}</p>
            <p className="text-lg font-semibold text-white"> Items: {player.items.map((item: { id: number, name: string }) => `${item.name}`).join(', ')}</p>
            <div className="text-zinc-300 leading-relaxed">
                <ReactMarkdown>{report}</ReactMarkdown>
            </div>
        </div>
    )
}