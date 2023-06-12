import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: 'hsl(238, 40%, 52%)',
        },
        secondary: {
            main: 'hsl(211, 10%, 45%)',
        },
        error: {
            main: 'hsl(358, 79%, 66%)',
        },
    },
});

export default theme;
