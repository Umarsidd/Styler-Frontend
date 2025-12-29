import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Steps, Card, Button, Row, Col, Checkbox, DatePicker, message, Spin, Empty
} from 'antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { salonService } from '../../services/salonService';
import { barberService } from '../../services/barberService';
import { appointmentService } from '../../services/appointmentService';
import { useCartStore } from '../../stores/cartStore';
import './BookingFlow.css';

const { Step } = Steps;

const BookingFlow = () => {
    const { salonId } = useParams();
    const navigate = useNavigate();
    const cart = useCartStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [notes, setNotes] = useState('');

    // Fetch salon services
    const { data: servicesData, isLoading: servicesLoading } = useQuery({
        queryKey: ['salon-services', salonId],
        queryFn: () => salonService.getSalonServices(salonId),
    });

    // Fetch salon barbers
    const { data: barbersData } = useQuery({
        queryKey: ['salon-barbers', salonId],
        queryFn: () => barberService.getSalonBarbers(salonId),
        enabled: currentStep >= 1,
    });

    // Check availability mutation
    const checkAvailabilityMutation = useMutation({
        mutationFn: (data) => appointmentService.checkAvailability(data),
        onSuccess: (response) => {
            setAvailableSlots(response.data?.availableSlots || []);
            if (response.data?.availableSlots?.length === 0) {
                message.warning('No slots available for selected date');
            }
        },
        onError: () => {
            message.error('Failed to check availability');
        },
    });

    // Create appointment mutation
    const createAppointmentMutation = useMutation({
        mutationFn: (data) => appointmentService.createAppointment(data),
        onSuccess: (response) => {
            message.success('Appointment created successfully!');
            cart.clearCart();
            // Navigate to payment or appointment details
            navigate(`/customer/appointments/${response.data?._id}`);
        },
        onError: (error) => {
            message.error(error.response?.data?.error?.message || 'Failed to create appointment');
        },
    });

    const services = servicesData?.data || [];
    const barbers = barbersData?.data || [];

    const handleServiceToggle = (service) => {
        const isSelected = selectedServices.find(s => s._id === service._id);
        if (isSelected) {
            setSelectedServices(selectedServices.filter(s => s._id !== service._id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);

        if (date && selectedServices.length > 0) {
            // Check availability for the selected date
            checkAvailabilityMutation.mutate({
                salonId,
                barberId: selectedBarber?._id,
                serviceId: selectedServices[0]._id,
                date: date.format('YYYY-MM-DD'),
            });
        }
    };

    const handleNext = () => {
        if (currentStep === 0 && selectedServices.length === 0) {
            message.warning('Please select at least one service');
            return;
        }
        if (currentStep === 2 && !selectedDate) {
            message.warning('Please select a date');
            return;
        }
        if (currentStep === 2 && !selectedTime) {
            message.warning('Please select a time slot');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const appointmentData = {
            salonId,
            barberId: selectedBarber?._id,
            services: selectedServices.map(s => s._id),
            scheduledDate: selectedDate.format('YYYY-MM-DD'),
            scheduledTime: selectedTime,
            notes,
        };

        createAppointmentMutation.mutate(appointmentData);
    };

    const getTotalAmount = () => {
        return selectedServices.reduce((sum, service) => sum + service.price, 0);
    };

    const getTotalDuration = () => {
        return selectedServices.reduce((sum, service) => sum + service.duration, 0);
    };

    const steps = [
        { title: 'Services', icon: <FileTextOutlined /> },
        { title: 'Barber', icon: <UserOutlined /> },
        { title: 'Date & Time', icon: <CalendarOutlined /> },
        { title: 'Review', icon: <ClockCircleOutlined /> },
    ];

    if (servicesLoading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    return (
        <div className="booking-flow-page">
            <div className="booking-header">
                <h1>Book Your Appointment</h1>
                <Steps current={currentStep} items={steps} />
            </div>

            <div className="booking-container">
                <Row gutter={24}>
                    <Col xs={24} lg={16}>
                        <Card className="booking-step-card">
                            {/* Step 0: Service Selection */}
                            {currentStep === 0 && (
                                <div className="step-content">
                                    <h2>Select Services</h2>
                                    {services.length === 0 ? (
                                        <Empty description="No services available" />
                                    ) : (
                                        <Row gutter={[16, 16]}>
                                            {services.map((service) => (
                                                <Col xs={24} sm={12} key={service._id}>
                                                    <Card
                                                        className={`service-select-card ${selectedServices.find(s => s._id === service._id) ? 'selected' : ''}`}
                                                        onClick={() => handleServiceToggle(service)}
                                                        hoverable
                                                    >
                                                        <Checkbox
                                                            checked={!!selectedServices.find(s => s._id === service._id)}
                                                            onChange={() => handleServiceToggle(service)}
                                                        />
                                                        <h3>{service.name}</h3>
                                                        <p>{service.description}</p>
                                                        <div className="service-meta">
                                                            <span><ClockCircleOutlined /> {service.duration} mins</span>
                                                            <span className="price">₹{service.price}</span>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </div>
                            )}

                            {/* Step 1: Barber Selection */}
                            {currentStep === 1 && (
                                <div className="step-content">
                                    <h2>Select Barber (Optional)</h2>
                                    <Button
                                        type="dashed"
                                        block
                                        style={{ marginBottom: 16 }}
                                        onClick={() => setSelectedBarber(null)}
                                    >
                                        No Preference
                                    </Button>
                                    {barbers.length === 0 ? (
                                        <Empty description="No barbers available" />
                                    ) : (
                                        <Row gutter={[16, 16]}>
                                            {barbers.map((barber) => (
                                                <Col xs={24} sm={12} key={barber._id}>
                                                    <Card
                                                        className={`barber-select-card ${selectedBarber?._id === barber._id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedBarber(barber)}
                                                        hoverable
                                                    >
                                                        <h3>{barber.userId?.name || 'Barber'}</h3>
                                                        <p>Experience: {barber.experience} years</p>
                                                        <p>Specialties: {barber.specialties?.join(', ')}</p>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Date & Time Selection */}
                            {currentStep === 2 && (
                                <div className="step-content">
                                    <h2>Select Date & Time</h2>
                                    <DatePicker
                                        size="large"
                                        style={{ width: '100%', marginBottom: 24 }}
                                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                                        onChange={handleDateChange}
                                        value={selectedDate}
                                    />

                                    {checkAvailabilityMutation.isLoading && (
                                        <div style={{ textAlign: 'center', padding: 40 }}>
                                            <Spin tip="Checking availability..." />
                                        </div>
                                    )}

                                    {selectedDate && availableSlots.length > 0 && (
                                        <div>
                                            <h3>Available Time Slots</h3>
                                            <Row gutter={[12, 12]}>
                                                {availableSlots.map((slot, idx) => (
                                                    <Col xs={8} sm={6} key={idx}>
                                                        <Button
                                                            type={selectedTime === slot.startTime ? 'primary' : 'default'}
                                                            block
                                                            onClick={() => setSelectedTime(slot.startTime)}
                                                        >
                                                            {slot.startTime}
                                                        </Button>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Review & Confirm */}
                            {currentStep === 3 && (
                                <div className="step-content">
                                    <h2>Review Your Appointment</h2>
                                    <Card>
                                        <h3>Selected Services</h3>
                                        {selectedServices.map(service => (
                                            <div key={service._id} className="review-item">
                                                <span>{service.name}</span>
                                                <span>₹{service.price}</span>
                                            </div>
                                        ))}
                                        <Divider />
                                        <div className="review-item">
                                            <strong>Barber:</strong>
                                            <span>{selectedBarber?.userId?.name || 'Any Available'}</span>
                                        </div>
                                        <div className="review-item">
                                            <strong>Date:</strong>
                                            <span>{selectedDate?.format('DD MMM YYYY')}</span>
                                        </div>
                                        <div className="review-item">
                                            <strong>Time:</strong>
                                            <span>{selectedTime}</span>
                                        </div>
                                        <div className="review-item">
                                            <strong>Duration:</strong>
                                            <span>{getTotalDuration()} mins</span>
                                        </div>
                                        <Divider />
                                        <div className="review-item total">
                                            <strong>Total Amount:</strong>
                                            <strong>₹{getTotalAmount()}</strong>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="booking-actions">
                                {currentStep > 0 && (
                                    <Button size="large" onClick={handlePrevious}>
                                        Previous
                                    </Button>
                                )}
                                {currentStep < 3 && (
                                    <Button type="primary" size="large" onClick={handleNext}>
                                        Next
                                    </Button>
                                )}
                                {currentStep === 3 && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleSubmit}
                                        loading={createAppointmentMutation.isLoading}
                                    >
                                        Confirm & Proceed to Payment
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </Col>

                    {/* Sidebar Summary */}
                    <Col xs={24} lg={8}>
                        <Card className="booking-summary-card" title="Booking Summary">
                            <div className="summary-content">
                                <div className="summary-item">
                                    <strong>Services:</strong>
                                    <span>{selectedServices.length}</span>
                                </div>
                                <div className="summary-item">
                                    <strong>Duration:</strong>
                                    <span>{getTotalDuration()} mins</span>
                                </div>
                                <div className="summary-item total">
                                    <strong>Total:</strong>
                                    <strong>₹{getTotalAmount()}</strong>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BookingFlow;
