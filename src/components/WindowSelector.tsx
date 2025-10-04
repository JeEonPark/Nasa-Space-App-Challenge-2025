import { theme } from '../styles/theme';

interface WindowSelectorProps {
    onWindowClick: () => void;
}

export default function WindowSelector({ onWindowClick }: WindowSelectorProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(/images/ui/waitingToStart-background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
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
                background: 'rgba(26, 31, 58, 0.4)',
                zIndex: 1
            }} />

            {/* ↓↓このコメントアウトは消さないでほしい */}
            {/* コンテンツ */}
            {/* <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                color: theme.colors.starWhite
            }}>
                <h1 style={{
                    fontSize: 'clamp(2em, 5vw, 4em)',
                    fontWeight: '700',
                    color: theme.colors.starWhite,
                    marginBottom: theme.spacing.lg,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                    Can you guess where this photo was taken?
                </h1>
            </div> */}

            {/* アプリアイコンパーツ */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                textAlign: 'center'
            }}>
                <img
                    src="/images/ui/app-icon-parts.png"
                    alt="CupolaQuest App Icon Parts"
                    style={{
                        width: '300px',
                        height: '300px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}
                />
            </div>

            {/* PLAYボタン */}
            <div
                onClick={onWindowClick}
                style={{
                    position: 'absolute',
                    top: '65%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 3,
                    cursor: 'pointer'
                }}
            >
                <img
                    src="/images/ui/guess-button.png"
                    alt="Play Button"
                    style={{
                        width: '300px',
                        height: '90px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}
                />
            </div>
        </div>
    );
}
