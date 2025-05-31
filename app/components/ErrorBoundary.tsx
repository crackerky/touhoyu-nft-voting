'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-danger-600" />
              </div>
              <CardTitle className="text-danger-900">
                予期しないエラーが発生しました
              </CardTitle>
              <CardDescription>
                アプリケーションの実行中にエラーが発生しました。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono text-gray-700 break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  variant="secondary"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  再試行
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="flex-1"
                >
                  ページを更新
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                問題が解決しない場合は、管理者にお問い合わせください。
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = () => setError(null)

  const catchError = (error: Error) => {
    console.error('Error caught:', error)
    setError(error)
  }

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { catchError, resetError }
}