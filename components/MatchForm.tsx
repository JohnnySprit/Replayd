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
                placeholder="Game Name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
            />
            <input
                placeholder="Tag Line"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
            />
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="NA">NA</option>
                <option value="EUW">EUW</option>
                <option value="EUNE">EUNE</option>
                <option value="KR">KR</option>
                <option value="BR">BR</option>
            </select>
            <input
                placeholder="Match ID"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
            />
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}