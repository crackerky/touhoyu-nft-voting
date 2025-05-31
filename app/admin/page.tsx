'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'
import { BarChart, Users, Vote, Shield, TrendingUp, AlertCircle } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalVotes: number
  eligibleUsers: number
  votingOptions: Array<{
    id: string
    title: string
    votes: number
    percentage: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('管理者情報の取得に失敗しました')
      }
    } catch (err) {
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const exportResults = async () => {
    try {
      const response = await fetch('/api/admin/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `voting-results-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('エクスポートに失敗しました')
      }
    } catch (err) {
      alert('エクスポート中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">アクセスエラー</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 管理者ダッシュボード
          </h1>
          <p className="text-gray-600">NFT投票アプリの統計情報と管理機能</p>
        </div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">投票数</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalVotes}</p>
                    </div>
                    <Vote className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">NFT保有者</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.eligibleUsers}</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">投票率</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.eligibleUsers > 0 ? Math.round((stats.totalVotes / stats.eligibleUsers) * 100) : 0}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Voting Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    投票結果
                  </CardTitle>
                  <CardDescription>
                    各選択肢の投票数と割合
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.votingOptions.map((option, index) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {option.title}
                          </span>
                          <span className="text-sm text-gray-600">
                            {option.votes}票 ({option.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === 0 ? 'bg-blue-600' :
                              index === 1 ? 'bg-green-600' :
                              index === 2 ? 'bg-purple-600' :
                              'bg-orange-600'
                            }`}
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>管理操作</CardTitle>
                  <CardDescription>
                    データのエクスポートと管理機能
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={exportResults}
                    className="w-full"
                    variant="secondary"
                  >
                    📊 投票結果をCSVでエクスポート
                  </Button>
                  
                  <Button
                    onClick={fetchAdminStats}
                    className="w-full"
                    variant="secondary"
                  >
                    🔄 データを更新
                  </Button>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">注意事項</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 管理者機能は限定されたユーザーのみアクセス可能</li>
                      <li>• データはリアルタイムで更新されます</li>
                      <li>• エクスポートしたデータは暗号化されていません</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}