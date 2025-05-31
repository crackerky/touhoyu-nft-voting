# 🤝 Contributing to Touhoyu NFT Voting

Touhoyu NFT Voting アプリへの貢献をお考えいただき、ありがとうございます！

## 📋 貢献方法

### 🐛 バグ報告

1. [Issues](https://github.com/crackerky/touhoyu-nft-voting/issues) で既存の報告を確認
2. 新しいIssueを作成し、以下を含める：
   - バグの詳細な説明
   - 再現手順
   - 期待される動作
   - 実際の動作
   - 環境情報（ブラウザ、OS等）
   - スクリーンショット（可能であれば）

### 💡 機能提案

1. [Issues](https://github.com/crackerky/touhoyu-nft-voting/issues) で "enhancement" ラベルで新しいIssueを作成
2. 以下を含める：
   - 機能の詳細説明
   - 使用例
   - 期待される利益
   - 実装の提案（可能であれば）

### 🔧 コード貢献

1. リポジトリをフォーク
2. 新しいブランチを作成
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. 変更を実装
4. テストを追加/更新
5. コミット
   ```bash
   git commit -m "feat: add awesome feature"
   ```
6. プッシュ
   ```bash
   git push origin feature/awesome-feature
   ```
7. Pull Request を作成

## 📝 コーディング規約

### TypeScript/JavaScript

- ESLint と Prettier の設定に従う
- 関数とクラスにはJSDoc コメントを追加
- async/await を Promise.then() より優先
- エラーハンドリングは必須

```typescript
/**
 * NFTの保有状況を確認する
 * @param walletAddress - 確認対象のウォレットアドレス
 * @returns NFTデータまたはnull
 */
export async function checkNFTOwnership(
  walletAddress: string
): Promise<NFTData | null> {
  try {
    // 実装
  } catch (error) {
    console.error('NFT ownership check failed:', error)
    return null
  }
}
```

### React コンポーネント

- 関数型コンポーネントを使用
- TypeScript の型定義を必須
- カスタムフックは `use` プレフィックス
- プロップスはインターフェースで定義

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ variant = 'primary', loading, onClick, children }: ButtonProps) {
  // 実装
}
```

### CSS/Styling

- Tailwind CSS を使用
- カスタムクラスは `app/globals.css` に定義
- レスポンシブデザインを考慮

## 🧪 テスト

### 手動テスト

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```
2. 主要機能をテスト：
   - ユーザー認証
   - NFT保有確認
   - 投票機能
   - 管理者機能

### テスト用データ

- `demo@example.com` - NFT保有テストユーザー
- `test@example.com` - 一般テストユーザー
- `admin@example.com` - 管理者テストユーザー

## 📖 ドキュメント

- 新機能にはドキュメントを追加
- API変更時は `docs/API.md` を更新
- セットアップ手順の変更時は `docs/SETUP.md` を更新

## 🚀 リリースプロセス

### バージョニング

Semantic Versioning (SemVer) を使用：

- `MAJOR.MINOR.PATCH`
- `MAJOR`: 破壊的変更
- `MINOR`: 新機能追加
- `PATCH`: バグ修正

### コミットメッセージ

Conventional Commits 形式：

```
type(scope): description

[body]

[footer]
```

**Types:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: スタイル変更
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

**例:**
```
feat(voting): add real-time vote updates

Implement WebSocket connection for live vote count updates.
Users can now see results change in real-time.

Closes #123
```

## 🔍 コードレビュー

### Pull Request チェックリスト

- [ ] コードがガイドラインに従っている
- [ ] 適切なテストが含まれている
- [ ] ドキュメントが更新されている
- [ ] 破壊的変更がある場合は明記されている
- [ ] Lint エラーがない
- [ ] ビルドが成功する

### レビュー基準

- **機能性**: 要件を満たしているか
- **品質**: コードの可読性と保守性
- **性能**: パフォーマンスへの影響
- **セキュリティ**: セキュリティリスクの確認
- **UX**: ユーザーエクスペリエンスの向上

## 🏷️ Issue ラベル

- `bug` - バグ報告
- `enhancement` - 機能提案
- `good first issue` - 初心者向け
- `help wanted` - 協力求む
- `priority: high` - 高優先度
- `priority: low` - 低優先度
- `wontfix` - 修正予定なし

## 🤔 質問・サポート

- [GitHub Discussions](https://github.com/crackerky/touhoyu-nft-voting/discussions) で質問
- [Issues](https://github.com/crackerky/touhoyu-nft-voting/issues) で技術的な問題を報告

## 📄 ライセンス

貢献されたコードは、このプロジェクトと同じライセンス下で公開されます。

---

🚀 **一緒に素晴らしいアプリを作りましょう！**

ご質問がありましたら、お気軽にお声かけください。