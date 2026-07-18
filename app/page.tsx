/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import MatchForm from '@/components/MatchForm'
import Report from '@/components/Report'
import MatchList from '@/components/MatchList'
import { MatchPreview } from '@/lib/trimmer'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[] | null>(null)
  const [result, setResult] = useState<{
    matchId: string
    player: any
    report: string
  } | null>(null)
  const [playerInfo, setPlayerInfo] = useState<{
    gameName: string
    tagLine: string
    region: string
  } | null>(null)
  const [messageIndex, setMessageIndex] = useState(0)

  const loadingMessages = [
    'Analyzing your game...',
    'Gathering data...',
    'Processing information...',
    'Consulting the coach...',
    'Preparing report...',
    'Finalizing analysis...',
  ]

  useEffect(() => {
    if (!isLoading) return

    const intervalId = setInterval(() => {
      setMessageIndex((currentIndex) => (currentIndex + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(intervalId)
  }, [isLoading])

  async function handleSelectMatch(matchId: string) {
    if (!playerInfo) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // fake delay for testing loading UI remove reminder to take this out before shipping
      //await new Promise((resolve) => setTimeout(resolve, 12000))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName: playerInfo.gameName, tagLine: playerInfo.tagLine, region: playerInfo.region, matchId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGetMatches(gameName: string, tagLine: string, region: string) {
    setIsLoading(true)
    setError(null)
    setPlayerInfo({ gameName, tagLine, region })

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName, tagLine, region }),
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

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      {!result && !isLoading && !matchPreviews && <MatchForm onSubmit={handleGetMatches} error={error} />}
      {!result && !isLoading && matchPreviews && <MatchList matchPreviews={matchPreviews} onSelect={handleSelectMatch} />}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[var(--bg-page)]">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin bg-[var(--bg-page)]" />
          <p className="text-[var(--text-muted)] bg-[var(--bg-page)]">{loadingMessages[messageIndex]}</p>
        </div>
      )}
      {result && <Report matchId={result.matchId} player={result.player} report={result.report} />}
    </main>
  )
}