import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.subject.createMany({
    data: [
      // Technology
      { name: "基礎理論", category: "technology" },
      { name: "アルゴリズムとプログラミング", category: "technology" },
      { name: "コンピュータ構成要素", category: "technology" },
      { name: "システム構成要素", category: "technology" },
      { name: "ソフトウェア", category: "technology" },
      { name: "ハードウェア", category: "technology" },
      { name: "ユーザーインタフェース", category: "technology" },
      { name: "情報メディア", category: "technology" },
      { name: "データベース", category: "technology" },
      { name: "ネットワーク", category: "technology" },
      { name: "セキュリティ", category: "technology" },
      { name: "システム開発技術", category: "technology" },
      { name: "ソフトウェア開発管理技術", category: "technology" },

      // Management
      { name: "プロジェクトマネジメント", category: "management" },
      { name: "サービスマネジメント", category: "management" },
      { name: "システム監査", category: "management" },

      // Strategy
      { name: "システム戦略", category: "strategy" },
      { name: "システム企画", category: "strategy" },
      { name: "経営戦略マネジメント", category: "strategy" },
      { name: "技術戦略マネジメント", category: "strategy" },
      { name: "ビジネスインダストリ", category: "strategy" },
      { name: "企業活動", category: "strategy" },
      { name: "法務", category: "strategy" },
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
