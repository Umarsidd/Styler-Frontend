import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Result
                status="403"
                icon={<LockOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                title="403 — Unauthorized Access"
                subTitle="Sorry, you don't have permission to access this page."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Go Home
                    </Button>
                }
            />
        </div>
    );
};

export default Unauthorized;
