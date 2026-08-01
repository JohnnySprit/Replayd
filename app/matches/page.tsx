'use client'
import { useEffect, useState } from 'react'
import { MatchPreview } from '@/lib/trimmer'
import { useRouter } from 'next/navigation'
import MatchList from '@/components/MatchList'
import { useSearchParams } from 'next/navigation'

export default function MatchesPage() {

    const router = useRouter()
    const [playerInfo, setPlayerInfo] = useState<{ gameName: string, tagLine: string, region: string } | null>(null)
    const params = useSearchParams()

    useEffect(() => {
        setPlayerInfo({
            gameName: params.get('gameName') || '',
            tagLine: params.get('tagLine') || '',
            region: params.get('region') || ''
        })
    }, [params])

    const [matchPreviews, setMatchPreviews] = useState<MatchPreview[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    async function getMatchPreviews() {
        if (!playerInfo?.gameName || !playerInfo?.tagLine || !playerInfo?.region) return
        try {
            setIsLoading(true)
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameName: playerInfo?.gameName, tagLine: playerInfo?.tagLine, region: playerInfo?.region }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Something went wrong')
            setMatchPreviews(data.matchPreviews)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    // whenever player info gets updated from the url params, get the match previews
    useEffect(() => {
        getMatchPreviews()
    }, [playerInfo])

    function handleSelectMatch(matchId: string) {
        router.push(`/report/${matchId}?gameName=${encodeURIComponent(playerInfo?.gameName || '')}&tagLine=${encodeURIComponent(playerInfo?.tagLine || '')}&region=${encodeURIComponent(playerInfo?.region || '')}`)
    }

    return (
        <main className="min-h-screen bg-[var(--bg-page)]">
            {error && !isLoading && !matchPreviews && <p className="text-[var(--text-muted)] bg-[var(--bg-page)]">{error}</p>}
            {!isLoading && matchPreviews && <MatchList matchPreviews= {matchPreviews} onSelect={handleSelectMatch} onBack={router.back} error={error} />}
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[var(--bg-page)]">
                    <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin bg-[var(--bg-page)]" />
                    <p className="text-[var(--text-muted)] bg-[var(--bg-page)]">{'Finding your matches...'}</p>
                </div>
            )}
        </main>
    )
}