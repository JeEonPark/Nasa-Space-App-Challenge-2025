import { useEffect, useRef, useState } from 'react';
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

// Default marker creation function
const createDefaultMarker = (map: maplibregl.Map, lat: number, lng: number, color: string) => {
    return new maplibregl.Marker({
        color: color
    })
        .setLngLat([lng, lat])
        .addTo(map);
};

// Camera marker creation function
const createCameraMarker = (map: maplibregl.Map, lat: number, lng: number) => {
    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#00CC00" stroke="#888888" stroke-width="1"/>
            <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" stroke="#888888" stroke-width="0.5"/>
        </svg>
    `;
    return new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
};

export default function ScoreDisplay({ question, userAnswer, score, answerTime, onNextQuestion }: ScoreDisplayProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const correctMarker = useRef<maplibregl.Marker | null>(null);
    const userMarker = useRef<maplibregl.Marker | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const [imageSrc, setImageSrc] = useState('');

    const distance = calculateDistance(question.lat, question.lon, userAnswer.lat, userAnswer.lon);
    const distanceScore = calculateScore(distance);
    const timeBonus = calculateTimeBonus(answerTime);

    // Load and rotate image if needed
    useEffect(() => {
        const img = new Image();
        img.src = `/iss_photos/${question.file}`;

        img.onload = () => {
            const isVertical = img.height > img.width;

            if (isVertical) {
                // Rotate the image using canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.height;
                canvas.height = img.width;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    setImageSrc(canvas.toDataURL('image/jpeg', 0.95));
                }
            } else {
                setImageSrc(img.src);
            }
        };
    }, [question.file]);

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

            // Correct answer marker (green camera)
            correctMarker.current = createCameraMarker(map.current, question.lat, question.lon);

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

    // Screen resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isMobile ? 'flex-start' : 'center',
                alignItems: 'center',
                position: 'relative',
                background: 'rgba(26, 31, 58, 0.4)',
                gap: '20px',
                padding: '20px',
                boxSizing: 'border-box',
                overflow: isMobile ? 'auto' : 'visible'
            }}>
                {/* タイトル */}
                <h1 style={{
                    fontSize: 'clamp(2em, 5vw, 4em)',
                    fontWeight: '700',
                    color: 'var(--star-white)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    textAlign: 'center'
                }}>
                    CUPOLA QUEST
                </h1>

                {/* メインコンテンツエリア */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    height: isMobile ? 'auto' : undefined,
                    flex: isMobile ? undefined : 1
                }}>
                    {/* モバイル版: 画像領域を先に表示 */}
                    {isMobile && (
                        <div style={{
                            width: '100%',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {/* 画像表示エリア */}
                            <div style={{
                                border: '1px solid rgba(184, 197, 214, 0.3)',
                                borderRadius: '4px',
                                background: 'transparent',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                height: '220px'
                            }}>
                                {imageSrc && (
                                    <img
                                        src={imageSrc}
                                        alt={question.title}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '180px',
                                            minHeight: '180px',
                                            objectFit: 'contain',
                                            borderRadius: '4px',
                                            boxShadow: 'none'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* 左側: 3D地球儀地図 */}
                    <div style={{
                        border: '1px solid rgba(184, 197, 214, 0.3)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        height: isMobile ? '40vh' : '100%',
                        width: isMobile ? '100%' : '55%',
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
                        width: isMobile ? '100%' : '35%',
                        height: isMobile ? 'auto' : '80vh',
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
                            height: '85%',
                            gap: '15px',
                            flex: '1'
                        }}>
                            {/* 写真表示エリア（Web版のみ） */}
                            {!isMobile && (
                                <div style={{
                                    border: '1px solid rgba(184, 197, 214, 0.2)',
                                    borderRadius: '4px',
                                    height: '50%',
                                    background: 'rgba(42, 59, 90, 0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    overflow: 'hidden'
                                }}>
                                    {imageSrc && (
                                        <img
                                            src={imageSrc}
                                            alt={question.title}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '90%',
                                                minHeight: '80%',
                                                objectFit: 'contain',
                                                borderRadius: '4px',
                                                boxShadow: 'none'
                                            }}
                                        />
                                    )}
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
                            )}

                            <h3 style={{
                                fontSize: '1.4em',
                                color: 'var(--star-white)',
                                textAlign: 'center',
                                flexShrink: 0,
                            }}>
                                Score Breakdown
                            </h3>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                flex: '1',
                                justifyContent: 'center',
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
                            borderRadius: '4px',
                            background: 'rgba(26, 31, 58, 0.6)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            height: '15%',
                            alignItems: 'center'
                        }}>
                            <button
                                onClick={onNextQuestion}
                                style={{
                                    ...commonStyles.button,
                                    width: '200px'
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
