# 🔌 API ドキュメント

Touhoyu NFT Voting App の API エンドポイントの詳細説明です。

## 🔐 認証

### `POST /api/auth/send-magic-link`

マジックリンク（認証コード）を送信

**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "認証コードを送信しました"
}
```

### `POST /api/auth/verify-code`

認証コードを検証してJWTトークンを発行

**リクエスト:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**レスポンス:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "walletAddress": null,
    "authMethod": "email"
  }
}
```

### `POST /api/auth/wallet-connect`

Cardanoウォレット接続認証

**リクエスト:**
```json
{
  "walletType": "nami",
  "walletAddress": "addr1...",
  "signature": "signature_data"
}
```

### `GET /api/auth/verify`

JWTトークンの検証

**ヘッダー:**
```
Authorization: Bearer jwt_token_here
```

**レスポンス:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "walletAddress": "addr1...",
  "authMethod": "email"
}
```

## 🎨 NFT確認

### `POST /api/nft/check-eligibility`

NFT保有状況と投票権限を確認

**ヘッダー:**
```
Authorization: Bearer jwt_token_here
```

**リクエスト:**
```json
{
  "userId": "user_123"
}
```

**レスポンス:**
```json
{
  "eligible": true,
  "nftData": {
    "nftCount": 3,
    "policyId": "policy_id_here",
    "assets": [
      {
        "unit": "policy_id.asset_name",
        "quantity": "1",
        "policyId": "policy_id_here"
      }
    ]
  },
  "hasVoted": false,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "walletAddress": "addr1..."
  }
}
```

## 🗳️ 投票

### `POST /api/voting/cast-vote`

投票を実行

**ヘッダー:**
```
Authorization: Bearer jwt_token_here
```

**リクエスト:**
```json
{
  "optionId": "1",
  "userId": "user_123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "投票が正常に記録されました"
}
```

### `GET /api/voting/results`

投票結果を取得

**レスポンス:**
```json
{
  "success": true,
  "results": [
    {
      "id": "1",
      "title": "オプション A",
      "description": "コミュニティイベントの開催",
      "votes": 45
    },
    {
      "id": "2",
      "title": "オプション B",
      "description": "NFTコレクションの拡張",
      "votes": 32
    }
  ]
}
```

## 👑 管理者機能

### `GET /api/admin/stats`

管理者統計情報を取得

**ヘッダー:**
```
Authorization: Bearer admin_jwt_token
```

**レスポンス:**
```json
{
  "totalUsers": 156,
  "totalVotes": 98,
  "eligibleUsers": 134,
  "votingOptions": [
    {
      "id": "1",
      "title": "オプション A",
      "votes": 45,
      "percentage": 46
    }
  ]
}
```

### `GET /api/admin/export`

投票結果をCSV形式でエクスポート

**ヘッダー:**
```
Authorization: Bearer admin_jwt_token
```

**レスポンス:**
CSVファイル（ダウンロード）

## 🚨 エラーレスポンス

### 認証エラー (401)
```json
{
  "error": "認証が必要です"
}
```

### 権限エラー (403)
```json
{
  "error": "NFT保有が確認できません"
}
```

### バリデーションエラー (400)
```json
{
  "error": "選択肢とユーザーIDが必要です"
}
```

### サーバーエラー (500)
```json
{
  "error": "サーバーエラーが発生しました"
}
```

## 🔒 セキュリティ

### JWT トークン
- 有効期限: 24時間
- アルゴリズム: HS256
- シークレット: 環境変数で管理

### レート制限
- 認証エンドポイント: 5回/分
- 投票エンドポイント: 1回/セッション
- その他: 100回/分

### CORS 設定
```typescript
// 本番環境では特定のドメインのみ許可
const allowedOrigins = [
  'https://your-domain.com',
  'https://your-domain.vercel.app'
]
```

## 🧪 テスト用エンドポイント

開発環境でのみ利用可能：

### `POST /api/dev/reset-votes`
全投票データをリセット（開発専用）

### `GET /api/dev/mock-nft-user`
テスト用NFT保有者を作成（開発専用）

---

**注意:** 本番環境では開発用エンドポイントは無効になります。
