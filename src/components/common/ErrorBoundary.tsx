import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { BugReport as BugIcon } from '@mui/icons-material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f9fafb',
                        p: { xs: 2, md: 5 },
                    }}
                >
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <BugIcon sx={{ fontSize: 72, color: 'error.main', mb: 3 }} />
                        <Typography variant="h3" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                            <Button variant="contained" size="large" onClick={this.handleReset}>
                                Go to Homepage
                            </Button>
                            <Button variant="outlined" size="large" onClick={() => window.location.reload()}>
                                Reload Page
                            </Button>
                        </Box>
                        {import.meta.env.DEV && this.state.error && (
                            <Box
                                sx={{
                                    mt: 4,
                                    p: 2,
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    textAlign: 'left',
                                    maxWidth: '100%',
                                    overflow: 'auto',
                                }}
                            >
                                <details style={{ whiteSpace: 'pre-wrap' }}>
                                    <summary><strong>Error Details (Development Only)</strong></summary>
                                    <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                                        <strong>Error:</strong> {this.state.error.toString()}
                                    </Typography>
                                    <Typography variant="caption" component="pre" sx={{ mt: 1, fontSize: 12, color: '#666' }}>
                                        {this.state.errorInfo?.componentStack}
                                    </Typography>
                                </details>
                            </Box>
                        )}
                    </Container>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
