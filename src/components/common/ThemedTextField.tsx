import { TextField, TextFieldProps, useTheme } from "@mui/material";

type ThemeType = 'system' | 'container' | 'component' | 'code' | 'connection';

interface ThemedTextFieldProps extends Omit<TextFieldProps, "sx"> {
  themeType?: ThemeType;
  sx?: TextFieldProps["sx"];
}

export default function ThemedTextField({
  themeType = 'system',
  sx,
  ...props
}: ThemedTextFieldProps) {
  const theme = useTheme();
  const themeColor = theme.c4Colors[themeType];
  const borderColor = themeColor.border;
  const hoverColor = themeColor.hover;
  
  return (
    <TextField
      {...props}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: `${borderColor}4D` }, // 30% opacity
          "&:hover fieldset": { borderColor: `${borderColor}80` }, // 50% opacity
          "&.Mui-focused fieldset": { borderColor: borderColor },
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
        "& .MuiInputLabel-root.Mui-focused": { color: hoverColor },
        "& .MuiInputBase-input": { color: "#fff" },
        "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.9)" },
        ...sx,
      }}
    />
  );
}
