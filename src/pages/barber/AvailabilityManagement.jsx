import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Calendar, Badge, Button, Modal, TimePicker, message, Switch } from 'antd';
import { barberService } from '../../services/barberService';
import dayjs from 'dayjs';
import './AvailabilityManagement.css';

const AvailabilityManagement = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [modalVisible, setModalVisible] = useState(false);
    const [dayAvailability, setDayAvailability] = useState({
        isAvailable: true,
        startTime: '09:00',
        endTime: '18:00',
    });

    // Fetch availability data
    const { data: availabilityData, refetch } = useQuery({
        queryKey: ['barber-availability'],
        queryFn: () => barberService.getAvailability(),
    });

    const availability = availabilityData?.data || {};

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setModalVisible(true);

        // Load existing availability for this date
        const dateStr = date.format('YYYY-MM-DD');
        const existing = availability[dateStr];
        if (existing) {
            setDayAvailability(existing);
        } else {
            setDayAvailability({
                isAvailable: true,
                startTime: '09:00',
                endTime: '18:00',
            });
        }
    };

    const handleSaveAvailability = async () => {
        try {
            await barberService.updateAvailability({
                date: selectedDate.format('YYYY-MM-DD'),
                ...dayAvailability,
            });
            message.success('Availability updated successfully');
            setModalVisible(false);
            refetch();
        } catch (error) {
            message.error('Failed to update availability');
        }
    };

    const dateCellRender = (date) => {
        const dateStr = date.format('YYYY-MM-DD');
        const dayData = availability[dateStr];

        if (!dayData) return null;

        return (
            <div className="availability-badge">
                {dayData.isAvailable ? (
                    <Badge status="success" text={`${dayData.startTime} - ${dayData.endTime}`} />
                ) : (
                    <Badge status="error" text="Unavailable" />
                )}
            </div>
        );
    };

    return (
        <div className="availability-management">
            <div className="page-header">
                <h1>Manage Availability</h1>
                <p>Click on any date to set your working hours</p>
            </div>

            <Card className="calendar-card">
                <Calendar
                    onSelect={handleDateSelect}
                    dateCellRender={dateCellRender}
                />
            </Card>

            <Modal
                title={`Availability for ${selectedDate.format('DD MMM YYYY')}`}
                open={modalVisible}
                onOk={handleSaveAvailability}
                onCancel={() => setModalVisible(false)}
                okText="Save"
            >
                <div className="availability-form">
                    <div className="form-item">
                        <label>Available on this day:</label>
                        <Switch
                            checked={dayAvailability.isAvailable}
                            onChange={(checked) => setDayAvailability({ ...dayAvailability, isAvailable: checked })}
                        />
                    </div>

                    {dayAvailability.isAvailable && (
                        <>
                            <div className="form-item">
                                <label>Start Time:</label>
                                <TimePicker
                                    format="HH:mm"
                                    value={dayjs(dayAvailability.startTime, 'HH:mm')}
                                    onChange={(time) => setDayAvailability({
                                        ...dayAvailability,
                                        startTime: time?.format('HH:mm') || '09:00'
                                    })}
                                />
                            </div>

                            <div className="form-item">
                                <label>End Time:</label>
                                <TimePicker
                                    format="HH:mm"
                                    value={dayjs(dayAvailability.endTime, 'HH:mm')}
                                    onChange={(time) => setDayAvailability({
                                        ...dayAvailability,
                                        endTime: time?.format('HH:mm') || '18:00'
                                    })}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AvailabilityManagement;
