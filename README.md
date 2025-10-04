# CupolaQuest

ISSの展望モジュール「Cupola」から撮影された地球写真を使った位置当てゲーム

## 概要

CupolaQuestは、国際宇宙ステーション（ISS）のCupola窓から撮影された地球の写真を見て、どこを撮影したのかを当てるGeoGuesserライクなゲームです。

### 主な機能

1. **窓選択** - Cupolaの7つの窓から1つを選択
2. **ズーム演出** - 窓に近づくアニメーション
3. **写真表示** - ISSから撮影された地球の写真を表示
4. **地図で回答** - 地図上をクリックして位置を推測
5. **スコア表示** - 正解との距離に基づいてスコアを計算

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: CSS Variables + Inline Styles
- **地図**: 未定（Mapbox / Leaflet / Google Maps）

## セットアップ

### 必要環境

- Node.js 18以上
- npm 10以上

### インストール

```bash
# 依存関係のインストール
npm install --include=dev

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## プロジェクト構造

```
src/
├── types.ts              # 型定義
├── App.tsx               # メインアプリ
├── index.css             # グローバルスタイル
└── components/
    ├── WindowSelector.tsx    # 窓選択画面
    ├── ZoomAnimation.tsx     # ズームアニメーション
    ├── PhotoDisplay.tsx      # 写真表示画面
    ├── MapAnswer.tsx         # 地図回答画面
    └── ScoreDisplay.tsx      # スコア表示画面
```

## データモデル

### Question（問題）

```typescript
interface Question {
  id: number;
  file: string;         // 画像パス
  lat: number;          // 正解緯度
  lon: number;          // 正解経度
  title: string;        // 写真タイトル
  collection?: string;  // コレクション名
  difficulty?: number;  // 難易度
  timestamp?: number;   // 撮影日時
}
```

### UserAnswer（ユーザーの解答）

```typescript
interface UserAnswer {
  lat: number;
  lon: number;
  timestamp: number;
  distanceToAnswer?: number;
  score?: number;
}
```

### GameStage（ゲームステージ）

```typescript
type GameStage = 
  | 'windowSelect'   // 窓選択
  | 'zoom'           // ズーム演出
  | 'photoDisplay'   // 写真表示
  | 'mapAnswer'      // 地図回答
  | 'scoreDisplay';  // スコア表示
```


Made with 🌌 for NASA Space Apps Challenge 2025
