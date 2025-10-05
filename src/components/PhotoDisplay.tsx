import { useState, useEffect } from 'react';
import type { Question } from '../models';

interface PhotoDisplayProps {
    question: Question;
    onPhotoClick: () => void;
}

export default function PhotoDisplay({ question, onPhotoClick }: PhotoDisplayProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadingDots, setLoadingDots] = useState('');

    // ローディングアニメーション
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots(prev => {
                if (prev === '') return '.';
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '';
            });
        }, 500); // 500msごとに更新

        return () => clearInterval(interval);
    }, []);

    // 画像読み込み完了時のハンドラー
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
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
            {/* メインコンテンツエリア (80vh) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                height: '80%'
            }}>
                {/* 画像表示エリア */}
                <div style={{
                    border: imageLoaded ? '1px solid rgba(184, 197, 214, 0.3)' : 'none',
                    padding: '30px',
                    background: imageLoaded ? 'rgba(10, 14, 39, 0.5)' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    height: '90%',
                    position: 'relative'
                }}>
                    {!imageLoaded && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'var(--star-white)',
                            fontSize: '1.5em',
                            fontWeight: '600',
                            textAlign: 'center',
                            zIndex: 10
                        }}>
                            Loading{loadingDots}
                        </div>
                    )}
                    <img
                        src={`/iss_photos/${question.file}`}
                        alt={question.title}
                        onLoad={handleImageLoad}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            minHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                        }}
                    />
                    {/* <p style={{
                        fontSize: '1.1em',
                        margin: '15px 0 0 0',
                        color: 'var(--star-white)',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        {question.title}
                    </p> */}
                </div>

                {/* ボタンエリア */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={onPhotoClick}
                        style={{
                            padding: '20px 40px',
                            fontSize: 'clamp(1em, 1.6vw, 1.2em)',
                            cursor: 'pointer'
                        }}
                    >
                        Guess the Location
                    </button>
                </div>
            </div>
        </div>
    );
}

