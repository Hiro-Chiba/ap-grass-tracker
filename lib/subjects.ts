export type Category = "technology" | "management" | "strategy";

export type Subject = {
  id: number;
  name: string;
  category: Category;
};

export const subjects: Subject[] = [
  { id: 1, name: "基礎理論", category: "technology" },
  { id: 2, name: "アルゴリズムとプログラミング", category: "technology" },
  { id: 3, name: "コンピュータ構成要素", category: "technology" },
  { id: 4, name: "システム構成要素", category: "technology" },
  { id: 5, name: "ソフトウェア", category: "technology" },
  { id: 6, name: "ハードウェア", category: "technology" },
  { id: 7, name: "データベース", category: "technology" },
  { id: 8, name: "ネットワーク", category: "technology" },
  { id: 9, name: "セキュリティ", category: "technology" },
  { id: 10, name: "システム開発技術", category: "technology" },
  { id: 11, name: "組込みシステム開発", category: "technology" },
  { id: 12, name: "情報システム基盤", category: "technology" },
  { id: 13, name: "プロジェクトマネジメント", category: "management" },
  { id: 14, name: "サービスマネジメント", category: "management" },
  { id: 15, name: "システム監査", category: "management" },
  { id: 16, name: "システム運用管理", category: "management" },
  { id: 17, name: "組織と法務", category: "management" },
  { id: 18, name: "企業活動", category: "strategy" },
  { id: 19, name: "経営戦略マネジメント", category: "strategy" },
  { id: 20, name: "システム戦略", category: "strategy" },
  { id: 21, name: "ビジネスインダストリ", category: "strategy" },
  { id: 22, name: "データ利活用戦略", category: "strategy" },
  { id: 23, name: "技術戦略", category: "strategy" }
];

export const SUBJECT_COUNT = subjects.length;
