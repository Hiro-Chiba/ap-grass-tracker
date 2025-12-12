# 作業チェックリスト（Neon対応）
- [x] AGENTS.mdの確認
- [x] plans.mdの確認
- [x] Neon(PostgreSQL)向けの環境変数テンプレート・Prisma設定
- [x] seedスクリプトのPostgreSQL対応
- [x] READMEのNeon/Vercelセットアップ手順更新
- [x] CIワークフロー追加
- [x] 変更の最終確認とコミット/PR文案作成

# 作業チェックリスト（CIロックファイル対応）
- [x] AGENTS.mdの確認
- [x] plans.mdの確認
- [x] CI失敗ログの確認と対応方針の決定
- [x] npmロックファイル（package-lock.json）の生成手順の明文化（ローカル生成は403で失敗のためCIで生成）
- [x] 主要スクリプトが実行できるか確認（依存取得エラーで未実行であることを記録）
- [x] 変更内容の最終確認とコミット/PR文案作成

# 作業チェックリスト（草UIレスポンシブ調整）
- [x] AGENTS.mdの確認
- [x] plans.mdの確認
- [x] 要件の整理と対象コンポーネントの把握
- [x] レイアウト仕様の実装（sm/mdの切り替え含む）
- [x] 動作確認とdiffの最終確認（npm test: jest が見つからず失敗）
