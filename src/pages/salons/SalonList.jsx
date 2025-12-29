import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input, Select, Row, Col, Pagination, Spin, Empty, Button, Switch, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { salonService } from '../../services/salonService';
import SalonCard from '../../components/salon/SalonCard';
import './SalonList.css';

const { Search } = Input;
const { Option } = Select;

const SalonList = () => {
    const [filters, setFilters] = useState({
        name: '',
        city: '',
        serviceType: '',
        page: 1,
        limit: 12,
    });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

    // Fetch salons with filters
    const { data, isLoading, error } = useQuery({
        queryKey: ['salons', filters],
        queryFn: () => salonService.searchSalons(filters),
        keepPreviousData: true,
    });

    // Get user location and fetch nearby salons
    const handleFindNearby = () => {
        if (!navigator.geolocation) {
            message.error('Geolocation is not supported by your browser');
            return;
        }

        message.loading('Getting your location...', 0);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                message.destroy();
                const { latitude, longitude } = position.coords;

                try {
                    const nearbyData = await salonService.getNearbySalons({
                        lat: latitude,
                        lng: longitude,
                        radius: 10,
                        page: 1,
                        limit: 12,
                    });

                    message.success('Found salons near you!');
                    // You would update state here to show nearby salons
                    console.log('Nearby salons:', nearbyData);
                } catch (err) {
                    message.error('Failed to fetch nearby salons');
                }
            },
            (error) => {
                message.destroy();
                message.error('Unable to retrieve your location');
                console.error('Geolocation error:', error);
            }
        );
    };

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, name: value, page: 1 }));
    };

    const handleCityChange = (value) => {
        setFilters(prev => ({ ...prev, city: value, page: 1 }));
    };

    const handleServiceTypeChange = (value) => {
        setFilters(prev => ({ ...prev, serviceType: value, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const salons = data?.data?.data || [];
    const pagination = data?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

    return (
        <div className="salon-list-page">
            <div className="salon-list-header">
                <div className="header-content">
                    <h1>Discover Premium Salons</h1>
                    <p>Find the perfect salon for your grooming needs</p>
                </div>
            </div>

            <div className="salon-list-container">
                {/* Filters */}
                <div className="salon-filters">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={24} md={8}>
                            <Search
                                placeholder="Search salons..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                className="search-input"
                            />
                        </Col>

                        <Col xs={24} sm={12} md={5}>
                            <Select
                                placeholder="Select City"
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                                onChange={handleCityChange}
                            >
                                <Option value="Mumbai">Mumbai</Option>
                                <Option value="Delhi">Delhi</Option>
                                <Option value="Bangalore">Bangalore</Option>
                                <Option value="Hyderabad">Hyderabad</Option>
                                <Option value="Chennai">Chennai</Option>
                                <Option value="Pune">Pune</Option>
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={5}>
                            <Select
                                placeholder="Service Type"
                                allowClear
                                size="large"
                                style={{ width: '100%' }}
                                onChange={handleServiceTypeChange}
                            >
                                <Option value="haircut">Haircut</Option>
                                <Option value="shave">Shave</Option>
                                <Option value="spa">Spa</Option>
                                <Option value="facial">Facial</Option>
                                <Option value="massage">Massage</Option>
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={4}>
                            <Button
                                type="primary"
                                icon={<EnvironmentOutlined />}
                                size="large"
                                block
                                onClick={handleFindNearby}
                            >
                                Find Nearby
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={2}>
                            <div className="view-toggle">
                                <Switch
                                    checked={viewMode === 'grid'}
                                    onChange={(checked) => setViewMode(checked ? 'grid' : 'list')}
                                    checkedChildren={<AppstoreOutlined />}
                                    unCheckedChildren={<UnorderedListOutlined />}
                                />
                            </div>
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
                            <Empty
                                description="Failed to load salons"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    ) : salons.length === 0 ? (
                        <div className="empty-container">
                            <Empty
                                description="No salons found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Button type="primary" onClick={() => setFilters({ name: '', city: '', serviceType: '', page: 1, limit: 12 })}>
                                    Clear Filters
                                </Button>
                            </Empty>
                        </div>
                    ) : (
                        <>
                            <div className="results-info">
                                <h3>Found {pagination.total} Salons</h3>
                            </div>

                            <Row gutter={[24, 24]} className={viewMode === 'grid' ? 'salon-grid' : 'salon-list-view'}>
                                {salons.map((salon) => (
                                    <Col
                                        key={salon._id}
                                        xs={24}
                                        sm={12}
                                        md={viewMode === 'grid' ? 8 : 12}
                                        lg={viewMode === 'grid' ? 6 : 12}
                                    >
                                        <SalonCard salon={salon} />
                                    </Col>
                                ))}
                            </Row>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination-container">
                                    <Pagination
                                        current={pagination.page}
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
        </div>
    );
};

export default SalonList;
