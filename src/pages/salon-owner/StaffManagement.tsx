import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Tabs, Table, Button, Tag, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { barberService } from '../../services/barberService';
import { Barber, BarberStatus } from '../../types';
import './StaffManagement.css';

const { TabPane } = Tabs;

const StaffManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const { data: pendingData, isLoading: loadingPending } = useQuery({
        queryKey: ['pending-barbers'],
        queryFn: () => barberService.getPendingBarbers(),
    });

    const { data: approvedData, isLoading: loadingApproved } = useQuery({
        queryKey: ['approved-barbers'],
        queryFn: () => barberService.getApprovedBarbers(),
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => barberService.approveBarber(id),
        onSuccess: () => {
            message.success('Barber approved successfully');
            queryClient.invalidateQueries({ queryKey: ['pending-barbers'] });
            queryClient.invalidateQueries({ queryKey: ['approved-barbers'] });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to approve barber');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => barberService.rejectBarber(id),
        onSuccess: () => {
            message.success('Barber rejected');
            queryClient.invalidateQueries({ queryKey: ['pending-barbers'] });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to reject barber');
        },
    });

    const pendingBarbers = (pendingData?.data as Barber[]) || [];
    const approvedBarbers = (approvedData?.data as Barber[]) || [];

    const handleViewDetails = (barber: Barber) => {
        setSelectedBarber(barber);
        setDetailsModalVisible(true);
    };

    const handleApprove = (id: string) => {
        Modal.confirm({
            title: 'Approve Barber',
            content: 'Are you sure you want to approve this barber?',
            onOk: () => approveMutation.mutate(id),
        });
    };

    const handleReject = (id: string) => {
        Modal.confirm({
            title: 'Reject Barber',
            content: 'Are you sure you want to reject this barber application?',
            okType: 'danger',
            onOk: () => rejectMutation.mutate(id),
        });
    };

    const pendingColumns: ColumnsType<Barber> = [
        {
            title: 'Barber',
            dataIndex: 'userId',
            key: 'name',
            render: (userId) => userId || 'N/A',
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
            render: (specialties: string[]) => specialties.join(', '),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => handleApprove(record._id)}
                        loading={approveMutation.isPending}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => handleReject(record._id)}
                        loading={rejectMutation.isPending}
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const approvedColumns: ColumnsType<Barber> = [
        {
            title: 'Barber',
            dataIndex: 'userId',
            key: 'name',
            render: (userId) => <strong>{userId || 'N/A'}</strong>,
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
            render: (specialties: string[]) => specialties.join(', '),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: BarberStatus) => (
                <Tag color={status === 'approved' ? 'green' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="staff-management">
            <div className="page-header">
                <h1>Staff Management</h1>
                <p>Manage your salon's barbers and staff</p>
            </div>

            <Card>
                <Tabs defaultActiveKey="pending">
                    <TabPane tab={`Pending Approval (${pendingBarbers.length})`} key="pending">
                        <Table
                            columns={pendingColumns}
                            dataSource={pendingBarbers}
                            loading={loadingPending}
                            rowKey="_id"
                        />
                    </TabPane>
                    <TabPane tab={`Approved Staff (${approvedBarbers.length})`} key="approved">
                        <Table
                            columns={approvedColumns}
                            dataSource={approvedBarbers}
                            loading={loadingApproved}
                            rowKey="_id"
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {/* Details Modal */}
            <Modal
                title="Barber Details"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedBarber && (
                    <div className="barber-details">
                        <p><strong>Name:</strong> {selectedBarber.userId || 'N/A'}</p>
                        <p><strong>Experience:</strong> {selectedBarber.experience} years</p>
                        <p><strong>Specialties:</strong> {selectedBarber.specialties.join(', ')}</p>
                        {selectedBarber.bio && <p><strong>Bio:</strong> {selectedBarber.bio}</p>}
                        {selectedBarber.certifications && selectedBarber.certifications.length > 0 && (
                            <p><strong>Certifications:</strong> {selectedBarber.certifications.join(', ')}</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StaffManagement;
