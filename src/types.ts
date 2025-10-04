// 問題情報
export interface Question {
    id: number;
    file: string;         // 画像パス
    lat: number;          // 正解緯度
    lon: number;          // 正解経度
    title: string;        // 写真タイトル
    collection?: string;  // コレクション名（任意）
    difficulty?: number;  // 任意：難易度
    timestamp?: number;   // 任意：撮影日時
}

// ユーザーの解答
export interface UserAnswer {
    lat: number;
    lon: number;
    timestamp: number;    // 回答時刻
    distanceToAnswer?: number; // 任意：正解までの距離
    score?: number;           // 任意：解答スコア
}

// ゲームステージ
export type GameStage =
    | 'waitingToStart'      // 開始を待機中
    | 'zoomingToPhoto'      // 写真にズーム中
    | 'viewingPhoto'        // 写真を表示中
    | 'answeringOnMap'      // 地図で回答中
    | 'showingResults';     // 結果表示中

// ゲーム全体の状態
export interface GameState {
    currentQuestion: Question | null;
    userAnswer: UserAnswer | null;
    score: number | null;
    answerTime: number | null;  // 回答時間（秒）
    gameStage: GameStage;
}

