import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/app/utils/auth'
import { hasUserVoted, recordVote } from '@/app/utils/voting'
import { checkNFTOwnership } from '@/app/utils/nft'
import { getUserById } from '@/app/utils/user'

export async function POST(request: Request) {
  try {
    // Verify authentication
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

    const { optionId, userId } = await request.json()

    if (!optionId || !userId) {
      return NextResponse.json(
        { error: '選択肢とユーザーIDが必要です' },
        { status: 400 }
      )
    }

    // Get user data
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // Check if user has already voted
    const alreadyVoted = await hasUserVoted(userId)
    if (alreadyVoted) {
      return NextResponse.json(
        { error: 'すでに投票済みです' },
        { status: 400 }
      )
    }

    // Re-verify NFT ownership before allowing vote
    let hasValidNFT = false
    try {
      if (user.walletAddress) {
        const nftData = await checkNFTOwnership(user.walletAddress)
        hasValidNFT = nftData && nftData.nftCount > 0
      } else {
        // For email users, we assume they passed initial verification
        // In production, you might want to re-verify with NMKR
        hasValidNFT = true
      }
    } catch (error) {
      console.error('NFT re-verification failed:', error)
      // For demo purposes, allow demo users to vote
      hasValidNFT = user.email && (user.email.includes('demo') || user.email.includes('test'))
    }

    if (!hasValidNFT) {
      return NextResponse.json(
        { error: 'NFT保有が確認できません' },
        { status: 403 }
      )
    }

    // Record the vote
    await recordVote(userId, optionId)

    return NextResponse.json({
      success: true,
      message: '投票が正常に記録されました'
    })
  } catch (error) {
    console.error('Vote casting error:', error)
    return NextResponse.json(
      { error: '投票中にエラーが発生しました' },
      { status: 500 }
    )
  }
}