# 🚀 デプロイメントガイド

## 🌐 Vercel でのデプロイ（推奨）

### 1. Vercel アカウント準備

1. [Vercel](https://vercel.com) でアカウント作成
2. GitHubアカウントと連携

### 2. プロジェクトをデプロイ

```bash
# Vercel CLI をインストール
npm i -g vercel

# プロジェクトディレクトリでデプロイ
vercel

# または GitHub連携でワンクリックデプロイ
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/crackerky/touhoyu-nft-voting)

### 3. 環境変数の設定

Vercel ダッシュボード → Settings → Environment Variables

```env
# 必須設定
NMKR_API_KEY=your_production_nmkr_api_key
BLOCKFROST_API_KEY=your_production_blockfrost_key
NEXTAUTH_SECRET=your_super_secret_production_key
TARGET_POLICY_ID=your_nft_policy_id

# オプション設定
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NMKR_API_BASE_URL=https://api.nmkr.io/v2
BLOCKFROST_BASE_URL=https://cardano-mainnet.blockfrost.io/api/v0
```

### 4. カスタムドメインの設定

1. Vercel ダッシュボード → Domains
2. カスタムドメインを追加
3. DNS設定を更新

## 🐳 Docker でのデプロイ

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NMKR_API_KEY=${NMKR_API_KEY}
      - BLOCKFROST_API_KEY=${BLOCKFROST_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - TARGET_POLICY_ID=${TARGET_POLICY_ID}
    restart: unless-stopped
```

### デプロイコマンド

```bash
# イメージビルド
docker build -t touhoyu-voting .

# コンテナ起動
docker run -p 3000:3000 \
  -e NMKR_API_KEY=your_key \
  -e BLOCKFROST_API_KEY=your_key \
  -e NEXTAUTH_SECRET=your_secret \
  -e TARGET_POLICY_ID=your_policy_id \
  touhoyu-voting

# Docker Compose
docker-compose up -d
```

## ☁️ AWS でのデプロイ

### AWS Amplify

1. AWS Amplify コンソールにアクセス
2. "New app" → "Host web app"
3. GitHubリポジトリを選択
4. ビルド設定：

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### AWS Lambda + API Gateway

```bash
# Serverless Framework
npm install -g serverless

# serverless.yml設定後
serverless deploy
```

## 🔧 環境別設定

### 開発環境

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
# デバッグ用設定
DEBUG=true
```

### ステージング環境

```env
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging-your-app.vercel.app
```

### 本番環境

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📊 モニタリング設定

### Vercel Analytics

```typescript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@vercel/analytics'],
  },
}
```

### Sentry エラートラッキング

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.js
import { init } from '@sentry/nextjs'

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## 🔒 セキュリティ設定

### CSP (Content Security Policy)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### HTTPS強制

```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`
    )
  }
}
```

## 🚨 トラブルシューティング

### よくある問題

1. **ビルドエラー**
   ```bash
   npm run build
   # エラーログを確認
   ```

2. **環境変数が読み込まれない**
   - ダッシュボードで設定確認
   - デプロイ後の再起動

3. **API接続エラー**
   - CORS設定確認
   - APIキーの有効性確認

### ログ確認

```bash
# Vercel
vercel logs

# Docker
docker logs container_name

# AWS CloudWatch
aws logs describe-log-groups
```

## 📈 パフォーマンス最適化

### Next.js 最適化

```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
  compress: true,
  poweredByHeader: false,
}
```

### CDN設定

```typescript
// 静的ファイルのCDN配信
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
}
```

---

🎯 **本番環境での安定運用を目指しましょう！**
