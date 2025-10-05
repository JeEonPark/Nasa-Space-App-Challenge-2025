import type { Question } from '../models';

interface PhotoDisplayProps {
    question: Question;
    onPhotoClick: () => void;
}

export default function PhotoDisplay({ question, onPhotoClick }: PhotoDisplayProps) {
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
            <div style={{
                border: '1px solid rgba(184, 197, 214, 0.3)',
                padding: '30px',
                background: 'rgba(10, 14, 39, 0.5)',
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
                        maxHeight: '600px',
                        minHeight: '600px',
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

            <button
                onClick={onPhotoClick}
                style={{
                    padding: '20px 40px',
                    fontSize: 'clamp(1em, 1.6vw, 1.2em)',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Guess the Location
            </button>
        </div>
    );
}

