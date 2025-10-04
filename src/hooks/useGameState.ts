import { useState } from 'react';
import type { GameState, UserAnswer } from '../types';
import { getRandomQuestion } from '../data/questions';
import { calculateDistance, calculateScore } from '../utils/distance';

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>({
        currentQuestion: null,
        userAnswer: null,
        score: null,
        gameStage: 'windowSelect'
    });

    const startGame = () => {
        const randomQuestion = getRandomQuestion();
        setGameState({
            ...gameState,
            currentQuestion: randomQuestion,
            gameStage: 'zoom'
        });
    };

    const completeZoom = () => {
        setGameState({
            ...gameState,
            gameStage: 'photoDisplay'
        });
    };

    const showMap = () => {
        setGameState({
            ...gameState,
            gameStage: 'mapAnswer'
        });
    };

    const submitAnswer = (answer: UserAnswer) => {
        if (!gameState.currentQuestion) return;

        const distance = calculateDistance(
            gameState.currentQuestion.lat,
            gameState.currentQuestion.lon,
            answer.lat,
            answer.lon
        );

        const score = calculateScore(distance);

        setGameState({
            ...gameState,
            userAnswer: answer,
            score,
            gameStage: 'scoreDisplay'
        });
    };

    const nextQuestion = () => {
        setGameState({
            currentQuestion: null,
            userAnswer: null,
            score: null,
            gameStage: 'windowSelect'
        });
    };

    return {
        gameState,
        startGame,
        completeZoom,
        showMap,
        submitAnswer,
        nextQuestion
    };
}
