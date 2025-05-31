import { NextResponse } from 'next/server'
import { getVotingResults } from '@/app/utils/voting'

export async function GET() {
  try {
    const results = await getVotingResults()
    
    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Voting results error:', error)
    return NextResponse.json(
      { error: '投票結果の取得に失敗しました' },
      { status: 500 }
    )
  }
}