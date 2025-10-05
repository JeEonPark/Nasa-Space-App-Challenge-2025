import Welcome from './components/Welcome';
import WindowSelector from './components/WindowSelector';
import PhotoDisplay from './components/PhotoDisplay';
import MapAnswer from './components/MapAnswer';
import ScoreDisplay from './components/ScoreDisplay';
import { useGameState } from './hooks/useGameState';

function App() {
  const {
    gameState,
    startWelcome,
    startGame,
    showMap,
    submitAnswer,
    nextQuestion,
    gameStartTime
  } = useGameState();

  return (
    <div style={{
      // maxWidth: '1200px',
      // margin: '0 auto',
      // padding: `${theme.spacing.xl} ${theme.spacing.md}`,
      // minHeight: '100vh'
    }}>
      {/* <h1 style={{
        textAlign: 'center',
        marginBottom: theme.spacing.xxl,
        textTransform: 'uppercase',
        color: theme.colors.starWhite,
        fontSize: '2em',
        fontWeight: '300',
        letterSpacing: '0.05em'
      }}>
        CupolaQuest
      </h1> */}

      {/* 現在のステージ表示 */}
      {/* <div style={{
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.sm,
        background: `${theme.colors.spaceBlueLight}50`,
        borderRadius: theme.borderRadius.sm,
        border: `1px solid ${theme.shadows.border}`,
        fontSize: '0.9em',
        color: theme.colors.starSilver,
        letterSpacing: '0.1em'
      }}>
        STAGE: {gameState.gameStage.toUpperCase()}
      </div> */}

      {/* ステージに応じてコンポーネント表示 */}
      {gameState.gameStage === 'welcome' && (
        <Welcome onStartGame={startWelcome} />
      )}

      {gameState.gameStage === 'waitingToStart' && (
        <WindowSelector onWindowClick={startGame} />
      )}


      {gameState.gameStage === 'viewingPhoto' && gameState.currentQuestion && (
        <PhotoDisplay
          question={gameState.currentQuestion}
          onPhotoClick={showMap}
        />
      )}

      {gameState.gameStage === 'answeringOnMap' && gameState.currentQuestion && gameStartTime && (
        <MapAnswer
          question={gameState.currentQuestion}
          onAnswerSubmit={submitAnswer}
          gameStartTime={gameStartTime}
        />
      )}

      {gameState.gameStage === 'showingResults' &&
        gameState.currentQuestion &&
        gameState.userAnswer &&
        gameState.score !== null &&
        gameState.answerTime !== null && (
          <ScoreDisplay
            question={gameState.currentQuestion}
            userAnswer={gameState.userAnswer}
            score={gameState.score}
            answerTime={gameState.answerTime}
            onNextQuestion={nextQuestion}
          />
        )}
    </div>
  );
}

export default App;
