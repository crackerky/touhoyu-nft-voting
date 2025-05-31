import { POST } from '@/app/api/auth/verify-code/route'
import { NextRequest } from 'next/server'

// Mock the auth utilities
jest.mock('@/app/utils/auth', () => ({
  verifyCode: jest.fn(),
  generateAuthToken: jest.fn(),
}))

jest.mock('@/app/utils/user', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}))

import { verifyCode, generateAuthToken } from '@/app/utils/auth'
import { createUser, getUserByEmail } from '@/app/utils/user'

const mockVerifyCode = verifyCode as jest.MockedFunction<typeof verifyCode>
const mockGenerateAuthToken = generateAuthToken as jest.MockedFunction<typeof generateAuthToken>
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>
const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<typeof getUserByEmail>

describe('/api/auth/verify-code', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully verifies code and returns token', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      authMethod: 'email',
      createdAt: new Date()
    }

    const mockToken = 'mock-jwt-token'

    mockVerifyCode.mockResolvedValue(true)
    mockGetUserByEmail.mockResolvedValue(mockUser)
    mockGenerateAuthToken.mockResolvedValue(mockToken)

    const request = new NextRequest('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        code: '123456'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.token).toBe(mockToken)
    expect(data.user.email).toBe('test@example.com')
  })

  it('returns error for invalid code', async () => {
    mockVerifyCode.mockResolvedValue(false)

    const request = new NextRequest('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        code: 'invalid'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('認証コードが無効')
  })

  it('creates new user if not exists', async () => {
    const mockNewUser = {
      id: 'user-456',
      email: 'newuser@example.com',
      authMethod: 'email',
      createdAt: new Date()
    }

    mockVerifyCode.mockResolvedValue(true)
    mockGetUserByEmail.mockResolvedValue(null)
    mockCreateUser.mockResolvedValue(mockNewUser)
    mockGenerateAuthToken.mockResolvedValue('new-token')

    const request = new NextRequest('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com',
        code: '123456'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      authMethod: 'email'
    })
    expect(data.user.email).toBe('newuser@example.com')
  })

  it('returns error for missing email or code', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com'
        // missing code
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('メールアドレスと認証コード')
  })
})