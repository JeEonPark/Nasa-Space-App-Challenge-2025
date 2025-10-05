import { theme } from '../styles/theme';

interface WelcomeProps {
    onStartGame: () => void;
}

export default function Welcome({ onStartGame }: WelcomeProps) {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    return (
        <div
            onClick={onStartGame}
            style={{
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(/images/ui/welcome-background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            {/* オーバーレイ */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(26, 31, 58, 0.5)',
                zIndex: 1
            }} />

            {/* アプリアイコン */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                textAlign: 'center',
                width: isMobile ? '80vw' : '40vw',
                maxWidth: isMobile ? '520px' : '640px',
                minWidth: isMobile ? '280px' : '420px'
            }}>
                <img
                    src="/images/ui/app-icon.png"
                    alt="CupolaQuest App Icon"
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                        display: 'block',
                        margin: '0 auto'
                    }}
                />
                <p style={{
                    position: 'absolute',
                    top: '85%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: theme.colors.starWhite,
                    letterSpacing: '0.1em',
                    fontSize: 'clamp(1em, 2.5vw, 2.3em)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    opacity: 0.9,
                    zIndex: 3,
                    fontWeight: '500',
                    width: '100%'
                }}>
                    Tap to start
                </p>
            </div>
        </div>
    );
}
