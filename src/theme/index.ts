import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    outlineVariant: string;
    tertiary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    tertiaryContainer: {
      main: string;
      contrastText: string;
    };
    secondaryContainer: {
      main: string;
      contrastText: string;
    };
    primaryContainer: {
      main: string;
      contrastText: string;
    };
  }

  interface PaletteOptions {
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    outlineVariant?: string;
    tertiary?: {
      main: string;
      light?: string;
      dark?: string;
      contrastText: string;
    };
    tertiaryContainer?: {
      main: string;
      contrastText: string;
    };
    secondaryContainer?: {
      main: string;
      contrastText: string;
    };
    primaryContainer?: {
      main: string;
      contrastText: string;
    };
  }
}

export const m3Theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#2d476f',
      dark: '#002045',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#506079',
      light: '#727782',
      dark: '#38485f',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#c85a32',
      light: '#f57c51',
      dark: '#822801',
      contrastText: '#ffffff',
    },
    primaryContainer: {
      main: '#d5e3ff',
      contrastText: '#001c3b',
    },
    secondaryContainer: {
      main: '#dae2f9',
      contrastText: '#0d1c2e',
    },
    tertiaryContainer: {
      main: '#ffdbcf',
      contrastText: '#380d00',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f1f5f9',
    surfaceContainer: '#eaeff5',
    surfaceContainerHigh: '#e2e8f0',
    surfaceContainerHighest: '#d9e2ec',
    outlineVariant: '#c2c7d0',
    text: {
      primary: '#191c1f',
      secondary: '#506079',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.8rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      letterSpacing: '-0.015em',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.4rem',
      lineHeight: 1.35,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.15rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.55,
      color: '#191c1f',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#506079',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(26, 54, 93, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1a365d',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#002045',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 1px 4px 0px rgba(26, 54, 93, 0.05)',
          border: '1px solid #eaeff5',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
  },
});

