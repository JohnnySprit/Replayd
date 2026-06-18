'use client'

import { useState } from 'react'

interface MatchFormProps {
    onSubmit: (gameName: string, tagLine: string, region: string, matchId: string) => void
}

export default function MatchForm({ onSubmit }: MatchFormProps) {
    const [gameName, setGameName] = useState('')
    const [tagLine, setTagLine] = useState('')
    const [region, setRegion] = useState('NA')
    const [matchId, setMatchId] = useState('')

    function handleSubmit() {
        onSubmit(gameName, tagLine, region, matchId)
    }

    return (
        <div>
            <input
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
            />
            <input
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
            />
            <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
            />
            <input
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
            />
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}