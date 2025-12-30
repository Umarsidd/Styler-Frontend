import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Steps,
    Card,
    Button,
    Checkbox,
    Select,
    DatePicker,
    Empty,
    Spin,
    Result,
} from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import { salonService } from '../../services/salonService';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import RazorpayCheckout from '../../components/payment/RazorpayCheckout';
import { Salon, Service, Barber } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import './BookingFlow.css';

const { Step } = Steps;
const { Option } = Select;

interface BookingData {
    selectedServices: string[];
    selectedBarber?: string;
    selectedDate?: string;
    selectedTime?: string;
}

interface TimeSlot {
    startTime: string;
    endTime: string;
}

const BookingFlow: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [bookingData, setBookingData] = useState<BookingData>({
        selectedServices: [],
    });
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [createdAppointmentId, setCreatedAppointmentId] = useState<string>('');

    // Fetch salon details
    const { data: salonData, isLoading: loadingSalon } = useQuery({
        queryKey: ['salon', salonId],
        queryFn: () => salonService.getSalonById(salonId!),
        enabled: !!salonId,
    });

    // Fetch services
    const { data: servicesData, isLoading: loadingServices } = useQuery({
        queryKey: ['salon-services', salonId],
        queryFn: () => salonService.getSalonServices(salonId!),
        enabled: !!salonId,
    });

    // Fetch barbers
    const { data: barbersData, isLoading: loadingBarbers } = useQuery({
        queryKey: ['salon-barbers', salonId],
        queryFn: () => barberService.getSalonBarbers(salonId!),
        enabled: !!salonId,
    });

    const salon = salonData?.data as Salon | undefined;
    const services = (servicesData?.data as Service[]) || [];
    const barbers = (barbersData?.data as Barber[]) || [];

    // Check availability mutation
    const checkAvailabilityMutation = useMutation({
        mutationFn: (data: { date: string; barberId?: string }) =>
            appointmentService.checkAvailability({
                salonId: salonId!,
                barberId: data.barberId,
                serviceId: bookingData.selectedServices[0],
                date: data.date,
            }),
        onSuccess: (response) => {
            if (response.success && response.data) {
                setAvailableSlots(response.data.availableSlots || []);
            }
        },
        onError: () => {
            toast.error('Failed to check availability');
            setAvailableSlots([]);
        },
    });

    // Create appointment mutation
    const createAppointmentMutation = useMutation({
        mutationFn: (data: {
            services: string[];
            barberId?: string;
            scheduledDate: string;
            scheduledTime: string;
        }) =>
            appointmentService.createAppointment({
                salonId: salonId!,
                services: data.services,
                barberId: data.barberId,
                scheduledDate: data.scheduledDate,
                scheduledTime: data.scheduledTime,
            }),
        onSuccess: (response) => {
            if (response.success && response.data) {
                setCreatedAppointmentId(response.data._id);
                toast.success('Appointment created successfully!');
                setCurrentStep(3); // Move to payment step
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create appointment');
        },
    });

    // Handle service selection
    const handleServiceToggle = (serviceId: string) => {
        setBookingData((prev) => {
            const isSelected = prev.selectedServices.includes(serviceId);
            return {
                ...prev,
                selectedServices: isSelected
                    ? prev.selectedServices.filter((id) => id !== serviceId)
                    : [...prev.selectedServices, serviceId],
            };
        });
    };

    // Handle barber selection
    const handleBarberSelect = (barberId: string) => {
        setBookingData((prev) => ({ ...prev, selectedBarber: barberId }));
    };

    // Handle date selection
    const handleDateSelect = (date: Dayjs | null) => {
        if (date) {
            const dateStr = date.format('YYYY-MM-DD');
            setBookingData((prev) => ({ ...prev, selectedDate: dateStr, selectedTime: undefined }));

            // Check availability for selected date
            checkAvailabilityMutation.mutate({
                date: dateStr,
                barberId: bookingData.selectedBarber,
            });
        }
    };

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        setBookingData((prev) => ({ ...prev, selectedTime: time }));
    };

    // Calculate total price
    const calculateTotal = (): number => {
        return bookingData.selectedServices.reduce((total, serviceId) => {
            const service = services.find((s) => s._id === serviceId);
            return total + (service?.price || 0);
        }, 0);
    };

    // Handle next step
    const handleNext = () => {
        if (currentStep === 0 && bookingData.selectedServices.length === 0) {
            toast.error('Please select at least one service');
            return;
        }

        if (currentStep === 2) {
            if (!bookingData.selectedDate || !bookingData.selectedTime) {
                toast.error('Please select date and time');
                return;
            }

            // Create appointment
            createAppointmentMutation.mutate({
                services: bookingData.selectedServices,
                barberId: bookingData.selectedBarber,
                scheduledDate: bookingData.selectedDate,
                scheduledTime: bookingData.selectedTime,
            });
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    // Handle previous step
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    // Handle payment success
    const handlePaymentSuccess = () => {
        navigate(`/payment/success?appointmentId=${createdAppointmentId}`);
    };

    // Handle payment failure
    const handlePaymentFailure = (error: string) => {
        navigate(`/payment/failed?appointmentId=${createdAppointmentId}&error=${error}`);
    };

    if (loadingSalon || loadingServices) {
        return (
            <div className="booking-flow-loading">
                <Spin size="large" tip="Loading booking details..." />
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="booking-flow-error">
                <Empty description="Salon not found" />
                <Button type="primary" onClick={() => navigate('/salons')}>
                    Browse Salons
                </Button>
            </div>
        );
    }

    const steps = [
        {
            title: 'Select Services',
            icon: <ShoppingCartOutlined />,
        },
        {
            title: 'Choose Barber',
            icon: <UserOutlined />,
        },
        {
            title: 'Pick Date & Time',
            icon: <CalendarOutlined />,
        },
        {
            title: 'Payment',
            icon: <CreditCardOutlined />,
        },
    ];

    return (
        <div className="booking-flow-page">
            <div className="booking-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/salons/${salonId}`)}
                >
                    Back to Salon
                </Button>
                <h1>{salon.name}</h1>
                <p>Complete your booking in 4 easy steps</p>
            </div>

            <Steps current={currentStep} className="booking-steps">
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} icon={step.icon} />
                ))}
            </Steps>

            <div className="booking-content">
                {/* Step 1: Service Selection */}
                {currentStep === 0 && (
                    <Card title="Select Services" className="step-card">
                        {services.length === 0 ? (
                            <Empty description="No services available" />
                        ) : (
                            <div className="services-list">
                                {services.map((service) => (
                                    <div
                                        key={service._id}
                                        className={`service-item ${bookingData.selectedServices.includes(service._id) ? 'selected' : ''
                                            }`}
                                    >
                                        <Checkbox
                                            checked={bookingData.selectedServices.includes(service._id)}
                                            onChange={() => handleServiceToggle(service._id)}
                                        >
                                            <div className="service-info">
                                                <h4>{service.name}</h4>
                                                <p>{service.description}</p>
                                                <div className="service-meta">
                                                    <span>{service.duration} min</span>
                                                    <span className="service-price">{formatCurrency(service.price)}</span>
                                                </div>
                                            </div>
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}

                {/* Step 2: Barber Selection */}
                {currentStep === 1 && (
                    <Card title="Choose Your Barber (Optional)" className="step-card">
                        <Select
                            size="large"
                            placeholder="Select a barber or skip"
                            value={bookingData.selectedBarber}
                            onChange={handleBarberSelect}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            {barbers.map((barber) => (
                                <Option key={barber._id} value={barber._id}>
                                    {barber.userId} - {barber.specialties.join(', ')}
                                </Option>
                            ))}
                        </Select>
                        <p className="helper-text">
                            You can skip this step to let the salon assign a barber for you
                        </p>
                    </Card>
                )}

                {/* Step 3: Date & Time Selection */}
                {currentStep === 2 && (
                    <Card title="Pick Date & Time" className="step-card">
                        <div className="datetime-picker">
                            <div className="date-section">
                                <h4>Select Date</h4>
                                <DatePicker
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={bookingData.selectedDate ? dayjs(bookingData.selectedDate) : null}
                                    onChange={handleDateSelect}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </div>

                            {bookingData.selectedDate && (
                                <div className="time-section">
                                    <h4>Select Time</h4>
                                    {checkAvailabilityMutation.isPending ? (
                                        <Spin tip="Checking availability..." />
                                    ) : availableSlots.length === 0 ? (
                                        <Empty description="No available slots for this date" />
                                    ) : (
                                        <div className="time-slots">
                                            {availableSlots.map((slot, index) => (
                                                <Button
                                                    key={index}
                                                    type={bookingData.selectedTime === slot.startTime ? 'primary' : 'default'}
                                                    onClick={() => handleTimeSelect(slot.startTime)}
                                                    className="time-slot-btn"
                                                >
                                                    {slot.startTime}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Step 4: Payment */}
                {currentStep === 3 && (
                    <Card title="Payment" className="step-card">
                        {createdAppointmentId ? (
                            <>
                                <div className="booking-summary">
                                    <h3>Booking Summary</h3>
                                    <p><strong>Services:</strong> {bookingData.selectedServices.length} selected</p>
                                    <p><strong>Date:</strong> {bookingData.selectedDate}</p>
                                    <p><strong>Time:</strong> {bookingData.selectedTime}</p>
                                    <p className="total-amount">
                                        <strong>Total Amount:</strong> {formatCurrency(calculateTotal())}
                                    </p>
                                </div>
                                <RazorpayCheckout
                                    appointmentId={createdAppointmentId}
                                    amount={calculateTotal()}
                                    onSuccess={handlePaymentSuccess}
                                    onFailure={handlePaymentFailure}
                                />
                            </>
                        ) : (
                            <Spin tip="Creating appointment..." />
                        )}
                    </Card>
                )}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 3 && (
                <div className="booking-actions">
                    {currentStep > 0 && (
                        <Button size="large" onClick={handlePrev}>
                            <ArrowLeftOutlined /> Previous
                        </Button>
                    )}
                    <div className="total-display">
                        <span>Total: {formatCurrency(calculateTotal())}</span>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleNext}
                        loading={createAppointmentMutation.isPending}
                    >
                        {currentStep === 2 ? 'Confirm Booking' : 'Next'} <ArrowRightOutlined />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
