import React from 'react';
import { Form, Input, Button, Card, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import './Profile.css';

const Profile: React.FC = () => {
    const user = useAuthStore((state) => state.user);

    const handleSubmit = (values: any) => {
        console.log('Profile update:', values);
        // TODO: Implement profile update
    };

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <div className="profile-header">
                    <Avatar size={100} icon={<UserOutlined />} />
                    <h1>{user?.name}</h1>
                    <p>{user?.email}</p>
                </div>

                <Form
                    layout="vertical"
                    initialValues={{
                        name: user?.name,
                        email: user?.email,
                        phone: user?.phone,
                    }}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Name" name="name">
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
