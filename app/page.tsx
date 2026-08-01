'use client'

import { useState } from 'react'
import MatchForm from '@/components/MatchForm'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  function handleSelectSample(matchId: string) {
    try {
      router.push(`/report/${matchId}?sample=true`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  async function handleGetMatches(gameName: string, tagLine: string, region: string) {
    try {
      router.push(`/matches?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${encodeURIComponent(region)}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">

      {<MatchForm onSubmit={handleGetMatches} onSelectSample={handleSelectSample} error={error} />}
    </main>
  )
}