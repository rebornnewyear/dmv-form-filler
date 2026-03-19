import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#ff8f00' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
        autoComplete: 'off',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::-webkit-contacts-auto-fill-button': { display: 'none !important' },
          '&::-webkit-credentials-auto-fill-button': { display: 'none !important' },
          '&::-ms-reveal': { display: 'none !important' },
          '&::-ms-clear': { display: 'none !important' },
        },
      },
    },
  },
});
