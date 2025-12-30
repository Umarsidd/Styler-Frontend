import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, Typography, Card, Radio } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    LoginOutlined,
    UserAddOutlined,
    ScissorOutlined,
    ShopOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import './Login.css';

const { Title, Text, Paragraph } = Typography;
const MotionDiv = motion.div;

interface LoginFormValues {
    email: string;
    password: string;
}

interface RegisterFormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface LoginProps {
    isRegisterMode?: boolean;
}

const Login: React.FC<LoginProps> = ({ isRegisterMode = false }) => {
    const [activeTab, setActiveTab] = useState(isRegisterMode ? 'signup' : 'login');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

    const [loginForm] = Form.useForm<LoginFormValues>();
    const [signupForm] = Form.useForm<RegisterFormValues>();

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const onLoginSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const response = await authService.login({
                emailOrPhone: values.email,
                password: values.password,
            });

            if (response.success && response.data) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Login successful! Welcome back.');

                // Redirect based on user role
                switch (user.role) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.SUPER_ADMIN:
                        setTimeout(() => navigate('/admin/superadmin'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
                }
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message ||
                err.response?.data?.message ||
                'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onSignupSubmit = async (values: RegisterFormValues) => {
        setLoading(true);
        try {
            const response = await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                role: selectedRole,
            });

            if (response.success && response.data && response.data.tokens) {
                const { user, tokens } = response.data;
                setAuth(user, tokens.accessToken, tokens.refreshToken);
                toast.success('Account created successfully! Welcome aboard.');

                // Redirect based on selected role
                switch (selectedRole) {
                    case UserRole.BARBER:
                        setTimeout(() => navigate('/barber/dashboard'), 500);
                        break;
                    case UserRole.SALON_OWNER:
                        setTimeout(() => navigate('/salon-owner/dashboard'), 500);
                        break;
                    case UserRole.CUSTOMER:
                    default:
                        setTimeout(() => navigate('/customer/dashboard'), 500);
                }
            } else {
                setActiveTab('login');
                toast.success('Registration successful! Please login.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error?.message ||
                err.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        {
            value: UserRole.CUSTOMER,
            icon: <CalendarOutlined />,
            label: 'Customer',
            description: 'Book appointments and manage visits'
        },
        {
            value: UserRole.BARBER,
            icon: <ScissorOutlined />,
            label: 'Barber / Stylist',
            description: 'Manage schedule and appointments'
        },
        {
            value: UserRole.SALON_OWNER,
            icon: <ShopOutlined />,
            label: 'Salon Owner',
            description: 'Manage your salon and team'
        }
    ];

    const tabItems = [
        {
            key: 'login',
            label: (
                <span className="tab-label">
                    <LoginOutlined /> Login
                </span>
            ),
            children: (
                <Form form={loginForm} onFinish={onLoginSubmit} layout="vertical" size="large">
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<LoginOutlined />}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'signup',
            label: (
                <span className="tab-label">
                    <UserAddOutlined /> Sign Up
                </span>
            ),
            children: (
                <Form form={signupForm} onFinish={onSignupSubmit} layout="vertical" size="large">
                    {/* Role Selection */}
                    <Form.Item label={<span className="role-selection-label">I am a:</span>}>
                        <Radio.Group
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="role-radio-group"
                        >
                            {roleOptions.map(option => (
                                <Radio.Button
                                    key={option.value}
                                    value={option.value}
                                    className="role-radio-button"
                                >
                                    <div className="role-option-content">
                                        <span className="role-icon">{option.icon}</span>
                                        <div className="role-text">
                                            <strong>{option.label}</strong>
                                            <small>{option.description}</small>
                                        </div>
                                    </div>
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter your phone number' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" maxLength={10} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<UserAddOutlined />}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className="login-page-modern">
            <div className="login-bg-pattern" />
            <div className="login-container-modern">
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="login-content"
                >
                    {/* Logo/Brand */}
                    <div className="login-brand">
                        <ScissorOutlined className="brand-icon" />
                        <Title level={2} className="brand-title">STYLER</Title>
                        <Text className="brand-subtitle">Premium Grooming Services</Text>
                    </div>

                    {/* Auth Card */}
                    <Card className="auth-card-modern" bordered={false}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            centered
                            className="auth-tabs"
                        />
                    </Card>

                    {/* Footer Text */}
                    <Paragraph className="login-footer-text">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Paragraph>
                </MotionDiv>
            </div>
        </div>
    );
};

export default Login;
