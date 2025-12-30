import { createTheme } from '@mui/material/styles';

// This file is deprecated in favor of src/theme/muiTheme.ts
// Keeping for backward compatibility during migration

export const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
        },
    },
});

export const antdTheme = theme;
