'use client'

import { useState, useEffect } from 'react'
import { NFTVotingApp } from './components/NFTVotingApp'
import { LoginForm } from './components/LoginForm'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            localStorage.removeItem('authToken')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎯 Touhoyu NFT Voting
        </h1>
        <p className="text-lg text-gray-600">
          NFT保有者限定の投票アプリケーション
        </p>
      </div>

      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <NFTVotingApp user={user} onLogout={handleLogout} />
      )}
    </main>
  )
}