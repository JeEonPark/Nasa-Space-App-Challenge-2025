import type { Question } from '../models';

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
                padding: '20px',
                background: 'rgba(10, 14, 39, 0.5)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
            }}>
                <img
                    src={`/iss_photos/${question.file}`}
                    alt={question.title}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '350px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                />
                <p style={{
                    fontSize: '1.1em',
                    margin: '15px 0 0 0',
                    color: 'var(--star-white)',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    {question.title}
                </p>
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

