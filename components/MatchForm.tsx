'use client'

import { useState } from 'react'

const inputStyles = "w-full px-4 py-2.5 border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-page)] focus:outline-none focus:border-[var(--accent)] transition-colors"

interface MatchFormProps {
    onSubmit: (gameName: string, tagLine: string, region: string) => void
    error: string | null
}

export default function MatchForm({ onSubmit, error }: MatchFormProps) {
    const [gameName, setGameName] = useState('')
    const [tagLine, setTagLine] = useState('')
    const [region, setRegion] = useState('NA')
    const [validationError, setValidationError] = useState<string | null>(null)

    function handleSubmit() {
        if (!gameName || !tagLine || !region) {
            setValidationError('Please fill in all required fields')
            return
        }
        setValidationError(null)
        onSubmit(gameName, tagLine, region)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="hero-bg flex flex-col items-center gap-4 px-4 pt-24 pb-36 text-center">
                <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full bg-white/10 text-xs text-white/80">
                    <span className="w-2.5 h-2.5 bg-[var(--accent-bright)] rounded-sm" />
                    AI Match Analysis
                </span>
                <h1 className="relative z-10 text-5xl font-medium tracking-tight text-white">Replayd</h1>
                <p className="relative z-10 text-base text-white/70 max-w-sm">
                    AI Coaching for ranked League of Legends games
                </p>
            </div>
            <div className="w-full max-w-md mx-auto -mt-20 mb-24 relative z-10 flex flex-col gap-3 p-8 rounded-md bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
                <input
                    className={inputStyles}
                    placeholder="Name"
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
                {(validationError || error) && (
                    <p className="text-red-500 text-sm text-center">{validationError || error}</p>
                )}
                <button type="button" onClick={handleSubmit}
                    className="w-full mt-2 px-4 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Find Matches
                </button>
            </div>
        </div>
    )
}