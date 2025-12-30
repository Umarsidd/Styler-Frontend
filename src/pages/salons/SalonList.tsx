import React, { useState } from 'react';
import { Input, Select, Row, Col, Spin, Empty, Pagination } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import { Salon } from '../../types';
import { SalonSearchFilters } from '../../services/salonService';
import './SalonList.css';

const { Option } = Select;

const SalonList: React.FC = () => {
    const [filters, setFilters] = useState<SalonSearchFilters>({
        name: '',
        city: '',
        page: 1,
        limit: 12,
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['salons', filters],
        queryFn: () => salonService.searchSalons(filters),
    });

    const salons = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    const handleSearchChange = (value: string) => {
        setFilters({ ...filters, name: value, page: 1 });
    };

    const handleCityChange = (value: string) => {
        setFilters({ ...filters, city: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    return (
        <div className="salon-list-page">
            <div className="salon-list-header">
                <h1>Discover Premium Salons</h1>
                <p>Find the best salons and barbers near you</p>
            </div>

            {/* Filters */}
            <div className="salon-filters">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            size="large"
                            placeholder="Search salons..."
                            prefix={<SearchOutlined />}
                            value={filters.name}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            size="large"
                            placeholder="Select City"
                            value={filters.city || undefined}
                            onChange={handleCityChange}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="">All Cities</Option>
                            <Option value="Mumbai">Mumbai</Option>
                            <Option value="Delhi">Delhi</Option>
                            <Option value="Bangalore">Bangalore</Option>
                            <Option value="Hyderabad">Hyderabad</Option>
                            <Option value="Chennai">Chennai</Option>
                            <Option value="Pune">Pune</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            size="large"
                            placeholder="Service Type"
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="">All Services</Option>
                            <Option value="haircut">Haircut</Option>
                            <Option value="shave">Shave</Option>
                            <Option value="facial">Facial</Option>
                            <Option value="massage">Massage</Option>
                        </Select>
                    </Col>
                </Row>
            </div>

            {/* Results */}
            <div className="salon-results">
                {isLoading ? (
                    <div className="loading-container">
                        <Spin size="large" tip="Loading salons..." />
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <Empty description="Failed to load salons. Please try again." />
                    </div>
                ) : salons.length === 0 ? (
                    <Empty
                        description="No salons found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <>
                        <div className="results-count">
                            {pagination && (
                                <p>
                                    Showing {salons.length} of {pagination.total} salons
                                </p>
                            )}
                        </div>

                        <Row gutter={[24, 24]}>
                            {salons.map((salon: Salon) => (
                                <Col xs={24} sm={12} lg={8} key={salon._id}>
                                    <SalonCard salon={salon} />
                                </Col>
                            ))}
                        </Row>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="pagination-container">
                                <Pagination
                                    current={filters.page}
                                    total={pagination.total}
                                    pageSize={filters.limit}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showTotal={(total) => `Total ${total} salons`}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SalonList;
