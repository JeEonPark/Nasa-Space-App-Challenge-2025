interface WindowSelectorProps {
    onWindowClick: () => void;
}

export default function WindowSelector({ onWindowClick }: WindowSelectorProps) {
    return (
        <div style={{
            border: '1px solid rgba(184, 197, 214, 0.2)',
            padding: '60px 40px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '40px',
            background: 'rgba(26, 31, 58, 0.4)',
            borderRadius: '8px'
        }}>
            <h2>Select Window</h2>

            {/* 窓のレイアウト */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
            }}>
                <button
                    onClick={onWindowClick}
                    style={{
                        width: '200px',
                        height: '200px',
                        border: '1px solid var(--space-blue-light)',
                        background: 'rgba(42, 59, 90, 0.5)',
                        cursor: 'pointer',
                        fontSize: '24px',
                        color: 'var(--star-silver)',
                        fontWeight: '300',
                        borderRadius: '8px'
                    }}
                >
                    Cupola Window
                </button>
            </div>

            <p style={{
                color: 'var(--star-silver)',
                fontSize: '0.85em',
                opacity: 0.7,
                marginTop: '10px'
            }}>
                Click a window to begin
            </p>
        </div>
    );
}

