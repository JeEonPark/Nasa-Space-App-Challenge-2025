import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Question, UserAnswer } from '../models';

// 型定義の追加

interface MapAnswerProps {
    question: Question;
    onAnswerSubmit: (answer: UserAnswer) => void;
}

// 3D地球儀のマーカー用のカスタムアイコン
const createCustomMarker = (map: maplibregl.Map, lat: number, lng: number) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.cssText = `
        width: 20px;
        height: 20px;
        background: #ff6b6b;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
    `;

    return new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);
};

export default function MapAnswer({ onAnswerSubmit }: MapAnswerProps) {
    //　地図と同じ画面に、クイズの画像を表示するときにquestion.fileを使用
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLon, setSelectedLon] = useState<number | null>(null);
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
                    map.current.on('click', (e) => {
                        const { lng, lat } = e.lngLat;
                        setSelectedLat(lat);
                        setSelectedLon(lng);

                        // 既存のマーカーを削除
                        if (marker.current) {
                            marker.current.remove();
                        }

                        // 新しいマーカーを追加
                        marker.current = createCustomMarker(map.current!, lat, lng);
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

    return (

        <>
            <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                background: 'rgba(26, 31, 58, 0.4)',
                gap: '20px',
                padding: '20px'
            }}>

                {/* 左側: 3D地球儀地図 */}
                <div style={{
                    border: '1px solid rgba(184, 197, 214, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    height: '70vh',
                    width: '60%',
                    maxWidth: '600px',
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

                    {/* 3D地球儀の上にオーバーレイ情報を表示 */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(26, 31, 58, 0.8)',
                        padding: '10px 15px',
                        borderRadius: '4px',
                        border: '1px solid rgba(184, 197, 214, 0.3)',
                        color: 'var(--star-white)',
                        fontSize: '0.9em',
                        zIndex: 1000
                    }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>3D地球儀操作</p>
                        <p style={{ margin: '0', fontSize: '0.8em', opacity: 0.8 }}>
                            クリックしてマーカーを配置<br />
                            マウスドラッグ: 回転<br />
                            ホイール: ズーム<br />
                            右クリック+ドラッグ: 傾斜
                        </p>
                    </div>
                </div>

                {/* 右側: 情報表示エリア */}
                <div style={{
                    border: '1px solid rgba(184, 197, 214, 0.3)',
                    borderRadius: '4px',
                    height: '70vh',
                    width: '30%',
                    maxWidth: '300px',
                    background: 'rgba(26, 31, 58, 0.6)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    overflow: 'auto'
                }}>
                    {/* 写真表示エリア */}
                    <div style={{
                        border: '1px solid rgba(184, 197, 214, 0.2)',
                        borderRadius: '4px',
                        height: '200px',
                        background: 'rgba(42, 59, 90, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--star-white)',
                        fontSize: '0.9em'
                    }}>
                        {/* ここに写真を表示 */}
                        <p style={{ margin: 0, opacity: 0.7 }}>
                            写真がここに表示されます
                        </p>
                    </div>

                    {/* 選択座標情報 */}
                    {selectedLat !== null && selectedLon !== null && (
                        <div style={{
                            background: 'rgba(42, 59, 90, 0.4)',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid rgba(184, 197, 214, 0.2)'
                        }}>
                            <h4 style={{
                                margin: '0 0 10px 0',
                                color: 'var(--star-white)',
                                fontSize: '1em'
                            }}>
                                選択された座標
                            </h4>
                            <p style={{
                                margin: '0 0 5px 0',
                                fontSize: '0.85em',
                                color: 'var(--star-silver)'
                            }}>
                                緯度: {selectedLat.toFixed(4)}°
                            </p>
                            <p style={{
                                margin: '0',
                                fontSize: '0.85em',
                                color: 'var(--star-silver)'
                            }}>
                                経度: {selectedLon.toFixed(4)}°
                            </p>
                        </div>
                    )}

                    {/* 操作説明 */}
                    <div style={{
                        background: 'rgba(42, 59, 90, 0.4)',
                        padding: '15px',
                        borderRadius: '4px',
                        border: '1px solid rgba(184, 197, 214, 0.2)'
                    }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            color: 'var(--star-white)',
                            fontSize: '1em'
                        }}>
                            操作方法
                        </h4>
                        <p style={{
                            margin: '0 0 8px 0',
                            fontSize: '0.8em',
                            color: 'var(--star-silver)',
                            lineHeight: '1.4'
                        }}>
                            • 地図をクリックしてマーカーを配置
                        </p>
                        <p style={{
                            margin: '0 0 8px 0',
                            fontSize: '0.8em',
                            color: 'var(--star-silver)',
                            lineHeight: '1.4'
                        }}>
                            • マウスドラッグ: 回転
                        </p>
                        <p style={{
                            margin: '0',
                            fontSize: '0.8em',
                            color: 'var(--star-silver)',
                            lineHeight: '1.4'
                        }}>
                            • ホイール: ズーム
                        </p>
                    </div>
                </div>
            </div>

            {/* Submitボタン（画面下部に固定） */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000
            }}>
                <button
                    onClick={handleSubmit}
                    disabled={selectedLat === null || selectedLon === null}
                    style={{
                        padding: '15px 40px',
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
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    Submit Answer
                </button>
            </div >
        </>
    );
}
