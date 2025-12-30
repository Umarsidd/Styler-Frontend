import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { muiTheme } from './theme/muiTheme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'react-hot-toast';
import { useUIStore } from './stores/uiStore';

const AppWrapper = () => {
    const theme = useUIStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={muiTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    <AppWrapper />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#4ade80',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);
