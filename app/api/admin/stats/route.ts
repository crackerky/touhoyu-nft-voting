import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/app/utils/auth'
import { getVotingResults } from '@/app/utils/voting'

// Mock admin stats (in production, get from database)
const mockAdminStats = {
  totalUsers: 156,
  totalVotes: 98,
  eligibleUsers: 134,
}

export async function GET(request: Request) {
  try {
    // Verify authentication and admin access
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyAuthToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

    // Check admin privileges (in production, check user role from database)
    const userEmail = payload.email as string
    if (!userEmail || !userEmail.includes('admin')) {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // Get voting results
    const votingResults = await getVotingResults()
    const totalVotes = votingResults.reduce((sum, option) => sum + option.votes, 0)
    
    // Calculate percentages
    const votingOptions = votingResults.map(option => ({
      id: option.id,
      title: option.title,
      votes: option.votes,
      percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
    }))

    const stats = {
      ...mockAdminStats,
      totalVotes,
      votingOptions
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: '管理者データの取得に失敗しました' },
      { status: 500 }
    )
  }
}