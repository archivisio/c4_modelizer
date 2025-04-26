import { DialogTheme } from './BaseEditDialog';

export const dialogThemes: Record<string, DialogTheme> = {
  system: {
    primaryColor: "81, 162, 255",
    secondaryColor: "25, 118, 210",
    gradientStart: "#51a2ff",
    gradientEnd: "#8ed6ff",
    hoverGradientStart: "#1565c0",
    hoverGradientEnd: "#1976d2",
  },
  component: {
    primaryColor: "255, 152, 0",
    secondaryColor: "245, 124, 0",
    gradientStart: "#f57c00",
    gradientEnd: "#ffb74d",
    hoverGradientStart: "#e65100",
    hoverGradientEnd: "#f57c00",
  },
  container: {
    primaryColor: "0, 150, 136",
    secondaryColor: "0, 137, 123",
    gradientStart: "#00897b",
    gradientEnd: "#4db6ac",
    hoverGradientStart: "#00695c",
    hoverGradientEnd: "#00897b",
  },
  code: {
    primaryColor: "156, 39, 176",
    secondaryColor: "123, 31, 162",
    gradientStart: "#9c27b0",
    gradientEnd: "#ce93d8",
    hoverGradientStart: "#7b1fa2",
    hoverGradientEnd: "#9c27b0",
  },
  connection: {
    primaryColor: "0, 176, 255",
    secondaryColor: "2, 136, 209",
    gradientStart: "#0288d1",
    gradientEnd: "#29b6f6",
    hoverGradientStart: "#01579b",
    hoverGradientEnd: "#0288d1",
  },
};
