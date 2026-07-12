'use client'

import { useState } from 'react'
import { MatchPreview } from '@/lib/trimmer'

const inputStyles = "w-full max-w-md p-2 border border-amber-300 rounded-md text-zinc-400 placeholder:text-zinc-400"

interface MatchListProps {
    matchPreviews: MatchPreview[]
    onSelect: (matchId: string) => void
}

export default function MatchList({ matchPreviews, onSelect }: MatchListProps) {
    return (
        <div className={inputStyles}>
            {matchPreviews.map((match) => (
                <div key={match.matchId}>
                    <h2>{match.champion}</h2>
                    <p>{match.win ? 'Win' : 'Loss'}</p>
                    <p>{match.kills} kills, {match.deaths} deaths, {match.assists} assists</p>
                    <button onClick={() => onSelect(match.matchId)}>Select</button>
                </div>
            ))}
        </div>
    )
}