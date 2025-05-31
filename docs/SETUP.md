# 🚀 Touhoyu NFT Voting App セットアップガイド

## 📋 前提条件

以下のツールがインストールされている必要があります：

- **Node.js** (18.0以上)
- **npm** または **yarn**
- **Git**

## 🔧 インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/crackerky/touhoyu-nft-voting.git
cd touhoyu-nft-voting
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集して、必要な環境変数を設定：

```env
# NMKR API設定
NMKR_API_KEY=your_nmkr_api_key_here
NMKR_API_BASE_URL=https://api.nmkr.io/v2

# Cardano Blockchain API (Blockfrost)
BLOCKFROST_API_KEY=your_blockfrost_api_key_here
BLOCKFROST_BASE_URL=https://cardano-mainnet.blockfrost.io/api/v0

# JWT Secret for authentication
NEXTAUTH_SECRET=your-super-secret-jwt-key

# NFT Configuration
TARGET_POLICY_ID=your_nft_policy_id_here

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

アプリは [http://localhost:3000](http://localhost:3000) でアクセス可能になります。

## 🔑 API キーの取得

### NMKR API キー

1. [NMKR Studio](https://studio.nmkr.io) にログイン
2. プロジェクト設定 → API設定
3. APIキーを生成・コピー

### Blockfrost API キー

1. [Blockfrost](https://blockfrost.io) アカウント作成
2. 新しいプロジェクトを作成（Cardano Mainnet）
3. プロジェクトIDをコピー

### NFT Policy ID

1. CardanoScanまたはpool.pmで対象NFTを検索
2. Policy IDをコピー
3. `.env.local`の`TARGET_POLICY_ID`に設定

## 🧪 テスト用アカウント

開発中は以下のテスト用メールアドレスでログイン可能：

- `demo@example.com`
- `test@example.com`
- `admin@example.com` (管理者アクセス)

認証コードはコンソールに表示されます。

## 📱 機能テスト

### 1. ユーザー認証
- メールアドレスでのログイン
- Magic Link認証
- Cardanoウォレット接続（開発中）

### 2. NFT保有確認
- Blockfrost APIでの確認
- Koios API（フォールバック）
- NMKR購入履歴確認

### 3. 投票機能
- NFT保有者のみアクセス可能
- 重複投票防止
- リアルタイム結果表示

### 4. 管理者機能
- 統計ダッシュボード
- CSV エクスポート
- ユーザー管理

## 🚀 本番環境デプロイ

### Vercel でのデプロイ

1. [Vercel](https://vercel.com) アカウント作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ実行

### 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
NMKR_API_KEY=your_production_api_key
BLOCKFROST_API_KEY=your_production_api_key
NEXTAUTH_SECRET=your_production_secret
TARGET_POLICY_ID=your_nft_policy_id
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔧 カスタマイズ

### 投票オプションの変更

`app/utils/voting.ts`の`votingOptions`配列を編集：

```typescript
const votingOptions: VotingOption[] = [
  {
    id: '1',
    title: 'あなたの選択肢 A',
    description: '説明文',
    votes: 0
  },
  // 追加の選択肢...
]
```

### UI/UXのカスタマイズ

- `app/globals.css`: スタイルの調整
- `tailwind.config.js`: カラーテーマの変更
- `app/components/`: コンポーネントの修正

### NFT Policy IDの変更

1. `.env.local`の`TARGET_POLICY_ID`を更新
2. アプリを再起動

## 📊 モニタリング

### ログの確認

開発環境：
```bash
npm run dev
# コンソールでログを確認
```

本番環境：
- Vercelダッシュボードのログ
- エラートラッキングサービス（Sentry等）

### パフォーマンス監視

- Vercel Analytics
- Google Analytics
- Core Web Vitals

## 🆘 トラブルシューティング

### よくある問題

1. **NFT確認ができない**
   - API キーが正しく設定されているか確認
   - Policy IDが正確か確認
   - ネットワーク接続を確認

2. **認証エラー**
   - JWT_SECRETが設定されているか確認
   - トークンの有効期限を確認

3. **投票ができない**
   - NFT保有が確認されているか
   - 既に投票済みでないか確認

### エラーログの確認

```bash
# 開発環境
npm run dev

# ビルドエラーの確認
npm run build
```

## 🤝 サポート

問題や質問がある場合：

1. [GitHub Issues](https://github.com/crackerky/touhoyu-nft-voting/issues) で報告
2. ドキュメントを再確認
3. コミュニティフォーラムで質問

---

🎯 **一緒に最高のNFT投票アプリをつくりましょう！**
