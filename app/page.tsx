'use client'

import { useState } from 'react'
import MatchForm from '@/components/MatchForm'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleSelectSample(matchId: string) {
    try {
      router.push(`/report/${matchId}?sample=true`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  async function handleGetMatches(gameName: string, tagLine: string, region: string) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameName: gameName, tagLine: tagLine, region: region }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong')
      router.push(`/matches?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${encodeURIComponent(region)}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">

      {<MatchForm onSubmit={handleGetMatches} onSelectSample={handleSelectSample} isLoading={isLoading} error={error} />}
    </main>
  )
}