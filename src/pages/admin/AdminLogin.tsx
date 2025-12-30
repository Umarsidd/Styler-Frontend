import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            // TODO: Implement admin login logic
            console.log('Admin login:', values);
            toast.success('Login successful');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error('Login failed');
        }
    };

    return (
        <div className="admin-login-page">
            <Card className="admin-login-card" title="Admin Login">
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="admin@styler.com" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AdminLogin;
