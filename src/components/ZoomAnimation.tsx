import { useEffect } from 'react';

interface ZoomAnimationProps {
    onAnimationComplete: () => void;
}

export default function ZoomAnimation({ onAnimationComplete }: ZoomAnimationProps) {
    useEffect(() => {
        // 2秒後に次の画面へ遷移（実際のアニメーションは後で実装）
        const timer = setTimeout(() => {
            onAnimationComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <div style={{
            border: '1px solid rgba(184, 197, 214, 0.1)',
            padding: '60px 40px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'rgba(10, 14, 39, 0.8)',
            borderRadius: '8px'
        }}>
            <h2 style={{ marginBottom: '60px' }}>Zooming...</h2>
            <div style={{
                fontSize: '48px',
                margin: '40px 0',
                color: 'var(--star-silver)',
                opacity: 0.5,
                animation: 'pulse 1.5s ease-in-out infinite'
            }}>
                ···
            </div>
        </div>
    );
}

