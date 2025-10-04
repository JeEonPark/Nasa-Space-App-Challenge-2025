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
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '20px'
            }}>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                        key={num}
                        onClick={onWindowClick}
                        style={{
                            width: '90px',
                            height: '90px',
                            border: '1px solid var(--space-blue-light)',
                            background: 'rgba(42, 59, 90, 0.5)',
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: 'var(--star-silver)',
                            fontWeight: '300'
                        }}
                    >
                        {num}
                    </button>
                ))}
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

