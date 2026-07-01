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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName, tagLine, region, matchId }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    }
    catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900">
      {!result && <MatchForm onSubmit={handleSubmit} />}
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