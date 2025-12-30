import { useQuery } from '@tanstack/react-query';
import { Card, Table, Button, Tag, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { barberService } from '../../services/barberService';
import { useState } from 'react';
import './StaffManagement.css';

const StaffManagement = () => {
    const [searchText, setSearchText] = useState('');

    // Fetch pending barbers
    const { data: pendingData, refetch: refetchPending } = useQuery({
        queryKey: ['pending-barbers'],
        queryFn: () => barberService.getPendingBarbers(),
    });

    // Fetch approved barbers
    const { data: approvedData, refetch: refetchApproved } = useQuery({
        queryKey: ['approved-barbers'],
        queryFn: () => barberService.getApprovedBarbers(),
    });

    const pendingBarbers = pendingData?.data || [];
    const approvedBarbers = approvedData?.data || [];

    const handleApprove = async (barberId) => {
        try {
            await barberService.approveBarber(barberId);
            message.success('Barber approved successfully');
            refetchPending();
            refetchApproved();
        } catch (error) {
            message.error('Failed to approve barber');
        }
    };

    const handleReject = async (barberId) => {
        try {
            await barberService.rejectBarber(barberId);
            message.success('Barber application rejected');
            refetchPending();
        } catch (error) {
            message.error('Failed to reject barber');
        }
    };

    const pendingColumns = [
        {
            title: 'Name',
            dataIndex: ['userId', 'name'],
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: ['userId', 'phone'],
            key: 'phone',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            render: (exp) => `${exp} years`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => handleApprove(record._id)}
                        style={{ marginRight: 8 }}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => handleReject(record._id)}
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const approvedColumns = [
        {
            title: 'Name',
            dataIndex: ['userId', 'name'],
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],
            key: 'email',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            render: (exp) => `${exp} years`,
        },
        {
            title: 'Specialties',
            dataIndex: 'specialties',
            key: 'specialties',
            render: (specialties) => specialties?.join(', ') || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'verificationStatus',
            key: 'status',
            render: (status) => (
                <Tag color="green">APPROVED</Tag>
            ),
        },
    ];

    return (
        <div className="staff-management">
            <div className="page-header">
                <h1>Staff Management</h1>
            </div>

            {/* Pending Approvals */}
            <Card title="Pending Approvals" className="staff-card">
                <Table
                    columns={pendingColumns}
                    dataSource={pendingBarbers}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            {/* Approved Staff */}
            <Card title="Approved Staff" className="staff-card" style={{ marginTop: 24 }}>
                <Input
                    placeholder="Search by name or email"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: 16, maxWidth: 400 }}
                />
                <Table
                    columns={approvedColumns}
                    dataSource={approvedBarbers.filter(barber =>
                        barber.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        barber.userId?.email?.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default StaffManagement;
