'use client'

import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/app/utils/cn'

export type StatusType = 'success' | 'error' | 'warning' | 'info'

interface StatusMessageProps {
  type: StatusType
  title?: string
  message: string
  className?: string
  onClose?: () => void
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-success-50 text-success-700 border border-success-200',
    iconClass: 'text-success-600'
  },
  error: {
    icon: XCircle,
    containerClass: 'bg-danger-50 text-danger-700 border border-danger-200',
    iconClass: 'text-danger-600'
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-warning-50 text-warning-700 border border-warning-200',
    iconClass: 'text-warning-600'
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    iconClass: 'text-blue-600'
  }
}

export function StatusMessage({ 
  type, 
  title, 
  message, 
  className, 
  onClose 
}: StatusMessageProps) {
  const config = statusConfig[type]
  const Icon = config.icon

  return (
    <div className={cn(
      'rounded-lg p-4 animate-fade-in',
      config.containerClass,
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClass)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Hook for managing status messages
export function useStatusMessage() {
  const [status, setStatus] = React.useState<{
    type: StatusType
    title?: string
    message: string
  } | null>(null)

  const showStatus = (type: StatusType, message: string, title?: string) => {
    setStatus({ type, message, title })
  }

  const clearStatus = () => {
    setStatus(null)
  }

  const showSuccess = (message: string, title?: string) => {
    showStatus('success', message, title)
  }

  const showError = (message: string, title?: string) => {
    showStatus('error', message, title)
  }

  const showWarning = (message: string, title?: string) => {
    showStatus('warning', message, title)
  }

  const showInfo = (message: string, title?: string) => {
    showStatus('info', message, title)
  }

  return {
    status,
    showStatus,
    clearStatus,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

import React from 'react'