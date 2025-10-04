import type { Question } from './Question';
import type { UserAnswer } from './UserAnswer';
import type { GameStage } from './GameStage';

// Overall game state
export interface GameState {
    currentQuestion: Question | null;
    userAnswer: UserAnswer | null;
    score: number | null;
    answerTime: number | null;  // Answer time (seconds)
    gameStage: GameStage;
}