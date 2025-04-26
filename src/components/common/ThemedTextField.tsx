import { TextField, TextFieldProps } from "@mui/material";
import { dialogThemes } from "./dialogThemes";

type DialogTheme = typeof dialogThemes.system;

interface ThemedTextFieldProps extends Omit<TextFieldProps, "sx"> {
  theme: DialogTheme;
  sx?: TextFieldProps["sx"];
}

export default function ThemedTextField({
  theme,
  sx,
  ...props
}: ThemedTextFieldProps) {
  return (
    <TextField
      {...props}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.3)` },
          "&:hover fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.5)` },
          "&.Mui-focused fieldset": { borderColor: theme.gradientStart },
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
        "& .MuiInputLabel-root.Mui-focused": { color: theme.gradientEnd },
        "& .MuiInputBase-input": { color: "#fff" },
        "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.9)" },
        ...sx,
      }}
    />
  );
}
