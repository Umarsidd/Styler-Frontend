import { Card, Skeleton, Space } from 'antd';
import './SalonCardSkeleton.css';

const SalonCardSkeleton = () => {
    return (
        <Card className="salon-card-skeleton" hoverable>
            <Skeleton.Image active className="skeleton-image" />
            <div className="skeleton-content">
                <Skeleton active paragraph={{ rows: 3 }} />
            </div>
        </Card>
    );
};

export const SalonListSkeleton = ({ count = 6 }) => {
    return (
        <div className="salon-list-skeleton">
            {[...Array(count)].map((_, index) => (
                <SalonCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default SalonCardSkeleton;
