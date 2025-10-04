import { theme } from '../styles/theme';

interface WelcomeProps {
    onStartGame: () => void;
}

export default function Welcome({ onStartGame }: WelcomeProps) {
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
            {/* アプリアイコン */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2
            }}>
                <img
                    src="/images/ui/app-icon.png"
                    alt="CupolaQuest App Icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}
                />
                <p style={{
                    position: 'absolute',
                    top: '85%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'theme.colors.starWhite',
                    fontSize: '3.0em',
                    opacity: 0.7,
                    zIndex: 3,
                    fontWeight: '500'
                }}>
                    Tap to start
                </p>
            </div>
        </div>
    );
}
