import { createTheme, ThemeOptions } from '@mui/material/styles';
import { COLORS } from '@/data/colors';

export interface ColorStyle {
  primaryColor: string;
  secondaryColor: string;
  border: string;
  hover: string;
  gradientStart: string;
  gradientEnd: string;
  hoverGradientStart: string;
  hoverGradientEnd: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    c4Colors: {
      system: typeof COLORS.primary;
      container: typeof COLORS.secondary;
      component: typeof COLORS.tertiary;
      code: typeof COLORS.quaternary;
      connection: ColorStyle;
    };
  }
  interface ThemeOptions {
    c4Colors?: {
      system?: typeof COLORS.primary;
      container?: typeof COLORS.secondary;
      component?: typeof COLORS.tertiary;
      code?: typeof COLORS.quaternary;
      connection?: ColorStyle;
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
    connection: {
      primaryColor: "0, 176, 255",
      secondaryColor: "2, 136, 209",
      gradientStart: "#0288d1",
      gradientEnd: "#29b6f6",
      border: "#01579b",
      hover: "#01579b",
      hoverGradientStart: "#01579b",
      hoverGradientEnd: "#0288d1",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
