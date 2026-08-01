'use client'

import { useEffect, useState } from 'react'
import HeroBackground from '@/components/ui/HeroBackground'
import { motion } from 'motion/react'

const inputStyles = "w-full px-4 py-2.5 border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-page)] focus:outline-none focus:border-[var(--accent)] transition-colors"

interface MatchFormProps {
    onSubmit: (gameName: string, tagLine: string, region: string) => void
    onSelectSample: (matchId: string) => void
    error: string | null
}

export default function MatchForm({ onSubmit, onSelectSample, error }: MatchFormProps) {
    const [gameName, setGameName] = useState('')
    const [tagLine, setTagLine] = useState('')
    const [region, setRegion] = useState('NA')
    const [samples, setSamples] = useState<any[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)

    function handleSubmit() {
        if (!gameName || !tagLine || !region) {
            setValidationError('Please fill in all required fields')
            return
        }
        setValidationError(null)
        onSubmit(gameName, tagLine, region)
    }

    useEffect(() => {
        const fetchSamples = async () => {
            const response = await fetch('/api/samples');
            const data = await response.json();
            setSamples(data.samples ?? [])
        }
        fetchSamples();
    }, []);

    return (
        <HeroBackground>
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full bg-white/10 text-xs text-white/80">
                    <span className="relative flex w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-sm bg-[var(--accent-bright)] animate-ping opacity-60" />
                        <span className="relative w-2.5 h-2.5 rounded-sm bg-[var(--accent-bright)]" />
                    </span>
                    AI Match Analysis
                </span>
                <h1 className="text-4xl font-medium tracking-tight text-white">Replayd</h1>
                <p className="text-sm text-white/70 max-w-sm">
                    AI Coaching for ranked League of Legends games
                </p>
            </div>
            <h1 className="text-lg font-medium text-white/90">Cached Matches</h1>
            <div className="w-full max-w-md flex flex-col gap-1 max-h-[280px] mb-1 overflow-y-auto">
                {samples.map((sample) => (
                    <div
                        key={sample.matchId}
                        className="flex items-center justify-between gap-4 py-2 px-4 rounded-md bg-[var(--bg-card)] border border-[var(--border)] shadow-md"
                    >
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-medium text-[var(--text-primary)]">{sample.player.summonerName} : {sample.player.champion}</h2>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                {sample.player.kills} / {sample.player.deaths} / {sample.player.assists} KDA
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium text-right ${sample.player.win
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    }`}
                            >
                                {sample.player.win ? 'Win' : 'Loss'}
                            </span>
                            <button
                                onClick={() => onSelectSample(sample.matchId)}
                                className="shrink-0 px-5 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-sm font-medium hover:opacity-85 transition-opacity"
                            >
                                Analyze
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full max-w-md flex flex-col gap-3 p-8 rounded-md bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
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
                <motion.button
                    className="w-full mt-2 px-4 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-sm font-medium hover:opacity-80 transition-opacity"
                    whileTap={{ scale: 0.95 }}
                    type="button" onClick={handleSubmit}
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.25 }
                    }}
                    transition={{ duration: 0.25 }}
                >
                    Find Matches
                </motion.button>
            </div>
        </HeroBackground>
    )
}