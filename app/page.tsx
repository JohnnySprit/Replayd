'use client'

import { useState } from 'react'
import MatchForm from '@/components/MatchForm'
import Report from '@/components/Report'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    matchId: string
    player: any
    report: string
  } | null>(null)

  async function handleSubmit(gameName: string, tagLine: string, region: string, matchId: string) {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // fake delay for testing loading UI remove reminder to take this out before shipping
      await new Promise((resolve) => setTimeout(resolve, 4000))
      setResult({
        matchId: 'NA1_TEST123',
        player: {
          summonerName: 'testuser',
          champion: 'Ashe',
          role: 'BOTTOM',
          kills: 4,
          deaths: 9,
          assists: 9,
          cs: 313,
          goldEarned: 17400,
          damageToChampions: 23119,
          visionScore: 25,
          wardsPlaced: 14,
          win: false,
          items: [3033, 2523, 3046, 3031, 3156, 1043],
        },
        report: '### Overall Performance\n\nThis is placeholder text to test styling and layout without calling the real API.',
      })

      /* actual API call restore this when done
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName, tagLine, region, matchId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      */
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900">
      {!result && !isLoading && <MatchForm onSubmit={handleSubmit} />}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <div className="w-10 h-10 border-4 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-zinc-400">Analyzing your game...</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {result && <Report matchId={result.matchId} player={result.player} report={result.report} />}
    </main>
  )
}