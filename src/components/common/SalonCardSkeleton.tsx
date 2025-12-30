import React from 'react';
import { Card, Skeleton } from 'antd';
import './SalonCardSkeleton.css';

const SalonCardSkeleton: React.FC = () => {
    return (
        <Card className="salon-card-skeleton">
            <Skeleton.Image active style={{ width: '100%', height: 200 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
    );
};

export default SalonCardSkeleton;
