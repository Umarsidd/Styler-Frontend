import React, { createContext, useContext, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface ToastContextType {
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
    loading: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const success = (msg: string, duration = 3) => {
        return toast.success(msg, { duration: duration * 1000 });
    };

    const error = (msg: string, duration = 3) => {
        return toast.error(msg, { duration: duration * 1000 });
    };

    const warning = (msg: string, duration = 3) => {
        return toast(msg, { duration: duration * 1000, icon: '⚠️' });
    };

    const info = (msg: string, duration = 3) => {
        return toast(msg, { duration: duration * 1000, icon: 'ℹ️' });
    };

    const loading = (msg: string) => {
        return toast.loading(msg);
    };

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
