'use client'

import Report from '@/components/Report'
import { useRouter } from 'next/navigation'
import { PlayerSummary } from '@/lib/trimmer'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'



function ReportContent() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const params = useParams()
    const [matchId] = useState(params.matchId)

    const searchParams = useSearchParams()
    const [gameName] = useState(searchParams.get('gameName') || '')
    const [tagLine] = useState(searchParams.get('tagLine') || '')
    const [region] = useState(searchParams.get('region') || '')
    const [sample] = useState(searchParams.get('sample') || false)

    const [result, setResult] = useState<{ matchId: string, player: PlayerSummary, report: string } | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)

    const loadingMessages = [
        'Analyzing your game...',
        'Gathering data...',
        'Processing information...',
        'Consulting the coach...',
        'Preparing report...',
        'Finalizing analysis...',
    ]

    async function getResult() {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameName: gameName, tagLine: tagLine, region: region, matchId: matchId }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Something went wrong')
            setResult(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred')
        }
        finally {
            setIsLoading(false)
        }
    }

    async function getSampleResult() {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch('/api/samples/' + matchId)
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Something went wrong')
            setResult(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred')
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (sample === 'true') {
            getSampleResult()
        } else {
            getResult()
        }
    }, [matchId, gameName, tagLine, region, sample])

    useEffect(() => {
        if (!isLoading) return

        const intervalId = setInterval(() => {
            setMessageIndex((currentIndex) =>
                currentIndex >= loadingMessages.length - 1
                    ? currentIndex
                    : currentIndex + 1
            )
        }, 2000)

        return () => clearInterval(intervalId)
    }, [isLoading])

    return (
        <main className="min-h-screen bg-[var(--bg-page)]">
            {error && !isLoading && !result && <p className="text-[var(--text-muted)] bg-[var(--bg-page)]">{error}</p>}
            {result && <Report matchId={result.matchId} player={result.player} report={result.report} onBack={router.back} />}
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[var(--bg-page)]">
                    <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin bg-[var(--bg-page)]" />
                    <p className="text-[var(--text-muted)] bg-[var(--bg-page)]">{loadingMessages[messageIndex]}</p>
                </div>
            )}
        </main>
    )
}

export default function ReportPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
                </div>
            }
        >
            <ReportContent />
        </Suspense>
    )
}