import { useState } from 'react';
import type { Question, UserAnswer } from '../models';

interface MapAnswerProps {
    question: Question;
    onAnswerSubmit: (answer: UserAnswer) => void;
}

export default function MapAnswer({ question, onAnswerSubmit }: MapAnswerProps) {
    //　地図と同じ画面に、クイズの画像を表示するときにquestion.fileを使用
    const [selectedLat, setSelectedLat] = useState<number | null>(null);
    const [selectedLon, setSelectedLon] = useState<number | null>(null);

    const handleMapClick = () => {
        // ダミーの座標（実際は地図のクリックイベントから取得）
        const dummyLat = Math.random() * 180 - 90;
        const dummyLon = Math.random() * 360 - 180;
        setSelectedLat(dummyLat);
        setSelectedLon(dummyLon);
    };

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

            {/* 地図プレースホルダー */}
            <div
                onClick={handleMapClick}
                style={{
                    border: '1px solid rgba(184, 197, 214, 0.3)',
                    padding: '80px 40px',
                    background: 'rgba(10, 14, 39, 0.5)',
                    minHeight: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                }}
            >
                <p style={{
                    fontSize: '1.1em',
                    marginBottom: '15px',
                    color: 'var(--star-white)'
                }}>
                    Map Interface
                </p>
                <p style={{
                    color: 'var(--star-silver)',
                    fontSize: '0.85em',
                    opacity: 0.7
                }}>
                    Click to place marker
                </p>
                {selectedLat !== null && selectedLon !== null && (
                    <div style={{
                        marginTop: '30px',
                        padding: '15px 20px',
                        background: 'rgba(42, 59, 90, 0.6)',
                        borderRadius: '4px',
                        border: '1px solid rgba(184, 197, 214, 0.2)'
                    }}>
                        <p style={{ fontSize: '0.9em', marginBottom: '8px' }}>Selected coordinates</p>
                        <p style={{ fontSize: '0.85em' }}>Lat: {selectedLat.toFixed(2)}°</p>
                        <p style={{ fontSize: '0.85em' }}>Lon: {selectedLon.toFixed(2)}°</p>
                    </div>
                )}
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
