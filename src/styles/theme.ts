/**
 * 宇宙テーマのカラーパレット
 */
export const theme = {
    colors: {
        spaceDark: '#0a0e27',
        spaceBlue: '#1a1f3a',
        spaceBlueLight: '#2a3b5a',
        starWhite: '#e8edf5',
        starSilver: '#b8c5d6',
        accentBlue: '#4a90e2',
    },

    spacing: {
        xs: '8px',
        sm: '12px',
        md: '20px',
        lg: '30px',
        xl: '40px',
        xxl: '60px',
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
    },

    shadows: {
        card: 'rgba(26, 31, 58, 0.4)',
        overlay: 'rgba(10, 14, 39, 0.5)',
        border: 'rgba(184, 197, 214, 0.2)',
        borderLight: 'rgba(184, 197, 214, 0.1)',
    }
} as const;

/**
 * 共通スタイル
 */
export const commonStyles = {
    container: {
        border: `1px solid ${theme.shadows.border}`,
        padding: `${theme.spacing.xl} ${theme.spacing.xl}`,
        textAlign: 'center' as const,
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        gap: theme.spacing.lg,
        background: theme.shadows.card,
        borderRadius: theme.borderRadius.md,
    },

    button: {
        border: `1px solid ${theme.colors.spaceBlueLight}`,
        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
        fontSize: '0.95em',
        fontWeight: '400',
        background: theme.colors.spaceBlue,
        color: theme.colors.starWhite,
        cursor: 'pointer',
        borderRadius: theme.borderRadius.sm,
        transition: 'all 0.3s ease',
    },

    card: {
        border: `1px solid ${theme.shadows.border}`,
        padding: `${theme.spacing.xl} ${theme.spacing.xl}`,
        background: theme.shadows.overlay,
        borderRadius: theme.borderRadius.sm,
    },

    title: {
        fontSize: '1.5em',
        fontWeight: '300',
        color: theme.colors.starSilver,
        marginBottom: '1rem',
    },

    subtitle: {
        fontSize: '0.85em',
        color: theme.colors.starSilver,
        opacity: 0.7,
    }
} as const;
