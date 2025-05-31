# 🎯 Touhoyu NFT Voting App

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/crackerky/touhoyu-nft-voting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

NFT保有者限定の投票アプリケーション - NMKR連携対応 🚀

![Touhoyu NFT Voting Demo](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Touhoyu+NFT+Voting+Demo)

## ✨ 主な機能

### 🔐 認証システム
- **Magic Link認証**: メールアドレスによる認証コード送信
- **Cardanoウォレット連携**: Namiなど主要ウォレットサポート
- **JWT認証**: セキュアなトークンベース認証

### 🎨 NFT確認システム
- **Blockfrost API**: メインネット対応のNFT保有確認
- **Koios API**: フォールバック対応で高可用性
- **NMKR連携**: 購入履歴との照合機能

### 🗳️ 投票機能
- **リアルタイム結果表示**: ライブ更新される投票結果
- **重複投票防止**: 1ユーザー1票の厳密な管理
- **投票進捗表示**: 参加率と結果の可視化

### 📱 モバイル最適化
- **PWA対応**: ホーム画面への追加可能
- **レスポンシブデザイン**: 全デバイス対応
- **モバイルナビゲーション**: 直感的な操作性

### 👑 管理者機能
- **統計ダッシュボード**: 投票状況の総合分析
- **CSV出力**: 結果データのエクスポート
- **ユーザー管理**: 権限管理とアクセス制御

## 🚀 クイックスタート

### 前提条件
- Node.js 18.0+
- npm 8.0+
- NMKR APIキー
- Blockfrost APIキー

### インストール

1. **リポジトリのクローン**
```bash
git clone https://github.com/crackerky/touhoyu-nft-voting.git
cd touhoyu-nft-voting
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
```bash
cp .env.example .env.local
```

`.env.local`を編集：
```env
# NMKR API設定
NMKR_API_KEY=your_nmkr_api_key_here
NMKR_API_BASE_URL=https://api.nmkr.io/v2

# Cardano Blockchain API (Blockfrost)
BLOCKFROST_API_KEY=your_blockfrost_api_key_here
BLOCKFROST_BASE_URL=https://cardano-mainnet.blockfrost.io/api/v0

# JWT Secret
NEXTAUTH_SECRET=your-super-secret-jwt-key

# NFT Configuration
TARGET_POLICY_ID=your_nft_policy_id_here

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **開発サーバーの起動**
```bash
npm run dev
```

アプリは [http://localhost:3000](http://localhost:3000) でアクセス可能です。

## 🧪 テスト

```bash
# テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage
```

### テスト用アカウント
- `demo@example.com` - NFT保有テストユーザー
- `test@example.com` - 一般テストユーザー
- `admin@example.com` - 管理者テストユーザー

認証コードは開発環境ではコンソールに表示されます。

## 📁 プロジェクト構造

```
touhoyu-nft-voting/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # 認証エンドポイント
│   │   ├── nft/           # NFT確認API
│   │   ├── voting/        # 投票API
│   │   └── admin/         # 管理者API
│   ├── components/        # React components
│   │   ├── ui/            # 基本UIコンポーネント
│   │   ├── LoginForm.tsx  # ログインフォーム
│   │   ├── NFTVotingApp.tsx # メイン投票アプリ
│   │   └── ...            # その他コンポーネント
│   ├── hooks/             # カスタムフック
│   ├── utils/             # ユーティリティ関数
│   ├── admin/             # 管理者ページ
│   └── globals.css        # グローバルスタイル
├── docs/                  # ドキュメント
│   ├── SETUP.md           # セットアップガイド
│   ├── API.md             # API仕様書
│   └── DEPLOYMENT.md      # デプロイガイド
├── __tests__/             # テストファイル
├── public/                # 静的ファイル
│   ├── manifest.json      # PWA設定
│   └── icons/             # アプリアイコン
├── types/                 # TypeScript型定義
└── performance/           # パフォーマンス設定
```

## 🔧 技術仕様

### フロントエンド
- **Next.js 14**: React フレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: ユーティリティファーストCSS
- **Lucide React**: アイコンライブラリ

### バックエンド
- **Next.js API Routes**: サーバーレス API
- **JWT**: 認証トークン
- **BCrypt**: パスワードハッシュ化

### 外部API
- **NMKR API**: NFT購入履歴確認
- **Blockfrost API**: Cardanoブロックチェーン接続
- **Koios API**: ブロックチェーンAPIフォールバック

### デプロイメント
- **Vercel**: 推奨デプロイ先
- **Docker**: コンテナ対応
- **AWS/GCP**: クラウドデプロイ対応

## 📱 モバイル機能

### PWA (Progressive Web App)
- オフライン対応
- ホーム画面への追加
- プッシュ通知（将来対応）
- アプリのような体験

### レスポンシブデザイン
- モバイルファースト設計
- タッチフレンドリーUI
- 最適化されたナビゲーション

## 🔒 セキュリティ

### 認証セキュリティ
- JWT トークン（24時間有効期限）
- レート制限実装
- CORS 設定

### NFT検証
- 複数API での重複確認
- ブロックチェーン直接検証
- 改ざん防止機能

### データ保護
- 環境変数での秘匿情報管理
- HTTPS 強制
- セキュリティヘッダー設定

## 📊 パフォーマンス

### 最適化機能
- 画像最適化
- コード分割
- レイジーローディング
- キャッシュ戦略

### 監視ツール
```bash
# Lighthouse 監査
npm run lighthouse

# バンドル分析
npm run analyze

# 型チェック
npm run type-check
```

## 🌍 デプロイメント

### Vercel (推奨)
1. [Vercel](https://vercel.com) でGitHubリポジトリを接続
2. 環境変数を設定
3. 自動デプロイ開始

### Docker
```bash
# イメージビルド
docker build -t touhoyu-voting .

# コンテナ起動
docker run -p 3000:3000 touhoyu-voting
```

### 環境変数設定
本番環境では以下の環境変数を適切に設定してください：

```env
NMKR_API_KEY=production_api_key
BLOCKFROST_API_KEY=production_api_key
NEXTAUTH_SECRET=production_secret_key
TARGET_POLICY_ID=production_policy_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📖 ドキュメント

詳細なドキュメントは `docs/` フォルダを参照：

- 📋 [セットアップガイド](docs/SETUP.md)
- 🔌 [API仕様書](docs/API.md)
- 🚀 [デプロイガイド](docs/DEPLOYMENT.md)

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. feature ブランチを作成
3. 変更をコミット
4. テストを実行
5. プルリクエストを作成

詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## 🐛 トラブルシューティング

### よくある問題

**Q: NFT確認ができない**
- A: APIキーが正しく設定されているか確認
- A: Policy IDが正確か確認
- A: ネットワーク接続を確認

**Q: 認証エラーが発生する**
- A: JWT_SECRETが設定されているか確認
- A: トークンの有効期限を確認

**Q: 投票ができない**
- A: NFT保有が確認されているか
- A: 既に投票済みでないか確認

詳細な解決方法は [docs/SETUP.md](docs/SETUP.md#トラブルシューティング) を参照。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

- [NMKR](https://nmkr.io) - NFT作成・管理プラットフォーム
- [Blockfrost](https://blockfrost.io) - Cardano API サービス
- [Koios](https://koios.rest) - 無料Cardano API
- [Next.js](https://nextjs.org) - React フレームワーク
- [Tailwind CSS](https://tailwindcss.com) - CSS フレームワーク

## 🔗 関連リンク

- 🌐 [Live Demo](https://touhoyu-nft-voting.vercel.app)
- 📚 [API Documentation](docs/API.md)
- 🎨 [Design System](docs/DESIGN.md)
- 📱 [Mobile Guide](docs/MOBILE.md)

---

<div align="center">

🎯 **一緒に最高のNFT投票アプリをつくりましょう！** 🚀

[Get Started](docs/SETUP.md) • [Live Demo](https://touhoyu-nft-voting.vercel.app) • [Join Community](https://github.com/crackerky/touhoyu-nft-voting/discussions)

</div>
