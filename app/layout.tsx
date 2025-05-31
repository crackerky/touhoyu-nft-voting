import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Touhoyu NFT Voting',
    template: '%s | Touhoyu NFT Voting'
  },
  description: 'NFT保有者限定の投票アプリケーション - コミュニティの意思決定に参加しよう',
  keywords: ['NFT', '投票', 'Cardano', 'NMKR', 'コミュニティ', 'ガバナンス'],
  authors: [{ name: 'Touhoyu Team' }],
  creator: 'Touhoyu',
  publisher: 'Touhoyu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NFT Voting',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://your-domain.com',
    siteName: 'Touhoyu NFT Voting',
    title: 'Touhoyu NFT Voting - NFT保有者限定投票アプリ',
    description: 'あなたのNFTで投票に参加しよう。コミュニティの意思決定にあなたの声を届けます。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Touhoyu NFT Voting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Touhoyu NFT Voting',
    description: 'NFT保有者限定の投票アプリケーション',
    images: ['/og-image.png'],
    creator: '@touhoyu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NFT Voting" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}