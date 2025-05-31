'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LoadingSpinner } from './LoadingSpinner'
import { Mail, Key } from 'lucide-react'

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [verificationCode, setVerificationCode] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('verify')
      } else {
        setError(data.error || 'ログインに失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', data.token)
        onLogin(data.user)
      } else {
        setError(data.error || '認証に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleWalletLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // This would integrate with a Cardano wallet connection
      // For now, we'll simulate the wallet connection
      const response = await fetch('/api/auth/wallet-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // In a real implementation, this would include wallet signature data
        body: JSON.stringify({ walletType: 'nami' }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', data.token)
        onLogin(data.user)
      } else {
        setError(data.error || 'ウォレット接続に失敗しました')
      }
    } catch (err) {
      setError('ウォレット接続エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card glass>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Key className="h-6 w-6 text-primary-600" />
            ログイン
          </CardTitle>
          <CardDescription>
            NFT保有確認のためにログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'email' ? (
            <>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={!email || loading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  マジックリンクを送信
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">または</span>
                </div>
              </div>

              <Button
                onClick={handleWalletLogin}
                variant="secondary"
                className="w-full"
                disabled={loading}
              >
                🦎 Cardanoウォレットで接続
              </Button>
            </>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-4">
                {email} に送信された認証コードを入力してください
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  認証コード
                </label>
                <Input
                  type="text"
                  placeholder="6桁のコードを入力"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStep('email')
                    setVerificationCode('')
                    setError('')
                  }}
                  disabled={loading}
                >
                  戻る
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={verificationCode.length !== 6 || loading}
                >
                  認証
                </Button>
              </div>
            </form>
          )}

          {error && (
            <div className="status-error text-center">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}