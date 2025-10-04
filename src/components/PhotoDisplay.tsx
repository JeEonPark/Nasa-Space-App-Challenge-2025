import type { Question } from '../types';

interface PhotoDisplayProps {
    question: Question;
    onPhotoClick: () => void;
}

export default function PhotoDisplay({ question, onPhotoClick }: PhotoDisplayProps) {
    return (
        <div style={{
            border: '1px solid rgba(184, 197, 214, 0.2)',
            padding: '40px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '30px',
            background: 'rgba(26, 31, 58, 0.4)',
            borderRadius: '8px'
        }}>
            <h2>ISS Photograph</h2>
            <div style={{
                border: '1px solid rgba(184, 197, 214, 0.3)',
                padding: '80px 40px',
                background: 'rgba(10, 14, 39, 0.5)',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
            }}>
                <div>
                    <p style={{
                        fontSize: '1.2em',
                        margin: '20px 0',
                        color: 'var(--star-white)'
                    }}>
                        {question.title}
                    </p>
                    <p style={{
                        color: 'var(--star-silver)',
                        fontSize: '0.85em',
                        marginTop: '30px',
                        opacity: 0.5
                    }}>
                        Image placeholder
                    </p>
                </div>
            </div>

            <button
                onClick={onPhotoClick}
                style={{
                    padding: '15px 40px',
                    fontSize: '0.95em',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Locate on Map
            </button>
        </div>
    );
}

