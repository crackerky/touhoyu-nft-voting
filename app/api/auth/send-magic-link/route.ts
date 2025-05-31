import { NextResponse } from 'next/server'
import { sendMagicLinkEmail } from '@/app/utils/email'
import { generateVerificationCode, storeVerificationCode } from '@/app/utils/auth'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode()
    
    // Store the verification code (in a real app, use a database)
    await storeVerificationCode(email, verificationCode)

    // Send email with verification code
    // In development, we'll just log it to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Verification code for ${email}: ${verificationCode}`)
    } else {
      await sendMagicLinkEmail(email, verificationCode)
    }

    return NextResponse.json({
      success: true,
      message: '認証コードを送信しました'
    })
  } catch (error) {
    console.error('Magic link send error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}