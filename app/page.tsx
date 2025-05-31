'use client'

import { useState, useEffect } from 'react'
import { NFTVotingApp } from './components/NFTVotingApp'
import { LoginForm } from './components/LoginForm'
import { LoadingSpinner } from './components/LoadingSpinner'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { MobileNavigation } from './components/MobileNavigation'
import { VotingProgress } from './components/VotingProgress'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useRealTimeVoting } from './hooks/useRealTimeVoting'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Sparkles, Shield, Vote, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { votingData, isConnected } = useRealTimeVoting()

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

  const isAdmin = user?.email?.includes('admin')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 md:pb-8">
        {/* Mobile Navigation */}
        <MobileNavigation user={user} isAdmin={isAdmin} />
        
        {/* Real-time connection status */}
        {user && (
          <div className="fixed top-4 right-4 z-40">
            <Badge variant={isConnected ? 'success' : 'warning'}>
              {isConnected ? '🟢 リアルタイム' : '🟡 更新中'}
            </Badge>
          </div>
        )}

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {!user ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  NFT保有者限定投票アプリ
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  🎯 Touhoyu
                  <span className="block text-primary-600">NFT Voting</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  あなたのNFTで投票に参加しよう。
                  コミュニティの意思決定にあなたの声を届けます。
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                  <Card className="glass-card text-center">
                    <CardContent className="p-6">
                      <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">安全な認証</h3>
                      <p className="text-sm text-gray-600">
                        NFT保有を確認して、有資格者のみが投票可能
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card text-center">
                    <CardContent className="p-6">
                      <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">リアルタイム</h3>
                      <p className="text-sm text-gray-600">
                        投票結果をリアルタイムで確認、透明性の高い投票
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card text-center">
                    <CardContent className="p-6">
                      <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">コミュニティ</h3>
                      <p className="text-sm text-gray-600">
                        NFTホルダーによる、NFTホルダーのための投票システム
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Login Section */}
              <div className="max-w-md mx-auto">
                <LoginForm onLogin={handleLogin} />
              </div>

              {/* Current Voting Status (if available) */}
              {votingData && (
                <div className="mt-12 max-w-2xl mx-auto">
                  <Card className="glass-card">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Vote className="h-5 w-5 text-primary-600" />
                        現在の投票状況
                      </CardTitle>
                      <CardDescription>
                        ログインして投票に参加しましょう
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {votingData.options.map((option, index) => (
                          <div key={option.id} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {option.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{option.votes}票</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-blue-500' :
                                    index === 1 ? 'bg-green-500' :
                                    'bg-purple-500'
                                  }`}
                                  style={{ width: `${option.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
                        総投票数: {votingData.totalVotes}票
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Voting App */}
                <div className="lg:col-span-2">
                  <NFTVotingApp user={user} onLogout={handleLogout} />
                </div>
                
                {/* Sidebar with Progress */}
                {votingData && (
                  <div className="lg:col-span-1">
                    <VotingProgress
                      totalEligible={134} // This would come from API
                      totalVoted={votingData.totalVotes}
                      timeRemaining="2日 14時間"
                      votingOptions={votingData.options}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </ErrorBoundary>
  )
}

// Badge component (simple implementation)
function Badge({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}