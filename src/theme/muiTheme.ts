import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define the theme configuration
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#667eea',
            light: '#8b9fee',
            dark: '#4a5fc7',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#764ba2',
            light: '#9772b8',
            dark: '#5a3881',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212529',
            secondary: '#6c757d',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 800,
            fontSize: '3rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 2px 8px rgba(0, 0, 0, 0.08)',
        '0 4px 16px rgba(0, 0, 0, 0.1)',
        '0 8px 32px rgba(0, 0, 0, 0.12)',
        '0 12px 40px rgba(0, 0, 0, 0.15)',
        '0 16px 48px rgba(0, 0, 0, 0.18)',
        '0 20px 60px rgba(0, 0, 0, 0.2)',
        '0 8px 32px rgba(102, 126, 234, 0.2)',
        '0 4px 20px rgba(0, 0, 0, 0.08)',
        '0 10px 40px rgba(0, 0, 0, 0.1)',
        '0 2px 10px rgba(0, 0, 0, 0.06)',
        '0 4px 15px rgba(102, 126, 234, 0.3)',
        '0 6px 20px rgba(102, 126, 234, 0.4)',
        '0 8px 25px rgba(102, 126, 234, 0.15)',
        '0 10px 35px rgba(30, 60, 114, 0.15)',
        '0 12px 40px rgba(102, 126, 234, 0.15)',
        '0 4px 15px rgba(239, 68, 68, 0.3)',
        '0 6px 20px rgba(239, 68, 68, 0.3)',
        '0 10px 30px rgba(0, 0, 0, 0.1)',
        '0 20px 60px rgba(0, 0, 0, 0.15)',
        '0 8px 24px rgba(0, 0, 0, 0.2)',
        '0 20px 60px rgba(0, 0, 0, 0.3)',
        '0 4px 30px rgba(0, 0, 0, 0.08)',
        '0 10px 40px rgba(0, 0, 0, 0.1)',
        '0 2px 20px rgba(0, 0, 0, 0.08)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    },
                },
                sizeLarge: {
                    padding: '14px 32px',
                    fontSize: '1.05rem',
                },
                sizeSmall: {
                    padding: '8px 20px',
                    fontSize: '0.9rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                            },
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                                borderWidth: 2,
                            },
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
                },
                elevation2: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                },
            },
        },
    },
};

// Create the theme
export const muiTheme = createTheme(themeOptions);
