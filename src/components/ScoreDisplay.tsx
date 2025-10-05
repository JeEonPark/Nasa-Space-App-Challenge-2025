import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Question, UserAnswer } from '../models';
import { calculateDistance, calculateScore, calculateTimeBonus } from '../utils/calculate';
import { commonStyles, theme } from '../styles/theme';

interface ScoreDisplayProps {
    question: Question;
    userAnswer: UserAnswer;
    score: number;
    answerTime: number;
    onNextQuestion: () => void;
}

// デフォルトマーカー作成関数
const createDefaultMarker = (map: maplibregl.Map, lat: number, lng: number, color: string) => {
    return new maplibregl.Marker({
        color: color
    })
        .setLngLat([lng, lat])
        .addTo(map);
};

export default function ScoreDisplay({ question, userAnswer, score, answerTime, onNextQuestion }: ScoreDisplayProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const correctMarker = useRef<maplibregl.Marker | null>(null);
    const userMarker = useRef<maplibregl.Marker | null>(null);

    const distance = calculateDistance(question.lat, question.lon, userAnswer.lat, userAnswer.lon);
    const distanceScore = calculateScore(distance);
    const timeBonus = calculateTimeBonus(answerTime);

    useEffect(() => {
        if (!mapContainer.current) return;

        // マップの初期化
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/globe.json',
            center: [0, 0],
            zoom: 2
        });

        // マップの読み込み完了後にマーカーを追加
        map.current.on('load', () => {
            if (!map.current) return;

            // 正解マーカー（緑）
            correctMarker.current = createDefaultMarker(map.current, question.lat, question.lon, '#00CC00');

            // ユーザーの回答マーカー（赤）
            userMarker.current = createDefaultMarker(map.current, userAnswer.lat, userAnswer.lon, '#CB302E');

            // 2点間の線を描画
            map.current.addSource('connection-line', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [question.lon, question.lat],
                            [userAnswer.lon, userAnswer.lat]
                        ]
                    }
                }
            });

            map.current.addLayer({
                id: 'connection-line',
                type: 'line',
                source: 'connection-line',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF0080',
                    'line-width': 3,
                    'line-opacity': 0.9
                }
            });

            // 両方のマーカーが表示されるようにズーム調整
            const bounds = new maplibregl.LngLatBounds();
            bounds.extend([question.lon, question.lat]);
            bounds.extend([userAnswer.lon, userAnswer.lat]);
            map.current.fitBounds(bounds, { padding: 50 });
        });

        return () => {
            if (map.current) {
                // 線のレイヤーとソースを削除
                if (map.current.getLayer('connection-line')) {
                    map.current.removeLayer('connection-line');
                }
                if (map.current.getSource('connection-line')) {
                    map.current.removeSource('connection-line');
                }
                map.current.remove();
                map.current = null;
            }
        };
    }, [question.lat, question.lon, userAnswer.lat, userAnswer.lon]);

    return (
        <>
            <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                background: 'rgba(26, 31, 58, 0.4)',
                gap: '20px',
                padding: '20px'
            }}>
                {/* タイトル */}
                <h1 style={{
                    fontSize: 'clamp(2em, 5vw, 4em)',
                    fontWeight: '700',
                    color: 'var(--star-white)',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    textAlign: 'center'
                }}>
                    CUPOLA QUEST
                </h1>

                {/* メインコンテンツエリア (横並び) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    height: '70vh'
                }}>
                    {/* 左側: 3D地球儀地図 */}
                    <div style={{
                        border: '1px solid rgba(184, 197, 214, 0.3)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        height: '70vh',
                        width: '55%',
                        position: 'relative'
                    }}>
                        <div
                            ref={mapContainer}
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '4px'
                            }}
                        />

                        {/* マーカー凡例 */}
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '20px',
                            background: 'rgba(26, 31, 58, 0.8)',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: '1px solid rgba(184, 197, 214, 0.3)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#00CC00',
                                    borderRadius: '50%'
                                }} />
                                <span style={{
                                    fontSize: '0.8em',
                                    color: 'var(--star-silver)'
                                }}>
                                    Correct
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: '#CB302E',
                                    borderRadius: '50%'
                                }} />
                                <span style={{
                                    fontSize: '0.8em',
                                    color: 'var(--star-silver)'
                                }}>
                                    Your Answer
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 右側: 情報表示エリア */}
                    <div style={{
                        width: '35%',
                        height: '70vh',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {/* 1つ目の枠: 画像表示とスコア情報 */}
                        <div style={{
                            border: '1px solid rgba(184, 197, 214, 0.3)',
                            borderRadius: '4px',
                            background: 'rgba(26, 31, 58, 0.6)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            flex: '1'
                        }}>
                            {/* 写真表示エリア */}
                            <div style={{
                                border: '1px solid rgba(184, 197, 214, 0.2)',
                                borderRadius: '4px',
                                background: 'rgba(42, 59, 90, 0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={`/iss_photos/${question.file}`}
                                    alt={question.title}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                />
                                <p style={{
                                    margin: '8px 0 0 0',
                                    color: 'var(--star-white)',
                                    fontSize: '0.8em',
                                    textAlign: 'center',
                                    opacity: 0.9,
                                    lineHeight: '1.2'
                                }}>
                                    {question.title}
                                </p>
                            </div>

                            <h3 style={{
                                fontSize: '1.4em',
                                margin: '0 0 -7px 0',
                                color: 'var(--star-white)',
                                textAlign: 'center'
                            }}>
                                Score Breakdown
                            </h3>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px'
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '15px',
                                    background: `${theme.colors.spaceBlue}60`,
                                    borderRadius: theme.borderRadius.sm,
                                    border: `1px solid ${theme.colors.accentBlue}50`
                                }}>
                                    <p style={{
                                        fontSize: '2em',
                                        fontWeight: 'bold',
                                        color: theme.colors.starWhite,
                                        margin: '5px 0'
                                    }}>
                                        {score.toFixed(0)}<span style={{ fontSize: '0.9em' }}>pt</span>
                                    </p>
                                    <p style={{
                                        fontSize: '0.9em',
                                        color: theme.colors.starSilver,
                                        margin: '0'
                                    }}>
                                        Total Score
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '12px',
                                        background: `${theme.colors.spaceBlue}60`,
                                        borderRadius: theme.borderRadius.sm,
                                        border: `1px solid ${theme.colors.accentBlue}50`,
                                        flex: '1'
                                    }}>
                                        <p style={{
                                            fontSize: '1.3em',
                                            fontWeight: '300',
                                            color: theme.colors.starWhite,
                                            margin: '5px 0'
                                        }}>
                                            {distanceScore.toFixed(0)}<span style={{ fontSize: '0.7em' }}>pt</span>
                                        </p>
                                        <p style={{
                                            fontSize: '0.8em',
                                            color: theme.colors.starSilver,
                                            margin: '0'
                                        }}>
                                            Distance
                                        </p>
                                        <p style={{
                                            fontSize: '0.7em',
                                            color: theme.colors.starSilver,
                                            opacity: 0.7,
                                            margin: '3px 0 0 0'
                                        }}>
                                            {distance.toFixed(1)} km
                                        </p>
                                    </div>

                                    <div style={{
                                        textAlign: 'center',
                                        padding: '12px',
                                        background: `${theme.colors.spaceBlue}60`,
                                        borderRadius: theme.borderRadius.sm,
                                        border: `1px solid ${theme.colors.accentBlue}50`,
                                        flex: '1'
                                    }}>
                                        <p style={{
                                            fontSize: '1.3em',
                                            fontWeight: '300',
                                            color: theme.colors.starWhite,
                                            margin: '5px 0'
                                        }}>
                                            {timeBonus.toFixed(0)}<span style={{ fontSize: '0.7em' }}>pt</span>
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
                                            margin: '3px 0 0 0'
                                        }}>
                                            {answerTime.toFixed(1)}s
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2つ目の枠: 次の問題ボタン */}
                        <div style={{
                            border: '1px solid rgba(184, 197, 214, 0.3)',
                            borderRadius: '4px',
                            background: 'rgba(26, 31, 58, 0.6)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <button
                                onClick={onNextQuestion}
                                style={commonStyles.button}
                            >
                                Next Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
