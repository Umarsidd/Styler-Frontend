import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Calendar, TimePicker, Button, Switch, Row, Col, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { barberService } from '../../services/barberService';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [isAvailable, setIsAvailable] = useState(true);
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().hour(9).minute(0));
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().hour(18).minute(0));

    const { data: availabilityData } = useQuery({
        queryKey: ['barber-availability'],
        queryFn: () => barberService.getAvailability(),
    });

    const updateAvailabilityMutation = useMutation({
        mutationFn: (data: {
            date: string;
            isAvailable: boolean;
            startTime?: string;
            endTime?: string;
        }) => barberService.updateAvailability(data),
        onSuccess: () => {
            message.success('Availability updated successfully');
            queryClient.invalidateQueries({ queryKey: ['barber-availability'] });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update availability');
        },
    });

    const handleSave = () => {
        if (isAvailable && (!startTime || !endTime)) {
            message.warning('Please select start and end times');
            return;
        }

        if (isAvailable && startTime && endTime && endTime.isBefore(startTime)) {
            message.error('End time must be after start time');
            return;
        }

        updateAvailabilityMutation.mutate({
            date: selectedDate.format('YYYY-MM-DD'),
            isAvailable,
            startTime: isAvailable && startTime ? startTime.format('HH:mm') : undefined,
            endTime: isAvailable && endTime ? endTime.format('HH:mm') : undefined,
        });
    };

    const onDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
    };

    return (
        <div className="availability-management">
            <div className="page-header">
                <h1>Manage Your Availability</h1>
                <p>Set your working hours and days off</p>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Select Date">
                        <Calendar
                            fullscreen={false}
                            value={selectedDate}
                            onSelect={onDateSelect}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={`Availability for ${selectedDate.format('MMM DD, YYYY')}`}>
                        <div className="availability-form">
                            <div className="form-item">
                                <label>Available on this day:</label>
                                <Switch
                                    checked={isAvailable}
                                    onChange={setIsAvailable}
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                />
                            </div>

                            {isAvailable && (
                                <>
                                    <div className="form-item">
                                        <label>
                                            <ClockCircleOutlined /> Start Time:
                                        </label>
                                        <TimePicker
                                            value={startTime}
                                            onChange={setStartTime}
                                            format="HH:mm"
                                            minuteStep={30}
                                            size="large"
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div className="form-item">
                                        <label>
                                            <ClockCircleOutlined /> End Time:
                                        </label>
                                        <TimePicker
                                            value={endTime}
                                            onChange={setEndTime}
                                            format="HH:mm"
                                            minuteStep={30}
                                            size="large"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </>
                            )}

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleSave}
                                loading={updateAvailabilityMutation.isPending}
                            >
                                Save Availability
                            </Button>
                        </div>
                    </Card>

                    <Card title="Your Weekly Schedule" style={{ marginTop: 24 }}>
                        <div className="weekly-schedule">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                                (day) => (
                                    <div key={day} className="schedule-day">
                                        <span className="day-name">{day}</span>
                                        <span className="day-hours">9:00 AM - 6:00 PM</span>
                                    </div>
                                )
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AvailabilityManagement;
