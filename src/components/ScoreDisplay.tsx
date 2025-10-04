import type { Question, UserAnswer } from '../types';
import { calculateDistance, calculateScore, calculateTimeBonus } from '../utils/calculate';
import { commonStyles, theme } from '../styles/theme';

interface ScoreDisplayProps {
    question: Question;
    userAnswer: UserAnswer;
    score: number;
    answerTime: number;
    onNextQuestion: () => void;
}

export default function ScoreDisplay({ question, userAnswer, score, answerTime, onNextQuestion }: ScoreDisplayProps) {
    const distance = calculateDistance(
        question.lat,
        question.lon,
        userAnswer.lat,
        userAnswer.lon
    );

    // スコアの内訳を計算
    const distanceScore = calculateScore(distance);
    const timeBonus = calculateTimeBonus(answerTime);
    const totalScore = score;

    return (
        <div style={commonStyles.container}>
            <h2 style={commonStyles.title}>Results</h2>

            {/* 地図プレースホルダー（正解とユーザーの回答を表示） */}
            <div style={{
                ...commonStyles.card,
                minHeight: '200px'
            }}>
                <p style={{
                    fontSize: '1em',
                    marginBottom: '30px',
                    color: theme.colors.starSilver,
                    opacity: 0.8
                }}>
                    Map visualization
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '20px',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        padding: '20px',
                        background: theme.shadows.card,
                        borderRadius: theme.borderRadius.sm,
                        border: `1px solid ${theme.colors.accentBlue}40`,
                        minWidth: '180px'
                    }}>
                        <p style={{
                            fontWeight: '300',
                            color: theme.colors.accentBlue,
                            marginBottom: '10px',
                            fontSize: '0.9em'
                        }}>
                            Correct Location
                        </p>
                        <p style={{ fontSize: '0.85em' }}>Lat: {question.lat.toFixed(2)}°</p>
                        <p style={{ fontSize: '0.85em' }}>Lon: {question.lon.toFixed(2)}°</p>
                    </div>
                    <div style={{
                        padding: '20px',
                        background: theme.shadows.card,
                        borderRadius: theme.borderRadius.sm,
                        border: `1px solid ${theme.shadows.border}`,
                        minWidth: '180px'
                    }}>
                        <p style={{
                            fontWeight: '300',
                            color: theme.colors.starSilver,
                            marginBottom: '10px',
                            fontSize: '0.9em'
                        }}>
                            Your Answer
                        </p>
                        <p style={{ fontSize: '0.85em' }}>Lat: {userAnswer.lat.toFixed(2)}°</p>
                        <p style={{ fontSize: '0.85em' }}>Lon: {userAnswer.lon.toFixed(2)}°</p>
                    </div>
                </div>
            </div>

            {/* スコア表示 */}
            <div style={{
                padding: '30px',
                background: `${theme.colors.accentBlue}20`,
                borderRadius: theme.borderRadius.sm,
                border: `1px solid ${theme.colors.accentBlue}50`
            }}>
                {/* 総合スコア */}
                <p style={{
                    fontSize: '2.5em',
                    fontWeight: '300',
                    margin: '10px 0',
                    color: theme.colors.starWhite
                }}>
                    {totalScore.toFixed(0)}
                </p>
                <p style={{
                    fontSize: '1em',
                    color: theme.colors.starSilver,
                    marginBottom: '20px'
                }}>
                    Total Score
                </p>

                {/* スコア内訳 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: '20px',
                    marginTop: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '15px',
                        background: `${theme.colors.spaceBlue}60`,
                        borderRadius: theme.borderRadius.sm,
                        minWidth: '120px'
                    }}>
                        <p style={{
                            fontSize: '1.5em',
                            fontWeight: '300',
                            color: theme.colors.starWhite,
                            margin: '5px 0'
                        }}>
                            {distanceScore.toFixed(0)}
                        </p>
                        <p style={{
                            fontSize: '0.8em',
                            color: theme.colors.starSilver,
                            margin: '0'
                        }}>
                            Distance Score
                        </p>
                        <p style={{
                            fontSize: '0.7em',
                            color: theme.colors.starSilver,
                            opacity: 0.7,
                            margin: '5px 0 0 0'
                        }}>
                            {distance.toFixed(1)} km
                        </p>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        padding: '15px',
                        background: `${theme.colors.spaceBlue}60`,
                        borderRadius: theme.borderRadius.sm,
                        minWidth: '120px'
                    }}>
                        <p style={{
                            fontSize: '1.5em',
                            fontWeight: '300',
                            color: theme.colors.starWhite,
                            margin: '5px 0'
                        }}>
                            {timeBonus.toFixed(0)}
                        </p>
                        <p style={{
                            fontSize: '0.8em',
                            color: theme.colors.starSilver,
                            margin: '0'
                        }}>
                            Time Bonus
                        </p>
                        <p style={{
                            fontSize: '0.7em',
                            color: theme.colors.starSilver,
                            opacity: 0.7,
                            margin: '5px 0 0 0'
                        }}>
                            {answerTime.toFixed(1)}s
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={onNextQuestion}
                style={commonStyles.button}
            >
                Next Question
            </button>
        </div>
    );
}

