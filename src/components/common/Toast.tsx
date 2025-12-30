import React from 'react';
import { message } from 'antd';
import './Toast.css';

// This component is deprecated in favor of react-hot-toast
// Keeping for backward compatibility
const Toast: React.FC = () => {
    return null;
};

export const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    message[type](msg);
};

export default Toast;
