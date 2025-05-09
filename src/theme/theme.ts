import { createTheme, ThemeOptions } from '@mui/material/styles';

export interface ColorStyle {
  primaryColor: string;
  secondaryColor: string;
  background: string;
  gradient: string;
  gradientHover: string;
  border: string;
  hover: string;
  glow: string;
  gradientStart: string;
  gradientEnd: string;
  hoverGradientStart: string;
  hoverGradientEnd: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    c4Colors: {
      system: ColorStyle;
      container: ColorStyle;
      component: ColorStyle;
      code: ColorStyle;
      connection: ColorStyle;
    };
  }
  interface ThemeOptions {
    c4Colors?: {
      system?: ColorStyle;
      container?: ColorStyle;
      component?: ColorStyle;
      code?: ColorStyle;
      connection?: ColorStyle;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "rgb(81, 162, 255)",
      light: "rgb(81, 162, 255)",
      dark: "rgb(81, 162, 255)",
      contrastText: '#ffffff',
    },
    secondary: {
      main: "rgb(0, 150, 136)",
      light: "rgb(0, 150, 136)",
      dark: "rgb(0, 150, 136)",
      contrastText: '#ffffff',
    },
    info: {
      main: "rgb(230, 81, 0)",
      light: "rgb(230, 81, 0)",
      dark: "rgb(230, 81, 0)",
      contrastText: '#ffffff',
    },
    error: {
      main: "rgb(106, 27, 154)",
      light: "rgb(106, 27, 154)",
      dark: "rgb(106, 27, 154)",
      contrastText: '#ffffff',
    },
  },
  c4Colors: {
    system: {
      primaryColor: "rgb(81, 162, 255)",
      secondaryColor: "rgb(25, 118, 210)",
      background: "rgba(13, 71, 161, 0.1)",
      gradient:
        "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(13, 71, 161, 0.1) 100%)",
      gradientHover:
        "linear-gradient(135deg, rgba(25, 118, 210, 0.25) 0%, rgba(13, 71, 161, 0.2) 100%)",
      border: "#1976d2",
      hover: "#42a5f5",
      glow: "0 0 15px rgba(33, 150, 243, 0.3)",
      gradientStart: "#51a2ff",
      gradientEnd: "#8ed6ff",
      hoverGradientStart: "#1565c0",
      hoverGradientEnd: "#1976d2",
    },
    container: {
      primaryColor: "rgb(0, 150, 136)",
      secondaryColor: "rgb(0, 137, 123)",
      background: "rgba(0, 121, 107, 0.1)",
      gradient:
        "linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(0, 121, 107, 0.1) 100%)",
      gradientHover:
        "linear-gradient(135deg, rgba(0, 150, 136, 0.25) 0%, rgba(0, 121, 107, 0.2) 100%)",
      border: "#00897b",
      hover: "#26a69a",
      glow: "0 0 15px rgba(0, 150, 136, 0.3)",
      gradientStart: "#00897b",
      gradientEnd: "#4db6ac",
      hoverGradientStart: "#00695c",
      hoverGradientEnd: "#00897b",
    },
    component: {
      primaryColor: "rgb(255, 152, 0)",
      secondaryColor: "rgb(245, 124, 0)",
      background: "rgba(255, 152, 0, 0.1)",
      gradient:
        "linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)",
      gradientHover:
        "linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(255, 152, 0, 0.2) 100%)",
      border: "#f57c00",
      hover: "#ffa726",
      glow: "0 0 15px rgba(255, 152, 0, 0.3)",
      gradientStart: "#f57c00",
      gradientEnd: "#ffb74d",
      hoverGradientStart: "#e65100",
      hoverGradientEnd: "#f57c00",
    },
    code: {
      primaryColor: "rgb(156, 39, 176)",
      secondaryColor: "rgb(123, 31, 162)",
      background: "rgba(156, 39, 176, 0.1)",
      gradient:
        "linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(156, 39, 176, 0.1) 100%)",
      gradientHover:
        "linear-gradient(135deg, rgba(156, 39, 176, 0.25) 0%, rgba(156, 39, 176, 0.2) 100%)",
      border: "#9c27b0",
      hover: "#ce93d8",
      glow: "0 0 15px rgba(156, 39, 176, 0.3)",
      gradientStart: "#9c27b0",
      gradientEnd: "#ce93d8",
      hoverGradientStart: "#7b1fa2",
      hoverGradientEnd: "#9c27b0",
    },
    connection: {
      primaryColor: "rgb(0, 176, 255)",
      secondaryColor: "rgb(2, 136, 209)",
      gradientStart: "#0288d1",
      gradientEnd: "#29b6f6",
      border: "#01579b",
      hover: "#01579b",
      hoverGradientStart: "#01579b",
      hoverGradientEnd: "#0288d1",
      background: "#0288d1",
      gradient: "#0288d1",
      gradientHover: "#0288d1",
      glow: "#0288d1",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
