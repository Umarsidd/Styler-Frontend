import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    Styler
                </Link>

                <div className="navbar-links">
                    <Link to="/salons">Find Salons</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/about">About</Link>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Avatar
                                icon={<UserOutlined />}
                                style={{ cursor: 'pointer', backgroundColor: '#f59e0b' }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Dropdown>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')}>Login</Button>
                            <Button type="primary" onClick={() => navigate('/login')}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
