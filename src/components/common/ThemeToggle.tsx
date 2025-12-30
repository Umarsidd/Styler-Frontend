import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const [darkMode, setDarkMode] = React.useState(false);

    const handleToggle = (checked: boolean) => {
        setDarkMode(checked);
        // TODO: Implement theme switching logic
        document.body.classList.toggle('dark-mode', checked);
    };

    return (
        <div className="theme-toggle">
            <BulbOutlined />
            <Switch checked={darkMode} onChange={handleToggle} />
        </div>
    );
};

export default ThemeToggle;
