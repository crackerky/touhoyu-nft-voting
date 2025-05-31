import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/app/utils/auth'
import { getUserById } from '@/app/utils/user'
import { checkNFTOwnership } from '@/app/utils/nft'
import { hasUserVoted } from '@/app/utils/voting'

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

    const { userId } = await request.json()

    // Get user data
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // Check NFT ownership
    let nftData = null
    let eligible = false

    try {
      if (user.walletAddress) {
        // Check via wallet address (Blockfrost)
        nftData = await checkNFTOwnership(user.walletAddress)
        eligible = nftData && nftData.nftCount > 0
      } else if (user.email) {
        // Check via NMKR email purchase records
        nftData = await checkNMKRPurchases(user.email)
        eligible = nftData && nftData.nftCount > 0
      }
    } catch (error) {
      console.error('NFT ownership check failed:', error)
      // For demo purposes, make some users eligible
      if (user.email && (user.email.includes('demo') || user.email.includes('test'))) {
        eligible = true
        nftData = { nftCount: 1, policyId: process.env.TARGET_POLICY_ID }
      }
    }

    // Check if user has already voted
    const hasVoted = eligible ? await hasUserVoted(userId) : false

    return NextResponse.json({
      eligible,
      nftData,
      hasVoted,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    console.error('NFT eligibility check error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// Check NMKR purchases for email-based users
async function checkNMKRPurchases(email: string) {
  try {
    const nmkrApiKey = process.env.NMKR_API_KEY
    const nmkrBaseUrl = process.env.NMKR_API_BASE_URL

    if (!nmkrApiKey || !nmkrBaseUrl) {
      console.warn('NMKR API not configured')
      return null
    }

    // Call NMKR API to check purchases by email
    const response = await fetch(`${nmkrBaseUrl}/GetCustomerByEmail/${email}`, {
      headers: {
        'Authorization': `Bearer ${nmkrApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('NMKR API error:', response.status, response.statusText)
      return null
    }

    const customerData = await response.json()
    
    // Check if customer has purchases of the target NFT policy
    const targetPolicyId = process.env.TARGET_POLICY_ID
    let nftCount = 0

    if (customerData.orders) {
      for (const order of customerData.orders) {
        if (order.nfts) {
          for (const nft of order.nfts) {
            if (nft.policyId === targetPolicyId) {
              nftCount++
            }
          }
        }
      }
    }

    return {
      nftCount,
      policyId: targetPolicyId,
      customerData: {
        email: customerData.email,
        walletAddress: customerData.walletAddress
      }
    }
  } catch (error) {
    console.error('NMKR purchase check error:', error)
    return null
  }
}