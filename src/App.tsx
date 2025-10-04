import { useState } from 'react';
import type { GameState, Question, UserAnswer } from './types';
import WindowSelector from './components/WindowSelector';
import ZoomAnimation from './components/ZoomAnimation';
import PhotoDisplay from './components/PhotoDisplay';
import MapAnswer from './components/MapAnswer';
import ScoreDisplay from './components/ScoreDisplay';
import './App.css';

// ダミーの問題データ
const dummyQuestions: Question[] = [
  {
    id: 1,
    file: '/images/iss_photo_1.jpg',
    lat: 35.6762,
    lon: 139.6503,
    title: '東京上空からの撮影'
  },
  {
    id: 2,
    file: '/images/iss_photo_2.jpg',
    lat: 40.7128,
    lon: -74.0060,
    title: 'ニューヨーク上空'
  },
  {
    id: 3,
    file: '/images/iss_photo_3.jpg',
    lat: -33.8688,
    lon: 151.2093,
    title: 'シドニー上空'
  }
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    userAnswer: null,
    score: null,
    gameStage: 'windowSelect'
  });

  // 窓クリック時：ランダムに問題を選択してズームへ
  const handleWindowClick = () => {
    const randomQuestion = dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
    setGameState({
      ...gameState,
      currentQuestion: randomQuestion,
      gameStage: 'zoom'
    });
  };

  // ズーム演出完了：写真表示へ
  const handleZoomComplete = () => {
    setGameState({
      ...gameState,
      gameStage: 'photoDisplay'
    });
  };

  // 写真クリック：地図回答へ
  const handlePhotoClick = () => {
    setGameState({
      ...gameState,
      gameStage: 'mapAnswer'
    });
  };

  // 回答送信：スコア計算して表示へ
  const handleAnswerSubmit = (answer: UserAnswer) => {
    // 簡易スコア計算（距離が近いほど高得点）
    if (!gameState.currentQuestion) return;

    const distance = calculateDistance(
      gameState.currentQuestion.lat,
      gameState.currentQuestion.lon,
      answer.lat,
      answer.lon
    );

    // スコア計算（最大5000点、距離に応じて減点）
    const calculatedScore = Math.max(0, 5000 - distance);

    setGameState({
      ...gameState,
      userAnswer: answer,
      score: calculatedScore,
      gameStage: 'scoreDisplay'
    });
  };

  // 次の問題へ：最初に戻る
  const handleNextQuestion = () => {
    setGameState({
      currentQuestion: null,
      userAnswer: null,
      score: null,
      gameStage: 'windowSelect'
    });
  };

  // 距離計算（Haversine式）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '60px',
        textTransform: 'uppercase'
      }}>
        CupolaQuest
      </h1>

      {/* 現在のステージ表示 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '12px',
        background: 'rgba(42, 59, 90, 0.3)',
        borderRadius: '4px',
        border: '1px solid rgba(184, 197, 214, 0.2)',
        fontSize: '0.9em',
        color: 'var(--star-silver)',
        letterSpacing: '0.1em'
      }}>
        STAGE: {gameState.gameStage.toUpperCase()}
      </div>

      {/* ステージに応じてコンポーネント表示 */}
      {gameState.gameStage === 'windowSelect' && (
        <WindowSelector onWindowClick={handleWindowClick} />
      )}

      {gameState.gameStage === 'zoom' && (
        <ZoomAnimation onAnimationComplete={handleZoomComplete} />
      )}

      {gameState.gameStage === 'photoDisplay' && gameState.currentQuestion && (
        <PhotoDisplay
          question={gameState.currentQuestion}
          onPhotoClick={handlePhotoClick}
        />
      )}

      {gameState.gameStage === 'mapAnswer' && gameState.currentQuestion && (
        <MapAnswer
          question={gameState.currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {gameState.gameStage === 'scoreDisplay' &&
        gameState.currentQuestion &&
        gameState.userAnswer &&
        gameState.score !== null && (
          <ScoreDisplay
            question={gameState.currentQuestion}
            userAnswer={gameState.userAnswer}
            score={gameState.score}
            onNextQuestion={handleNextQuestion}
          />
        )}
    </div>
  );
}

export default App;
