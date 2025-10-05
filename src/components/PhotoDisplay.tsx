import { useState, useEffect } from 'react';
import type { Question } from '../models';

interface PhotoDisplayProps {
    question: Question;
    onPhotoClick: () => void;
}

export default function PhotoDisplay({ question, onPhotoClick }: PhotoDisplayProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadingDots, setLoadingDots] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Loading animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots(prev => {
                if (prev === '') return '.';
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Load and rotate image if needed
    useEffect(() => {
        setImageLoaded(false);
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
            setImageLoaded(true);
        };
    }, [question.file]);

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
                <>
                    {!imageLoaded && (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                color: 'var(--star-white)',
                                fontSize: '1.5em',
                                fontWeight: '600',
                                textAlign: 'center',
                                zIndex: 10
                            }}>
                                Loading{loadingDots}
                            </div>
                        </div>
                    )}
                    {imageSrc && (
                        <div style={{
                            border: isMobile ? 'none' : '1px solid rgba(184, 197, 214, 0.3)',
                            padding: isMobile ? '0' : '30px',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            position: 'relative',
                            width: 'fit-content',
                            height: 'fit-content',
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}>
                            <img
                                src={imageSrc}
                                alt={question.title}
                                style={{
                                    maxWidth: 'calc(100vw - 100px)',
                                    maxHeight: isMobile ? '50vh' : 'calc(80vh - 200px)',
                                    minWidth: 'calc(100vw - 100px)',
                                    minHeight: isMobile ? '40vh' : 'calc(80vh - 200px)',
                                    objectFit: 'contain',
                                    display: 'block',
                                    borderRadius: '4px',
                                    boxShadow: 'none'
                                }}
                            />
                        </div>
                    )}
                </>

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

