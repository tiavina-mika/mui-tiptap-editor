import { PaletteMode, Theme, createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

const defaultTheme = {
  palette: {
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    success: {
      main: '#00C292',
    },
    info: {
      main: '#0BB2FB',
    },
    error: {
      main: '#E46A76',
    },
  },
  typography: {
    fontFamily: [
      'DM Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
};

const lightTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    background: {
      default: '#FAFBFB',
    },
  }
};

const DEFAULT_BG = '#20232A';
const darkTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    background: {
      paper: '#282C34',
      default: DEFAULT_BG,
    },
  },
};

export const getTheme = (mode: PaletteMode = 'light'): Theme => {
  const defaultTheme = mode === 'light' ? lightTheme : darkTheme;

  const theme = createTheme({
    ...defaultTheme,
    palette: {
      mode,
      primary: {
        light: teal[50],
        main: '#03C9D7',
        dark: teal[900],
        contrastText: '#fff',
      },
      ...defaultTheme.palette,
    },
  });

  theme.typography.h6 = {
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  };

  return theme;
};
