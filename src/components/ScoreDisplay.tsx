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

    // マップの初期化
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://demotiles.maplibre.org/globe.json',
                center: [0, 0],
                zoom: 2
            });

            map.current.on('load', () => {
                if (map.current) {
                    // 正解マーカー（緑色）
                    correctMarker.current = createDefaultMarker(
                        map.current,
                        question.lat,
                        question.lon,
                        '#00CC00'
                    );

                    // ユーザー回答マーカー（線と同じ色）
                    userMarker.current = createDefaultMarker(
                        map.current,
                        userAnswer.lat,
                        userAnswer.lon,
                        '#CB302E'
                    );

                    // 2つのマーカー間の線を描く（中間点を1つ追加）
                    const midLat = (question.lat + userAnswer.lat) / 2;

                    // 経度の最短経路を計算（-180/+180を考慮）
                    let lonDiff = userAnswer.lon - question.lon;
                    if (lonDiff > 180) lonDiff -= 360;
                    if (lonDiff < -180) lonDiff += 360;
                    let midLon = question.lon + lonDiff / 2;
                    if (midLon > 180) midLon -= 360;
                    if (midLon < -180) midLon += 360;

                    map.current.addSource('connection-line', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': [
                                    [question.lon, question.lat],
                                    [midLon, midLat],
                                    [userAnswer.lon, userAnswer.lat]
                                ]
                            }
                        }
                    });

                    // 線のレイヤーを追加
                    map.current.addLayer({
                        'id': 'connection-line',
                        'type': 'line',
                        'source': 'connection-line',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#FF0080',
                            'line-width': 3,
                            'line-opacity': 0.9
                        }
                    });

                    // 両方のマーカーが表示されるようにビューを調整
                    const bounds = new maplibregl.LngLatBounds();
                    bounds.extend([question.lon, question.lat]);
                    bounds.extend([userAnswer.lon, userAnswer.lat]);
                    map.current.fitBounds(bounds, { padding: 50 });
                }
            });
        }

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
        <div style={commonStyles.container}>
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

            <h2 style={commonStyles.title}>Results</h2>

            {/* 3D地球儀地図（正解とユーザーの回答をマーカーで表示） */}
            <div style={{
                ...commonStyles.card,
                minHeight: '400px',
                position: 'relative'
            }}>
                <p style={{
                    fontSize: '1em',
                    marginBottom: '20px',
                    color: theme.colors.starSilver,
                    opacity: 0.8
                }}>
                    Map visualization
                </p>

                {/* 3D地球儀 */}
                <div
                    ref={mapContainer}
                    style={{
                        height: '350px',
                        width: '100%',
                        borderRadius: '4px',
                        border: '1px solid rgba(184, 197, 214, 0.3)'
                    }}
                />

                {/* マーカー凡例 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    marginTop: '15px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            background: '#00CC00',
                            border: '2px solid #fff',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }} />
                        <span style={{
                            fontSize: '0.9em',
                            color: theme.colors.starSilver
                        }}>
                            Correct Location
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            background: '#CB302E',
                            border: '2px solid #fff',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }} />
                        <span style={{
                            fontSize: '0.9em',
                            color: theme.colors.starSilver
                        }}>
                            Your Answer
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '3px',
                            background: '#FF0080',
                            borderRadius: '2px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }} />
                        <span style={{
                            fontSize: '0.9em',
                            color: theme.colors.starSilver
                        }}>
                            Distance Line
                        </span>
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

