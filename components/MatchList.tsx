'use client'

import { MatchPreview } from '@/lib/trimmer'

interface MatchListProps {
    matchPreviews: MatchPreview[]
    onSelect: (matchId: string) => void
}

export default function MatchList({ matchPreviews, onSelect }: MatchListProps) {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="flex flex-col items-center gap-2 mb-10 text-center">
                <h1 className="text-3xl font-medium tracking-tight text-[var(--text-primary)]">Recent Matches</h1>
                <p className="text-sm text-[var(--text-muted)]">Pick a recent game to generate your coaching report</p>
            </div>
            <div className="flex flex-col gap-3">
                {matchPreviews.map((match) => (
                    <div
                        key={match.matchId}
                        className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm"
                    >
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-medium text-[var(--text-primary)]">{match.champion}</h2>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        match.win
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {match.win ? 'Win' : 'Loss'}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                {match.kills} / {match.deaths} / {match.assists} KDA
                            </p>
                        </div>
                        <button
                            onClick={() => onSelect(match.matchId)}
                            className="shrink-0 px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-sm font-medium hover:opacity-85 transition-opacity"
                        >
                            Analyze
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}