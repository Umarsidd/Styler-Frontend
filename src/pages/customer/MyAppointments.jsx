import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Table, Tag, Button, Select, DatePicker, Space, Card, Empty, Input
} from 'antd';
import { EyeOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import dayjs from 'dayjs';
import './MyAppointments.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MyAppointments = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        status: '',
        page: 1,
        limit: 10,
    });

    // Fetch appointments
    const { data, isLoading } = useQuery({
        queryKey: ['my-appointments', filters],
        queryFn: () => appointmentService.getMyAppointments(filters),
        keepPreviousData: true,
    });

    const appointments = data?.data?.data || [];
    const pagination = data?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            confirmed: 'blue',
            'in-progress': 'cyan',
            completed: 'green',
            cancelled: 'red',
            'no-show': 'gray',
        };
        return colors[status] || 'default';
    };

    const columns = [
        {
            title: 'Appointment ID',
            dataIndex: '_id',
            key: 'id',
            render: (id) => `#${id.slice(-8)}`,
            width: 120,
        },
        {
            title: 'Salon',
            dataIndex: ['salonId', 'name'],
            key: 'salon',
            render: (name) => name || 'N/A',
        },
        {
            title: 'Date',
            dataIndex: 'scheduledDate',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            sorter: (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate),
        },
        {
            title: 'Time',
            dataIndex: 'scheduledTime',
            key: 'time',
        },
        {
            title: 'Services',
            dataIndex: 'services',
            key: 'services',
            render: (services) => services?.length || 0,
            width: 100,
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'amount',
            render: (amount) => `₹${amount}`,
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Confirmed', value: 'confirmed' },
                { text: 'In Progress', value: 'in-progress' },
                { text: 'Completed', value: 'completed' },
                { text: 'Cancelled', value: 'cancelled' },
                { text: 'No Show', value: 'no-show' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/customer/appointments/${record._id}`)}
                    >
                        View
                    </Button>
                    {(record.status === 'pending' || record.status === 'confirmed') && (
                        <Button
                            type="link"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancel(record._id)}
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleCancel = async (appointmentId) => {
        // Navigate to appointment details where cancel can be confirmed
        navigate(`/customer/appointments/${appointmentId}?action=cancel`);
    };

    const handleStatusFilterChange = (value) => {
        setFilters(prev => ({ ...prev, status: value, page: 1 }));
    };

    const handleTableChange = (pagination) => {
        setFilters(prev => ({ ...prev, page: pagination.current }));
    };

    return (
        <div className="my-appointments-page">
            <div className="appointments-header">
                <h1>My Appointments</h1>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate('/salons')}
                >
                    Book New Appointment
                </Button>
            </div>

            <Card className="appointments-card">
                {/* Filters */}
                <div className="appointments-filters">
                    <Space wrap>
                        <Select
                            placeholder="Filter by Status"
                            allowClear
                            style={{ width: 200 }}
                            onChange={handleStatusFilterChange}
                            value={filters.status || undefined}
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="confirmed">Confirmed</Option>
                            <Option value="in-progress">In Progress</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                            <Option value="no-show">No Show</Option>
                        </Select>
                    </Space>
                </div>

                {/* Table */}
                {appointments.length === 0 && !isLoading ? (
                    <Empty
                        description="No appointments found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={() => navigate('/salons')}>
                            Book Your First Appointment
                        </Button>
                    </Empty>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={appointments}
                        rowKey="_id"
                        loading={isLoading}
                        pagination={{
                            current: pagination.page,
                            total: pagination.total,
                            pageSize: filters.limit,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} appointments`,
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1000 }}
                    />
                )}
            </Card>
        </div>
    );
};

export default MyAppointments;
