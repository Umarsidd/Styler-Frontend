import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Button, Select, DatePicker, Card, Empty } from 'antd';
import { EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import { AppointmentFilters } from '../../services/appointmentService';
import { formatDate, formatCurrency } from '../../utils/helpers';
import './MyAppointments.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const getStatusColor = (status: AppointmentStatus): string => {
    const colorMap: Record<AppointmentStatus, string> = {
        pending: 'orange',
        confirmed: 'blue',
        in_progress: 'cyan',
        completed: 'green',
        cancelled: 'red',
        no_show: 'volcano',
    };
    return colorMap[status] || 'default';
};

const MyAppointments: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<AppointmentFilters>({
        page: 1,
        limit: 10,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['my-appointments', filters],
        queryFn: () => appointmentService.getMyAppointments(filters),
    });

    const appointments = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    const columns: ColumnsType<Appointment> = [
        {
            title: 'Appointment #',
            dataIndex: 'appointmentNumber',
            key: 'appointmentNumber',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Date',
            dataIndex: 'scheduledDate',
            key: 'date',
            render: (date) => formatDate(date, 'long'),
        },
        {
            title: 'Time',
            dataIndex: 'scheduledTime',
            key: 'time',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: AppointmentStatus) => (
                <Tag color={getStatusColor(status)}>
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'amount',
            render: (amount) => formatCurrency(amount),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/customer/appointments/${record._id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    const handleStatusChange = (status: AppointmentStatus | 'all') => {
        setFilters({
            ...filters,
            status: status === 'all' ? undefined : status,
            page: 1,
        });
    };

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setFilters({
                ...filters,
                // Add date range to filters if backend supports it
                page: 1,
            });
        } else {
            const { ...rest } = filters;
            setFilters({ ...rest, page: 1 });
        }
    };

    return (
        <div className="my-appointments-page">
            <Card>
                <div className="page-header">
                    <div>
                        <h1>My Appointments</h1>
                        <p>View and manage all your appointments</p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<CalendarOutlined />}
                        onClick={() => navigate('/salons')}
                    >
                        Book New Appointment
                    </Button>
                </div>

                {/* Filters */}
                <div className="appointments-filters">
                    <Select
                        placeholder="Filter by status"
                        style={{ width: 200 }}
                        onChange={handleStatusChange}
                        allowClear
                    >
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="confirmed">Confirmed</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>

                    <RangePicker
                        onChange={handleDateRangeChange}
                        format="YYYY-MM-DD"
                        style={{ width: 300 }}
                    />
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
                        loading={isLoading}
                        rowKey="_id"
                        pagination={{
                            current: filters.page,
                            pageSize: filters.limit,
                            total: pagination?.total,
                            onChange: (page) => setFilters({ ...filters, page }),
                            showTotal: (total) => `Total ${total} appointments`,
                        }}
                    />
                )}
            </Card>
        </div>
    );
};

export default MyAppointments;
