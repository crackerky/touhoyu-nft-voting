import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/app/utils/auth'
import { getUserById } from '@/app/utils/user'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証トークンがありません' },
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

    const user = await getUserById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      authMethod: user.authMethod
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'トークン検証エラー' },
      { status: 500 }
    )
  }
}