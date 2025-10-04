import type { Question, UserAnswer } from '../types';
import { calculateDistance } from '../utils/distance';
import { commonStyles, theme } from '../styles/theme';

interface ScoreDisplayProps {
    question: Question;
    userAnswer: UserAnswer;
    score: number;
    onNextQuestion: () => void;
}

export default function ScoreDisplay({ question, userAnswer, score, onNextQuestion }: ScoreDisplayProps) {
    const distance = calculateDistance(
        question.lat,
        question.lon,
        userAnswer.lat,
        userAnswer.lon
    );

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
                <p style={{
                    fontSize: '2em',
                    fontWeight: '300',
                    margin: '10px 0',
                    color: theme.colors.starWhite
                }}>
                    {score.toFixed(0)}
                </p>
                <p style={{
                    fontSize: '0.9em',
                    color: theme.colors.starSilver,
                    marginTop: '10px'
                }}>
                    Distance: {distance.toFixed(2)} km
                </p>
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

