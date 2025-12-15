# AP Grass Tracker

応用情報技術者試験向けの学習進捗を「周回」と「正答率」で可視化する Next.js アプリです。草UIと縦線だけで合格戦略を把握できることを目的にしています。

## セットアップ

1. 依存関係をインストールします。`package-lock.json` がない場合は先にロックファイルを生成してから `npm ci` を実行してください。

```bash
# 初回のみ（ロックファイル生成）
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
# 依存関係のインストール
npm ci
```

2. 環境変数ファイルを設定します（Vercel Storage の Neon から発行される接続文字列を使用してください）。

```bash
cp .env.example .env
```

3. Prisma のマイグレーションと seed を実行し、PostgreSQL (Neon) データベースを初期化します。

```bash
npx prisma migrate deploy
npx prisma db seed
```

既存のデータベースに旧スキーマのテーブルが残っている場合（`User` テーブルが存在しないなど）は、上記のマイグレーションでテーブルを張り替えるため、必要に応じて以下のコマンドで再作成してください。

```bash
npx prisma migrate reset
```

4. 開発サーバーを起動します。

```bash
npm run dev
```

## スクリプト

- `npm run dev`: Next.js 開発サーバーを起動
- `npm run build`: 本番ビルド
- `npm run typecheck`: TypeScript の型チェック
- `npm run lint`: ESLint（Next.js 標準）
- `npm test`: Jest によるユニットテスト

## ディレクトリ構成

- `app/` - App Router ベースのページ (`/grid`, `/log`, `/stats`, `/onboarding`)
- `components/grass/` - 草UI用の Square / SubjectRow / TargetLine
- `lib/` - 計算ロジック、Prisma クライアント、定数
- `prisma/` - Prisma スキーマと seed

## 主要仕様

- 正答率70%以上のみを有効周回（■）としてカウント
- テクノロジ系は3周（DB/NW/SECは4周）、マネジメント/ストラテジは2周が目標
- 目標位置に縦線を引き、到達分野数を合格圏として表示
- 停滞分野（挑戦あり・有効0）と試験日カウントダウンをKPIとして提示

## テスト駆動のロジック

`lib/calc.ts` に合格判定やKPI集計の純粋関数をまとめ、`lib/__tests__/calc.test.ts` でテストしています。

## Vercel Storage (Neon) へのデプロイと接続

- Vercel の Storage で Neon を作成すると、`DATABASE_URL` が自動生成されます。
- `.env` に `DATABASE_URL="postgresql://...?...sslmode=require"` を設定した上で、`npx prisma migrate deploy` と `npx prisma db seed` を実行してください。
  旧スキーマが残っている場合は `npx prisma migrate reset` で再作成できます。
- CI は `.github/workflows/ci.yml` で `npm run typecheck` / `lint` / `test` / `build` を通す構成です。Neon への接続情報が必要な場合はリポジトリのシークレットに設定してください。
