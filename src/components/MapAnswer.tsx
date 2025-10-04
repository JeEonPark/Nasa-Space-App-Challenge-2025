import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Question, UserAnswer } from '../models';

// 南北方向の境界を設定（-85°から85°）
const maxBounds = L.latLngBounds(
    L.latLng(-85, -180), // 南西の角
    L.latLng(85, 180)    // 北東の角
);

// Leafletのマーカーアイコンの設定
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 型定義の追加

interface MapAnswerProps {
    question: Question;
    onAnswerSubmit: (answer: UserAnswer) => void;
}

// 地図クリックイベントを処理するコンポーネント
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onMapClick(lat, lng);
        },
    });
    return null;
}

export default function MapAnswer({ onAnswerSubmit }: MapAnswerProps) {
    //　地図と同じ画面に、クイズの画像を表示するときにquestion.fileを使用
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLon, setSelectedLon] = useState<number | null>(null);

    const handleMapClick = useCallback((lat: number, lng: number) => {
        setSelectedLat(lat);
        setSelectedLon(lng);
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
            <h2>Locate on Earth</h2>

            {/* Leaflet地図 */}
            <div style={{
                border: '1px solid rgba(184, 197, 214, 0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
                minHeight: '350px',
                position: 'relative'
            }}>
                <MapContainer
                    center={[0, 0]}
                    zoom={2}
                    minZoom={2}
                    maxZoom={12}
                    style={{ height: '350px', width: '100%' }}
                    attributionControl={false}
                    zoomControl={false}
                    preferCanvas={false}
                    zoomDelta={1}
                    zoomSnap={1}
                    worldCopyJump={true}
                    maxBounds={maxBounds}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapClickHandler onMapClick={handleMapClick} />
                    <ZoomControl position="topright" />

                    {selectedLat !== null && selectedLon !== null && (
                        <Marker position={[selectedLat, selectedLon]}>
                            <Popup>
                                <div style={{
                                    padding: '8px',
                                    fontSize: '14px',
                                    color: '#333'
                                }}>
                                    <strong>選択された座標</strong><br />
                                    緯度: {selectedLat.toFixed(4)}°<br />
                                    経度: {selectedLon.toFixed(4)}°
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* 地図の上にオーバーレイ情報を表示 */}
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
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>地図操作</p>
                    <p style={{ margin: '0', fontSize: '0.8em', opacity: 0.8 }}>
                        クリックしてマーカーを配置<br />
                        ズーム: 2-12レベル<br />
                        東西移動: 自由<br />
                        南北移動: -85°〜85°
                    </p>
                    {selectedLat !== null && selectedLon !== null && (
                        <div style={{
                            marginTop: '10px',
                            padding: '8px',
                            background: 'rgba(42, 59, 90, 0.6)',
                            borderRadius: '4px',
                            border: '1px solid rgba(184, 197, 214, 0.2)'
                        }}>
                            <p style={{ margin: '0 0 5px 0', fontSize: '0.8em', fontWeight: 'bold' }}>
                                選択された座標
                            </p>
                            <p style={{ margin: '0', fontSize: '0.75em' }}>
                                緯度: {selectedLat.toFixed(4)}°
                            </p>
                            <p style={{ margin: '0', fontSize: '0.75em' }}>
                                経度: {selectedLon.toFixed(4)}°
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={selectedLat === null || selectedLon === null}
                style={{
                    padding: '15px 40px',
                    fontSize: '0.95em',
                    marginTop: '10px'
                }}
            >
                Submit Answer
            </button>
        </div>
    );
}
