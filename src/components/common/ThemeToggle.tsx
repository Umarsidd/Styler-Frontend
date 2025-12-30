import React from 'react';
import { Switch, Box } from '@mui/material';
import { LightMode as BulbIcon } from '@mui/icons-material';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const [darkMode, setDarkMode] = React.useState(false);

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
        document.body.classList.toggle('dark-mode', event.target.checked);
    };

    return (
        <Box className="theme-toggle" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BulbIcon />
            <Switch checked={darkMode} onChange={handleToggle} />
        </Box>
    );
};

export default ThemeToggle;
