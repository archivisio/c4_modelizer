export interface ColorStyle {
  background: string;
  gradient: string;
  gradientHover: string;
  border: string;
  hover: string;
  glow: string;
}

export const COLORS: Record<string, ColorStyle> = {
  primary: {
    background: "rgba(13, 71, 161, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(13, 71, 161, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(25, 118, 210, 0.25) 0%, rgba(13, 71, 161, 0.2) 100%)",
    border: "#1976d2",
    hover: "#42a5f5",
    glow: "0 0 15px rgba(33, 150, 243, 0.3)",
  },
  secondary: {
    background: "rgba(0, 121, 107, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(0, 121, 107, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(0, 150, 136, 0.25) 0%, rgba(0, 121, 107, 0.2) 100%)",
    border: "#00897b",
    hover: "#26a69a",
    glow: "0 0 15px rgba(0, 150, 136, 0.3)",
  },
  tertiary: {
    background: "rgba(245, 124, 0, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(245, 124, 0, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(245, 124, 0, 0.2) 100%)",
    border: "#f57c00",
    hover: "#ffa726",
    glow: "0 0 15px rgba(255, 152, 0, 0.3)",
  },
  quaternary: {
    background: "rgba(123, 31, 162, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(123, 31, 162, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(156, 39, 176, 0.25) 0%, rgba(123, 31, 162, 0.2) 100%)",
    border: "#7b1fa2",
    hover: "#ab47bc",
    glow: "0 0 15px rgba(156, 39, 176, 0.3)",
  },
};