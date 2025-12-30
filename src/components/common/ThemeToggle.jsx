import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useUIStore } from '../../stores/uiStore';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useUIStore();
    const isDark = theme === 'dark';

    return (
        <div className="theme-toggle-container">
            <Switch
                checked={isDark}
                onChange={toggleTheme}
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
                className="theme-toggle-switch"
            />
        </div>
    );
};

export default ThemeToggle;
