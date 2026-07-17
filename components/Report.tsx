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
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <p className="text-xs text-[var(--text-muted)]">Report · {matchId}</p>
                <h1 className="text-2xl font-medium tracking-tight text-[var(--text-primary)]">
                    {player.summonerName} · {player.champion} · {player.role}
                </h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1">KDA</p>
                    <p className="text-lg font-medium text-[var(--text-primary)]">{player.kills} / {player.deaths} / {player.assists}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Damage</p>
                    <p className="text-lg font-medium text-[var(--text-primary)]">{player.damageToChampions.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-1">CS / Gold</p>
                    <p className="text-lg font-medium text-[var(--text-primary)]">{player.cs} · {player.goldEarned.toLocaleString()}</p>
                </div>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Items</p>
                <p className="text-sm text-[var(--text-primary)]">
                    {player.items.map((item: { id: number, name: string }) => item.name).join(', ')}
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] leading-relaxed [&_h1]:text-lg [&_h1]:font-medium [&_h1]:mt-4 [&_h2]:text-base [&_h2]:font-medium [&_h2]:mt-4 [&_p]:my-2 [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
                <ReactMarkdown>{report}</ReactMarkdown>
            </div>
        </div>
    )
}