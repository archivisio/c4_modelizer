import { createTheme, ThemeOptions } from '@mui/material/styles';
import { COLORS } from '@/data/colors';

declare module '@mui/material/styles' {
  interface Theme {
    c4Colors: {
      system: typeof COLORS.primary;
      container: typeof COLORS.secondary;
      component: typeof COLORS.tertiary;
      code: typeof COLORS.quaternary;
    };
  }
  interface ThemeOptions {
    c4Colors?: {
      system?: typeof COLORS.primary;
      container?: typeof COLORS.secondary;
      component?: typeof COLORS.tertiary;
      code?: typeof COLORS.quaternary;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: COLORS.primary.border,
      light: COLORS.primary.hover,
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: COLORS.secondary.border,
      light: COLORS.secondary.hover,
      dark: '#00695c',
      contrastText: '#ffffff',
    },
    info: {
      main: COLORS.tertiary.border,
      light: COLORS.tertiary.hover,
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    error: {
      main: COLORS.quaternary.border,
      light: COLORS.quaternary.hover,
      dark: '#6a1b9a',
      contrastText: '#ffffff',
    },
  },
  c4Colors: {
    system: COLORS.primary,
    container: COLORS.secondary,
    component: COLORS.tertiary,
    code: COLORS.quaternary,
  },
};

const theme = createTheme(themeOptions);

export default theme;
