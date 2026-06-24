'use client'

import { useState } from 'react'

const inputStyles = "w-full max-w-md p-2 border border-amber-300 rounded-md text-zinc-400 placeholder:text-zinc-400"

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
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <input
                className={inputStyles}
                placeholder="Game Name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
            />
            <input
                className={inputStyles}
                placeholder="Tag Line"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
            />
            <select value={region} onChange={(e) => setRegion(e.target.value)}
                className={inputStyles}
            >
                <option value="NA">NA</option>
                <option value="EUW">EUW</option>
                <option value="EUNE">EUNE</option>
                <option value="KR">KR</option>
                <option value="BR">BR</option>
            </select>
            <input
                className={inputStyles}
                placeholder="Match ID"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
            />
            <button type="button" onClick={handleSubmit}
            className="w-full max-w-md p-2 text-white rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
            Submit
        </button>
        </div>
    )
}