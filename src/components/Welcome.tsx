import { commonStyles, theme } from '../styles/theme';

interface WelcomeProps {
    onStartGame: () => void;
}

export default function Welcome({ onStartGame }: WelcomeProps) {
    return (
        <div style={commonStyles.container}>
            <h1 style={{
                fontSize: '3em',
                fontWeight: '300',
                color: theme.colors.starWhite,
                marginBottom: theme.spacing.lg,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }}>
                CupolaQuest
            </h1>

            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <p style={{
                    fontSize: '1.2em',
                    color: theme.colors.starSilver,
                    marginBottom: theme.spacing.xl,
                    lineHeight: '1.6'
                }}>
                    ISSの展望モジュール「Cupola」から撮影された地球の写真を見て、
                    <br />
                    どこを撮影したのかを当てるゲームです。
                </p>

                <div style={{
                    background: `${theme.colors.spaceBlue}40`,
                    padding: theme.spacing.xl,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.shadows.border}`,
                    marginBottom: theme.spacing.xl
                }}>
                    <h3 style={{
                        fontSize: '1.1em',
                        color: theme.colors.starWhite,
                        marginBottom: theme.spacing.md
                    }}>
                        ゲームの流れ
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.sm,
                        textAlign: 'left'
                    }}>
                        <p style={{ color: theme.colors.starSilver, fontSize: '0.9em' }}>
                            1. Cupola窓をクリックしてゲーム開始
                        </p>
                        <p style={{ color: theme.colors.starSilver, fontSize: '0.9em' }}>
                            2. ISSから撮影された地球の写真を確認
                        </p>
                        <p style={{ color: theme.colors.starSilver, fontSize: '0.9em' }}>
                            3. 地図上で撮影場所を推測
                        </p>
                        <p style={{ color: theme.colors.starSilver, fontSize: '0.9em' }}>
                            4. 距離と回答時間でスコア計算
                        </p>
                    </div>
                </div>

                <button
                    onClick={onStartGame}
                    style={{
                        ...commonStyles.button,
                        padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
                        fontSize: '1.1em',
                        fontWeight: '500',
                        background: theme.colors.accentBlue,
                        border: `1px solid ${theme.colors.accentBlue}`,
                        minWidth: '200px'
                    }}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}
