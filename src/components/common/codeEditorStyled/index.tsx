import { SxProps, Theme } from "@mui/material";
import { CSSProperties } from "react";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dialogThemes } from "../dialogThemes";

export type DialogTheme = typeof dialogThemes.system;

export const getEditorContainerStyles = (sx: SxProps<Theme> = {}): SxProps<Theme> => ({
  mt: 2,
  ...sx,
});

export const getFormLabelStyles = (theme: DialogTheme): SxProps<Theme> => ({
  color: "rgba(255, 255, 255, 0.7)",
  mb: 1,
  display: "block",
  "&.Mui-focused": {
    color: theme.gradientEnd,
  },
});

export const getTextFieldStyles = (theme: DialogTheme): SxProps<Theme> => ({
  fontFamily: '"Fira Code", "Roboto Mono", monospace',
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.3)` },
    "&:hover fieldset": {
      borderColor: `rgba(${theme.primaryColor}, 0.5)`,
    },
    "&.Mui-focused fieldset": { borderColor: theme.gradientStart },
  },
  "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
  "& .MuiInputLabel-root.Mui-focused": { color: theme.gradientEnd },
  "& .MuiInputBase-input": {
    color: "#fff",
    fontFamily: '"Fira Code", "Roboto Mono", monospace',
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
  },
});

export const getEditorClickableBoxStyles = (): SxProps<Theme> => ({
  cursor: "pointer",
});

export const getPlaceholderBoxStyles = (theme: DialogTheme): SxProps<Theme> => ({
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  border: `1px solid rgba(${theme.primaryColor}, 0.3)`,
  borderRadius: "4px",
  padding: "12px",
  color: "rgba(255, 255, 255, 0.5)",
  fontStyle: "italic",
  minHeight: "200px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const createSyntaxHighlighterStyle = (
  theme: DialogTheme
): { [key: string]: CSSProperties } => ({
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    margin: 0,
    padding: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: `1px solid rgba(${theme.primaryColor}, 0.3)`,
    borderRadius: "4px",
    cursor: "pointer",
    maxHeight: "200px",
    overflowY: "auto",
  },
});
