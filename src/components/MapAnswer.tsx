import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Question, UserAnswer } from '../models';
import { calculateTimeBonus } from '../utils/calculate';

// 型定義の追加

interface MapAnswerProps {
    question: Question;
    onAnswerSubmit: (answer: UserAnswer) => void;
    gameStartTime: number;
}

// デフォルトマーカー作成関数
const createDefaultMarker = (map: maplibregl.Map, lat: number, lng: number) => {
    return new maplibregl.Marker({
        color: '#CB302E'
    })
        .setLngLat([lng, lat])
        .addTo(map);
};

export default function MapAnswer({ question, onAnswerSubmit, gameStartTime }: MapAnswerProps) {
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLon, setSelectedLon] = useState<number | null>(null);
    const [currentTimeBonus, setCurrentTimeBonus] = useState<number>(3000);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    // 3D地球儀の初期化
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://demotiles.maplibre.org/globe.json',
                center: [0, 0],
                zoom: 2
            });

            // 3D地球儀の設定
            map.current.on('load', () => {
                if (map.current) {
                    // クリックイベントの設定
                    map.current.on('click', (e: maplibregl.MapMouseEvent) => {
                        const { lng, lat } = e.lngLat;
                        setSelectedLat(lat);
                        setSelectedLon(lng);

                        // 既存のマーカーを削除
                        if (marker.current) {
                            marker.current.remove();
                        }

                        // 新しいマーカーを追加
                        marker.current = createDefaultMarker(map.current!, lat, lng);
                    });
                }
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // 画面サイズの変化を監視
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // リアルタイムで時間ボーナスを更新
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - gameStartTime) / 1000; // 秒単位
            setElapsedTime(elapsed);

            const timeBonus = calculateTimeBonus(elapsed);
            setCurrentTimeBonus(timeBonus);
        }, 100); // 100msごとに更新（滑らかな表示）

        return () => clearInterval(interval);
    }, [gameStartTime]);

    const handleSubmit = () => {
        if (selectedLat !== null && selectedLon !== null) {
            const answer: UserAnswer = {
                lat: selectedLat,
                lon: selectedLon,
                timestamp: Date.now()
            };
            onAnswerSubmit(answer);
        }
    };

    // ズームコントロール関数
    const handleZoomIn = () => {
        if (map.current) {
            map.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map.current) {
            map.current.zoomOut();
        }
    };

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
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    height: isMobile ? 'auto' : undefined,
                    flex: isMobile ? undefined : 1,
                    padding: isMobile ? '0 10px' : '0'
                }}>
                    {/* モバイル版: How to Playと画像表示を先に表示 */}
                    {isMobile && (
                        <div style={{
                            width: '100%',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {/* 操作説明 */}
                            <div style={{
                                background: 'rgba(42, 59, 90, 0.4)',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid rgba(184, 197, 214, 0.2)',
                                overflow: 'auto'
                            }}>
                                <h4 style={{
                                    margin: '0 0 10px 0',
                                    color: 'var(--star-white)',
                                    fontSize: '1em'
                                }}>
                                    How to Play
                                </h4>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '0.8em',
                                    color: 'var(--star-silver)',
                                    lineHeight: '1.4'
                                }}>
                                    • Click the map to place a marker
                                </p>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '0.8em',
                                    color: 'var(--star-silver)',
                                    lineHeight: '1.4'
                                }}>
                                    • Mouse drag: Rotate
                                </p>
                                <p style={{
                                    margin: '0',
                                    fontSize: '0.8em',
                                    color: 'var(--star-silver)',
                                    lineHeight: '1.4'
                                }}>
                                    • Mouse wheel: Zoom
                                </p>
                            </div>

                            {/* 写真表示エリア */}
                            <div style={{
                                border: '1px solid rgba(184, 197, 214, 0.2)',
                                borderRadius: '4px',
                                height: '200px',
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
                                        maxHeight: '180px',
                                        minHeight: '180px',
                                        objectFit: 'contain',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}
                                />
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

                        {/* 時間ボーナスプログレスバー */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            background: 'rgba(26, 31, 58, 0.9)',
                            border: '1px solid rgba(184, 197, 214, 0.3)',
                            borderRadius: '8px',
                            padding: '12px',
                            minWidth: '200px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{
                                color: 'var(--star-white)',
                                fontSize: '0.9em',
                                marginBottom: '8px',
                                fontWeight: '600'
                            }}>
                                Time Bonus: {currentTimeBonus.toFixed(0)}pt
                            </div>

                            {/* プログレスバー */}
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'rgba(184, 197, 214, 0.2)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${(currentTimeBonus / 3000) * 100}%`,
                                    height: '100%',
                                    background: elapsedTime < 10
                                        ? 'linear-gradient(90deg, #00FF88, #00CC66)'
                                        : elapsedTime < 180
                                            ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                                            : 'linear-gradient(90deg, #FF6B6B, #FF4444)',
                                    transition: 'width 0.1s ease-out',
                                    borderRadius: '4px'
                                }} />
                            </div>

                            <div style={{
                                color: 'var(--star-silver)',
                                fontSize: '0.7em',
                                marginTop: '4px',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>Time Passed:</span>
                                <span style={{
                                    minWidth: '40px',
                                    textAlign: 'right',
                                    fontFamily: 'monospace'
                                }}>
                                    {elapsedTime.toFixed(1)}s
                                </span>
                            </div>
                        </div>
                        {/* ズームコントロールボタン */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            zIndex: 1000
                        }}>
                            <button
                                onClick={handleZoomIn}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(26, 31, 58, 0.8)',
                                    border: '1px solid rgba(184, 197, 214, 0.3)',
                                    borderRadius: '4px',
                                    color: 'var(--star-white)',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 31, 58, 0.9)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 31, 58, 0.8)';
                                }}
                            >
                                +
                            </button>
                            <button
                                onClick={handleZoomOut}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(26, 31, 58, 0.8)',
                                    border: '1px solid rgba(184, 197, 214, 0.3)',
                                    borderRadius: '4px',
                                    color: 'var(--star-white)',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 31, 58, 0.9)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(26, 31, 58, 0.8)';
                                }}
                            >
                                −
                            </button>
                        </div>
                    </div>

                    {/* 右側: 情報表示エリア */}
                    <div style={{
                        width: isMobile ? '100%' : '35%',
                        height: isMobile ? 'auto' : '80vh',
                        maxHeight: isMobile ? '40vh' : 'none',
                        overflow: isMobile ? 'auto' : 'visible',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {/* 1つ目の枠: 操作説明と写真表示（Web版のみ表示） */}
                        {!isMobile && (
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
                                {/* 操作説明 */}
                                <div style={{
                                    background: 'rgba(42, 59, 90, 0.4)',
                                    padding: isMobile ? '10px' : '15px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(184, 197, 214, 0.2)',
                                    height: '24%',
                                    overflow: 'auto'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 10px 0',
                                        color: 'var(--star-white)',
                                        fontSize: '1em'
                                    }}>
                                        How to Play
                                    </h4>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '0.8em',
                                        color: 'var(--star-silver)',
                                        lineHeight: '1.4'
                                    }}>
                                        • Click the map to place a marker
                                    </p>
                                    <p style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '0.8em',
                                        color: 'var(--star-silver)',
                                        lineHeight: '1.4'
                                    }}>
                                        • Mouse drag: Rotate
                                    </p>
                                    <p style={{
                                        margin: '0',
                                        fontSize: '0.8em',
                                        color: 'var(--star-silver)',
                                        lineHeight: '1.4'
                                    }}>
                                        • Mouse wheel: Zoom
                                    </p>
                                </div>

                                {/* 写真表示エリア */}
                                <div style={{
                                    border: '1px solid rgba(184, 197, 214, 0.2)',
                                    borderRadius: '4px',
                                    height: '76%',
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
                                            maxHeight: '90%',
                                            minHeight: '80%',
                                            objectFit: 'contain',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                        }}
                                    />
                                    {/* <p style={{
                                    margin: '8px 0 0 0',
                                    color: 'var(--star-white)',
                                    fontSize: '0.8em',
                                    textAlign: 'center',
                                    opacity: 0.9,
                                    lineHeight: '1.2'
                                }}>
                                    {question.title}
                                </p> */}
                                </div>

                            </div>
                        )}

                        {/* 2つ目の枠: 座標情報とSubmitボタン */}
                        <div style={{
                            border: '1px solid rgba(184, 197, 214, 0.3)',
                            borderRadius: '4px',
                            background: 'rgba(26, 31, 58, 0.6)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {/* 座標情報とSubmitボタンのコンテナ */}
                            <div style={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: '15px',
                                alignItems: isMobile ? 'stretch' : 'flex-start'
                            }}>
                                {/* 選択座標情報 */}
                                <div style={{
                                    background: 'rgba(42, 59, 90, 0.4)',
                                    padding: '15px',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(184, 197, 214, 0.2)',
                                    flex: '1'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 10px 0',
                                        color: 'var(--star-white)',
                                        fontSize: '1em'
                                    }}>
                                        Selected Coordinates
                                    </h4>
                                    <div style={{
                                        display: 'flex',
                                        gap: '20px',
                                        fontSize: '1.1em'
                                    }}>
                                        <p style={{
                                            margin: '0',
                                            color: 'var(--star-silver)'
                                        }}>
                                            Lat: <span style={{ color: 'var(--star-white)' }}>{selectedLat !== null ? `${selectedLat.toFixed(4)}°` : '-'}</span>
                                        </p>
                                        <p style={{
                                            margin: '0',
                                            color: 'var(--star-silver)'
                                        }}>
                                            Lon: <span style={{ color: 'var(--star-white)' }}>{selectedLon !== null ? `${selectedLon.toFixed(4)}°` : '-'}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Submitボタン */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedLat === null || selectedLon === null}
                                    style={{
                                        padding: '15px 30px',
                                        fontSize: '0.95em',
                                        background: selectedLat !== null && selectedLon !== null
                                            ? 'var(--star-blue)'
                                            : 'rgba(184, 197, 214, 0.3)',
                                        color: 'var(--star-white)',
                                        border: '1px solid rgba(184, 197, 214, 0.3)',
                                        borderRadius: '4px',
                                        cursor: selectedLat !== null && selectedLon !== null
                                            ? 'pointer'
                                            : 'not-allowed',
                                        opacity: selectedLat !== null && selectedLon !== null ? 1 : 0.6,
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                        minWidth: '140px',
                                        height: 'fit-content',
                                        alignSelf: 'flex-end'
                                    }}
                                >
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
