import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

// In-memory storage for verification codes (use database in production)
const verificationCodes = new Map<string, { code: string; expires: number }>()

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
  verificationCodes.set(email, { code, expires })
  
  // Clean up expired codes
  for (const [key, value] of verificationCodes.entries()) {
    if (value.expires < Date.now()) {
      verificationCodes.delete(key)
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const stored = verificationCodes.get(email)
  
  if (!stored) {
    return false
  }
  
  if (stored.expires < Date.now()) {
    verificationCodes.delete(email)
    return false
  }
  
  if (stored.code === code) {
    verificationCodes.delete(email)
    return true
  }
  
  return false
}

export async function generateAuthToken(user: any): Promise<string> {
  const token = await new SignJWT({ 
    userId: user.id,
    email: user.email,
    walletAddress: user.walletAddress 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
  
  return token
}

export async function verifyAuthToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}