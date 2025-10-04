import type { Question } from '../types';

export const dummyQuestions: Question[] = [
    {
        id: 1,
        file: '/images/iss_photo_1.jpg',
        lat: 35.6762,
        lon: 139.6503,
        title: '東京上空からの撮影',
        collection: 'Japan',
        difficulty: 1
    },
    {
        id: 2,
        file: '/images/iss_photo_2.jpg',
        lat: 40.7128,
        lon: -74.0060,
        title: 'ニューヨーク上空',
        collection: 'North America',
        difficulty: 2
    },
    {
        id: 3,
        file: '/images/iss_photo_3.jpg',
        lat: -33.8688,
        lon: 151.2093,
        title: 'シドニー上空',
        collection: 'Australia',
        difficulty: 3
    }
];

/**
 * ランダムに問題を選択
 */
export function getRandomQuestion(): Question {
    return dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];
}
