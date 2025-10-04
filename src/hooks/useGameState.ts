import { useState } from 'react';
import type { GameState, UserAnswer } from '../models';
import { getRandomQuestion } from '../data/QuestionUtil';
import { calculateDistance, calculateTotalScore } from '../utils/calculate';

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>({
        currentQuestion: null,
        userAnswer: null,
        score: null,
        answerTime: null,
        gameStage: 'welcome'
    });

    const [gameStartTime, setGameStartTime] = useState<number | null>(null);

    const startWelcome = () => {
        setGameState({
            ...gameState,
            gameStage: 'waitingToStart'
        });
    };

    const startGame = () => {
        const randomQuestion = getRandomQuestion();
        const startTime = Date.now();
        setGameStartTime(startTime);
        setGameState({
            ...gameState,
            currentQuestion: randomQuestion,
            gameStage: 'viewingPhoto'
        });
    };


    const showMap = () => {
        setGameState({
            ...gameState,
            gameStage: 'answeringOnMap'
        });
    };

    const submitAnswer = (answer: UserAnswer) => {
        if (!gameState.currentQuestion || !gameStartTime) return;

        const distance = calculateDistance(
            gameState.currentQuestion.lat,
            gameState.currentQuestion.lon,
            answer.lat,
            answer.lon
        );

        // 回答時間を計算（秒）
        const answerTime = (Date.now() - gameStartTime) / 1000;

        // 総合スコアを計算（距離 + 時間ボーナス）
        const score = calculateTotalScore(distance, answerTime);

        // 回答データに時間を追加
        const answerWithTime: UserAnswer = {
            ...answer,
            timestamp: Date.now(),
            distanceToAnswer: distance
        };

        setGameState({
            ...gameState,
            userAnswer: answerWithTime,
            score,
            answerTime,
            gameStage: 'showingResults'
        });
    };

    const nextQuestion = () => {
        const randomQuestion = getRandomQuestion();
        const startTime = Date.now();
        setGameStartTime(startTime);
        setGameState({
            currentQuestion: randomQuestion,
            userAnswer: null,
            score: null,
            answerTime: null,
            gameStage: 'viewingPhoto'
        });
    };

    return {
        gameState,
        startWelcome,
        startGame,
        showMap,
        submitAnswer,
        nextQuestion
    };
}
