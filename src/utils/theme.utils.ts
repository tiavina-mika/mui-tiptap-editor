import { BadgeProps, PaletteMode, PaletteOptions, Theme, createTheme } from '@mui/material';
import { grey, teal } from '@mui/material/colors';

export const DASHBOARD_BACKGROUND_COLOR = '#FAFBFB';
export const DEFAULT_THEME_COLOR = 'green';


const textDarkColor = {
  color: '#fff',
};

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
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme, }: { theme: Theme, ownerState: BadgeProps }) => ({
          width: 38,
          height: 20,
          padding: 0,
          display: 'flex',
          '&:active': {
            '& .MuiSwitch-thumb': {
              width: 19,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
              transform: 'translateX(9px)',
            },
          },
          '& .MuiSwitch-switchBase': {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 18,
            height: 18,
            borderRadius: 20 / 2,
            transition: theme.transitions.create(['width'], {
              duration: 200,
            }),
          },
          '& .MuiSwitch-track': {
            borderRadius: 20 / 2,
            opacity: 1,
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
          },
        }),
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          padding: '0px 3px',
          fontWeight: 500,
          fontSize: 12,
        },
        filled: {
          borderRadius: 6,
          color: '#fff',
        },
        label: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme, ownerState }: { theme: Theme, ownerState: BadgeProps }) => {
          if (ownerState.overlap === 'rectangular') {
            return {
              color: '#fff',
              top: -2,
              left: 0,
              border: `1px solid ${theme.palette.background.paper}`,
            }
          }
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: 16,
          textTransform: 'initial',
          padding: '12px 24px',
          borderRadius: 60,
          // border: 'none',
          '&.Mui-disabled': {
            color: '#fff',
            backgroundColor: theme.palette.grey[300],
          },
        }),
        contained: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        }),
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
      // mui stack has no, so overrides in the variants instead
      // ISSUE: https://stackoverflow.com/questions/72382224/styleoverrides-not-being-applied-with-styled-components-in-mui
      variants: [
        {
          props: {},
          style: {
            flexWrap: 'wrap',
          },
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.up('sm')]: {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
          },
          [theme.breakpoints.down('sm')]: {
            boxShadow: 'none'
          }
        })
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
          },
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: ({ theme }: { theme: Theme }) => ({
          '& .MuiAutocomplete-listbox': {
            '& li': {
              fontSize: '16px !important',
              paddingTop: 14 + ' !important',
              paddingBottom: 14 + ' !important',
              fontFamily: theme.typography.fontFamily + ' !important',
              '&:hover': {
                fontWeight: 500,
              },
              '&:not(:last-child)': {
                borderBottom: '1px solid ' + theme.palette.grey[100] + ' !important',
              }
            },
          }
        }),
      }
    }
  },
};

export const websitePalette = {
  primary: {
    light: teal[50],
    main: '#03C9D7',
    dark: teal[900],
    contrastText: '#fff',
  },
  secondary: {
    light: '#ff7961',
    main: '#222222',
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
};

export const boPalette: PaletteOptions = {
  primary: {
    light: teal[50],
    main: '#03C9D7',
    dark: teal[900],
    contrastText: '#fff',
  },
  ...defaultTheme.palette,
};

const lightTheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    background: {
      default: '#FAFBFB',
    },
  },
  components: {
    ...defaultTheme.components,
    MuiListSubheader: {
      styleOverrides: {
        root: { color: grey[700] },
      },
    },
  },
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
  components: {
    ...defaultTheme.components,
    MuiTypography: {
      styleOverrides: {
        root: textDarkColor,
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: textDarkColor,
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: textDarkColor,
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: { backgroundColor: 'transparent !important' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: DEFAULT_BG,
        },
        inputMultiline: {
          backgroundColor: DEFAULT_BG,
        },
        root: {
          backgroundColor: DEFAULT_BG,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: '#fff !important' },
      },
    },
  },
};

export const getTheme = (mode: PaletteMode = 'light'): Theme => {
  const defaultTheme = mode === 'light' ? lightTheme : darkTheme;

  // @ts-expect-error - unknown type
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
