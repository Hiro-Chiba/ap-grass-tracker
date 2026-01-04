# AP Grass Tracker

応用情報技術者試験の学習進捗を「周回」と「正答率」で見える化する Next.js アプリです。草UIと縦線で、合格までの状況を把握できます。

## セットアップ

1. 依存関係をインストールします。`package-lock.json` がない場合は、先に生成してから `npm ci` を実行してください。

```bash
# 初回のみ（ロックファイル生成）
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
# 依存関係のインストール
npm ci
```

2. 環境変数ファイルを設定します（Vercel Storage の Neon で発行した接続文字列を使用）。

```bash
cp .env.example .env
```

3. Prisma のマイグレーションと seed を実行し、PostgreSQL (Neon) を初期化します。

```bash
npx prisma migrate deploy
npx prisma db seed
```

既存DBに旧スキーマのテーブルが残っている場合（`User` テーブルがない等）は、必要に応じて以下で再作成してください。

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
- `npm run typecheck`: TypeScript 型チェック
- `npm run lint`: ESLint（Next.js 標準）
- `npm test`: Jest によるユニットテスト

## ディレクトリ構成

- `app/` - App Router ページ (`/grid`, `/log`, `/stats`, `/onboarding`)
- `components/grass/` - 草UIの Square / SubjectRow / TargetLine
- `lib/` - 計算ロジック、Prisma クライアント、定数
- `prisma/` - Prisma スキーマと seed

## 主要仕様

- 正答率70%以上のみ有効周回（■）
- 目標周回数：テクノロジ3周（DB/NW/SECは4周）、マネジメント/ストラテジ2周
- 目標位置に縦線を表示し、到達分野数を合格圏として表示
- 停滞分野（挑戦あり・有効0）と試験日カウントダウンをKPI表示

## テスト駆動のロジック

`lib/calc.ts` に合格判定やKPI集計の純粋関数をまとめ、`lib/__tests__/calc.test.ts` でテストします。

## Vercel Storage (Neon) へのデプロイと接続

- Vercel Storage で Neon を作成すると `DATABASE_URL` が自動生成されます。
- `.env` に `DATABASE_URL="postgresql://...?...sslmode=require"` を設定し、`npx prisma migrate deploy` と `npx prisma db seed` を実行してください。旧スキーマが残る場合は `npx prisma migrate reset` で再作成できます。
- CI は `.github/workflows/ci.yml` で `npm run typecheck` / `lint` / `test` / `build` を実行します。接続情報が必要な場合はリポジトリのシークレットに設定してください。
