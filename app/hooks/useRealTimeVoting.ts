'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface VotingData {
  totalVotes: number
  options: Array<{
    id: string
    title: string
    votes: number
    percentage: number
  }>
  lastUpdated: string
}

interface UseRealTimeVotingReturn {
  votingData: VotingData | null
  isConnected: boolean
  error: string | null
  reconnect: () => void
}

export function useRealTimeVoting(): UseRealTimeVotingReturn {
  const [votingData, setVotingData] = useState<VotingData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 5
  const reconnectAttempts = useRef(0)

  const connect = useCallback(() => {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate with polling
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/voting/results')
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.results) {
              const totalVotes = data.results.reduce((sum: number, option: any) => sum + option.votes, 0)
              
              const processedData: VotingData = {
                totalVotes,
                options: data.results.map((option: any) => ({
                  id: option.id,
                  title: option.title,
                  votes: option.votes,
                  percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
                })),
                lastUpdated: new Date().toISOString()
              }
              
              setVotingData(processedData)
              setIsConnected(true)
              setError(null)
              reconnectAttempts.current = 0
            }
          } else {
            throw new Error('Failed to fetch voting data')
          }
        } catch (err) {
          console.error('Polling error:', err)
          setError('データの取得に失敗しました')
          setIsConnected(false)
          
          // Attempt to reconnect with exponential backoff
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
            
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`Reconnecting... attempt ${reconnectAttempts.current}`)
            }, delay)
          }
        }
      }, 5000) // Poll every 5 seconds

      // Store interval in wsRef for cleanup
      wsRef.current = { close: () => clearInterval(pollInterval) } as any
      
      setIsConnected(true)
      setError(null)
    } catch (err) {
      console.error('Connection error:', err)
      setError('接続に失敗しました')
      setIsConnected(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttempts.current = 0
    connect()
  }, [connect, disconnect])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Handle visibility change to pause/resume when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnect()
      } else {
        connect()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [connect, disconnect])

  return {
    votingData,
    isConnected,
    error,
    reconnect
  }
}

// Alternative WebSocket implementation for real-time updates
export function useWebSocketVoting(url?: string): UseRealTimeVotingReturn {
  const [votingData, setVotingData] = useState<VotingData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!url) {
      console.warn('WebSocket URL not provided, falling back to polling')
      return
    }

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        
        // Request initial data
        ws.send(JSON.stringify({ type: 'REQUEST_VOTING_DATA' }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'VOTING_UPDATE') {
            setVotingData(data.payload)
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        wsRef.current = null
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... attempt ${reconnectAttempts.current}`)
            connect()
          }, delay)
        } else {
          setError('接続が失われました。ページを更新してください。')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('リアルタイム接続でエラーが発生しました')
      }
    } catch (err) {
      console.error('WebSocket connection failed:', err)
      setError('リアルタイム接続に失敗しました')
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttempts.current = 0
    connect()
  }, [connect, disconnect])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    votingData,
    isConnected,
    error,
    reconnect
  }
}