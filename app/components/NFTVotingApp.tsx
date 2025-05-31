'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { LoadingSpinner } from './LoadingSpinner'
import { CheckCircle, XCircle, Vote, LogOut, Shield, Wallet } from 'lucide-react'

interface NFTVotingAppProps {
  user: any
  onLogout: () => void
}

interface VotingOption {
  id: string
  title: string
  description: string
  votes: number
}

const mockVotingOptions: VotingOption[] = [
  {
    id: '1',
    title: 'オプション A',
    description: 'コミュニティイベントの開催',
    votes: 45
  },
  {
    id: '2',
    title: 'オプション B',
    description: 'NFTコレクションの拡張',
    votes: 32
  },
  {
    id: '3',
    title: 'オプション C',
    description: 'ロードマップの更新',
    votes: 28
  }
]

export function NFTVotingApp({ user, onLogout }: NFTVotingAppProps) {
  const [nftStatus, setNftStatus] = useState<'checking' | 'eligible' | 'not-eligible'>('checking')
  const [votingOptions, setVotingOptions] = useState<VotingOption[]>(mockVotingOptions)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [nftData, setNftData] = useState<any>(null)

  useEffect(() => {
    checkNFTEligibility()
  }, [user])

  const checkNFTEligibility = async () => {
    try {
      const response = await fetch('/api/nft/check-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (response.ok && data.eligible) {
        setNftStatus('eligible')
        setNftData(data.nftData)
        setHasVoted(data.hasVoted)
      } else {
        setNftStatus('not-eligible')
      }
    } catch (error) {
      console.error('NFT eligibility check failed:', error)
      setNftStatus('not-eligible')
    }
  }

  const handleVote = async () => {
    if (!selectedOption || voting) return

    setVoting(true)
    try {
      const response = await fetch('/api/voting/cast-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          optionId: selectedOption,
          userId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setHasVoted(true)
        // Update vote counts
        setVotingOptions(prev => 
          prev.map(option => 
            option.id === selectedOption 
              ? { ...option, votes: option.votes + 1 }
              : option
          )
        )
      } else {
        alert('投票に失敗しました: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Voting failed:', error)
      alert('投票中にエラーが発生しました')
    } finally {
      setVoting(false)
    }
  }

  const getTotalVotes = () => {
    return votingOptions.reduce((total, option) => total + option.votes, 0)
  }

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes()
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  if (nftStatus === 'checking') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card glass>
          <CardContent className="p-8 text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">NFT保有状況を確認中...</h3>
            <p className="text-gray-600">あなたの投票権限を確認しています</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (nftStatus === 'not-eligible') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card glass>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-danger-600" />
            </div>
            <CardTitle className="text-danger-900">投票権限がありません</CardTitle>
            <CardDescription>
              このアカウントには対象のNFTが確認できませんでした
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                投票に参加するには、対象のNFTを保有している必要があります。
              </p>
              <p className="text-xs text-gray-500">
                NFTを保有している場合は、正しいウォレットでログインしているか確認してください。
              </p>
            </div>
            <Button onClick={onLogout} variant="secondary">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Info & NFT Status */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <CardTitle className="text-success-900">投票権限確認済み</CardTitle>
                <CardDescription>NFT保有が確認されました</CardDescription>
              </div>
            </div>
            <Button onClick={onLogout} variant="secondary" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </CardHeader>
        {nftData && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">ウォレット: {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-6)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">NFT数: {nftData.nftCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Vote className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">投票状況: {hasVoted ? '投票済み' : '未投票'}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Voting Section */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-primary-600" />
            コミュニティ投票
          </CardTitle>
          <CardDescription>
            以下の選択肢から1つを選んで投票してください（総投票数: {getTotalVotes()}票）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {votingOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${hasVoted ? 'cursor-default' : ''}`}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{option.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{option.votes}票</span>
                  <span className="text-xs text-gray-500">({getVotePercentage(option.votes)}%)</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{option.description}</p>
              
              {/* Vote percentage bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getVotePercentage(option.votes)}%` }}
                ></div>
              </div>
            </div>
          ))}

          {!hasVoted ? (
            <div className="pt-4">
              <Button
                onClick={handleVote}
                disabled={!selectedOption || voting}
                loading={voting}
                className="w-full"
                size="lg"
              >
                投票する
              </Button>
            </div>
          ) : (
            <div className="status-success text-center">
              <CheckCircle className="h-5 w-5 inline mr-2" />
              投票が完了しました！ご参加ありがとうございます！
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}