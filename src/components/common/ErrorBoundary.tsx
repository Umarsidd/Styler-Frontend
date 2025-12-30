import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { BugOutlined } from '@ant-design/icons';

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

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true, error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f9fafb',
                        padding: '40px 20px',
                    }}
                >
                    <Result
                        status="error"
                        icon={<BugOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                        title="Oops! Something went wrong"
                        subTitle="We're sorry for the inconvenience. Please try refreshing the page."
                        extra={[
                            <Button type="primary" size="large" key="home" onClick={this.handleReset}>
                                Go to Homepage
                            </Button>,
                            <Button size="large" key="reload" onClick={() => window.location.reload()}>
                                Reload Page
                            </Button>,
                        ]}
                    >
                        {import.meta.env.DEV && this.state.error && (
                            <div
                                style={{
                                    marginTop: 24,
                                    padding: 16,
                                    background: '#fff',
                                    borderRadius: 8,
                                    textAlign: 'left',
                                }}
                            >
                                <details style={{ whiteSpace: 'pre-wrap' }}>
                                    <summary>Error Details (Development Only)</summary>
                                    <p>
                                        <strong>Error:</strong> {this.state.error.toString()}
                                    </p>
                                    <p>
                                        <strong>Stack:</strong>
                                    </p>
                                    <pre style={{ fontSize: 12, color: '#666' }}>
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </Result>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
