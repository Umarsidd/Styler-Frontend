import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { message } from 'antd';

interface ToastContextType {
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
    loading: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Configure message globally
message.config({
    top: 80,
    duration: 3,
    maxCount: 3,
});

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const success = useCallback((msg: string, duration = 3) => {
        return message.success(msg, duration);
    }, []);

    const error = useCallback((msg: string, duration = 3) => {
        return message.error(msg, duration);
    }, []);

    const warning = useCallback((msg: string, duration = 3) => {
        return message.warning(msg, duration);
    }, []);

    const info = useCallback((msg: string, duration = 3) => {
        return message.info(msg, duration);
    }, []);

    const loading = useCallback((msg: string) => {
        return message.loading(msg, 0);
    }, []);

    return (
        <ToastContext.Provider
            value={{
                success,
                error,
                warning,
                info,
                loading,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
