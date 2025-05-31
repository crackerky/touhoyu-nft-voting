'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { TrendingUp, Users, Clock, BarChart3 } from 'lucide-react'

interface VotingProgressProps {
  totalEligible: number
  totalVoted: number
  timeRemaining?: string
  votingOptions: Array<{
    id: string
    title: string
    votes: number
    percentage: number
  }>
}

export function VotingProgress({ 
  totalEligible, 
  totalVoted, 
  timeRemaining,
  votingOptions 
}: VotingProgressProps) {
  const [animatedValues, setAnimatedValues] = useState(
    votingOptions.map(() => 0)
  )

  const participationRate = totalEligible > 0 ? (totalVoted / totalEligible) * 100 : 0

  // Animate progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(votingOptions.map(option => option.percentage))
    }, 500)

    return () => clearTimeout(timer)
  }, [votingOptions])

  const getProgressColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          投票進捗状況
        </CardTitle>
        <CardDescription>
          リアルタイムの投票結果と参加状況
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 参加率 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">参加率</span>
            <span className="text-gray-600">
              {totalVoted}/{totalEligible} ({Math.round(participationRate)}%)
            </span>
          </div>
          <Progress 
            value={participationRate} 
            className="h-3"
          />
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-900">{totalVoted}</div>
            <div className="text-xs text-blue-600">投票済み</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-900">
              {Math.round(participationRate)}%
            </div>
            <div className="text-xs text-green-600">参加率</div>
          </div>
        </div>

        {/* 時間情報 */}
        {timeRemaining && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              投票終了まで: {timeRemaining}
            </span>
          </div>
        )}

        {/* 各選択肢の進捗 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">選択肢別結果</h4>
          {votingOptions.map((option, index) => (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {option.title}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{option.votes}票</span>
                  <span className="font-medium">{option.percentage}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                    getProgressColor(index)
                  }`}
                  style={{ 
                    width: `${animatedValues[index]}%`,
                    transition: 'width 1000ms ease-out'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 最新更新時刻 */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          最終更新: {new Date().toLocaleTimeString('ja-JP')}
        </div>
      </CardContent>
    </Card>
  )
}

// Progress コンポーネント（shadcn/ui互換）
function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="bg-primary-600 h-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}