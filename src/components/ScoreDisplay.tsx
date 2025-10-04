import type { Question, UserAnswer } from '../types';

interface ScoreDisplayProps {
    question: Question;
    userAnswer: UserAnswer;
    score: number;
    onNextQuestion: () => void;
}

// Haversine式で距離計算（簡易版）
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function ScoreDisplay({ question, userAnswer, score, onNextQuestion }: ScoreDisplayProps) {
    const distance = calculateDistance(
        question.lat,
        question.lon,
        userAnswer.lat,
        userAnswer.lon
    );

    return (
        <div style={{
            border: '1px solid rgba(184, 197, 214, 0.2)',
            padding: '40px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            background: 'rgba(26, 31, 58, 0.4)',
            borderRadius: '8px'
        }}>
            <h2>Results</h2>

            {/* 地図プレースホルダー（正解とユーザーの回答を表示） */}
            <div style={{
                border: '1px solid rgba(184, 197, 214, 0.3)',
                padding: '40px',
                background: 'rgba(10, 14, 39, 0.5)',
                minHeight: '200px',
                borderRadius: '4px'
            }}>
                <p style={{
                    fontSize: '1em',
                    marginBottom: '30px',
                    color: 'var(--star-silver)',
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
                        background: 'rgba(42, 59, 90, 0.6)',
                        borderRadius: '4px',
                        border: '1px solid rgba(74, 144, 226, 0.3)',
                        minWidth: '180px'
                    }}>
                        <p style={{
                            fontWeight: '300',
                            color: 'var(--accent-blue)',
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
                        background: 'rgba(42, 59, 90, 0.6)',
                        borderRadius: '4px',
                        border: '1px solid rgba(184, 197, 214, 0.2)',
                        minWidth: '180px'
                    }}>
                        <p style={{
                            fontWeight: '300',
                            color: 'var(--star-silver)',
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
                background: 'rgba(74, 144, 226, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(74, 144, 226, 0.3)'
            }}>
                <p style={{
                    fontSize: '2em',
                    fontWeight: '300',
                    margin: '10px 0',
                    color: 'var(--star-white)'
                }}>
                    {score.toFixed(0)}
                </p>
                <p style={{
                    fontSize: '0.9em',
                    color: 'var(--star-silver)',
                    marginTop: '10px'
                }}>
                    Distance: {distance.toFixed(2)} km
                </p>
            </div>

            <button
                onClick={onNextQuestion}
                style={{
                    padding: '15px 40px',
                    fontSize: '0.95em',
                    marginTop: '10px'
                }}
            >
                Next Question
            </button>
        </div>
    );
}

