import React from 'react';
import toast from 'react-hot-toast';
import './Toast.css';

// This component is deprecated in favor of react-hot-toast
const Toast: React.FC = () => {
    return null;
};

export const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toastConfig = {
        duration: 3000,
    };

    switch (type) {
        case 'success':
            toast.success(msg, toastConfig);
            break;
        case 'error':
            toast.error(msg, toastConfig);
            break;
        case 'warning':
            toast(msg, { ...toastConfig, icon: '⚠️' });
            break;
        case 'info':
            toast(msg, { ...toastConfig, icon: 'ℹ️' });
            break;
    }
};

export default Toast;
