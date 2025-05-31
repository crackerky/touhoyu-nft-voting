import { NextResponse } from 'next/server'
import { verifyCode, generateAuthToken } from '@/app/utils/auth'
import { createUser, getUserByEmail } from '@/app/utils/user'

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'メールアドレスと認証コードを入力してください' },
        { status: 400 }
      )
    }

    // Verify the code
    const isValid = await verifyCode(email, code)
    if (!isValid) {
      return NextResponse.json(
        { error: '認証コードが無効または期限切れです' },
        { status: 400 }
      )
    }

    // Get or create user
    let user = await getUserByEmail(email)
    if (!user) {
      user = await createUser({ email, authMethod: 'email' })
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
    console.error('Code verification error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}