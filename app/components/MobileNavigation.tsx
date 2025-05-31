'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Vote, 
  BarChart3, 
  User, 
  Menu, 
  X,
  Shield,
  Settings
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/app/utils/cn'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: string
  adminOnly?: boolean
}

const navigation: NavigationItem[] = [
  {
    name: 'ホーム',
    href: '/',
    icon: Home
  },
  {
    name: '投票',
    href: '/vote',
    icon: Vote,
    badge: 'New'
  },
  {
    name: '結果',
    href: '/results',
    icon: BarChart3
  },
  {
    name: 'プロフィール',
    href: '/profile',
    icon: User
  },
  {
    name: '管理者',
    href: '/admin',
    icon: Shield,
    adminOnly: true
  }
]

interface MobileNavigationProps {
  user?: any
  isAdmin?: boolean
}

export function MobileNavigation({ user, isAdmin }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="glass-card"
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile navigation menu */}
      <nav className={cn(
        "md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Vote className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">NFT Voting</h2>
                {user && (
                  <p className="text-sm text-gray-600 truncate">
                    {user.email || 'ログイン済み'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-primary-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>NFT保有確認済み</span>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="h-4 w-4" />
                  設定
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom navigation for mobile */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-4 gap-1 p-2">
            {filteredNavigation.slice(0, 4).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-colors",
                    isActive
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}