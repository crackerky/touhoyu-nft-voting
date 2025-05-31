import { NextResponse } from 'next/server'
import { generateAuthToken } from '@/app/utils/auth'
import { createUser, getUserByWallet } from '@/app/utils/user'

export async function POST(request: Request) {
  try {
    const { walletType, walletAddress, signature } = await request.json()

    if (!walletType) {
      return NextResponse.json(
        { error: 'ウォレットタイプが指定されていません' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Verify the wallet signature
    // 2. Extract the wallet address from the signature
    // 3. Validate that the user controls the wallet
    
    // For demo purposes, we'll simulate wallet connection
    const mockWalletAddress = walletAddress || 'addr1qyj3z7x7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7j7'
    
    // Get or create user with wallet
    let user = await getUserByWallet(mockWalletAddress)
    if (!user) {
      user = await createUser({ 
        walletAddress: mockWalletAddress, 
        authMethod: 'wallet' 
      })
    }

    // Generate JWT token
    const token = await generateAuthToken(user)

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        authMethod: user.authMethod
      }
    })
  } catch (error) {
    console.error('Wallet connection error:', error)
    return NextResponse.json(
      { error: 'ウォレット接続エラーが発生しました' },
      { status: 500 }
    )
  }
}