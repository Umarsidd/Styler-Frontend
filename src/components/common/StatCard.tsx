import React, { ReactNode } from 'react';
import { Card, Statistic } from 'antd';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    prefix?: ReactNode;
    suffix?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, prefix, suffix, color }) => {
    return (
        <Card className="stat-card">
            {icon && (
                <div className="stat-icon" style={{ backgroundColor: color || '#667eea' }}>
                    {icon}
                </div>
            )}
            <Statistic
                title={title}
                value={value}
                prefix={prefix}
                suffix={suffix}
                valueStyle={{ color: color || '#667eea' }}
            />
        </Card>
    );
};

export default StatCard;
