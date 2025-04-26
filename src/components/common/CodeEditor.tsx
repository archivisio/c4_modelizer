import { Box, FormLabel, SxProps, TextField, Theme } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dialogThemes } from "./dialogThemes";

type DialogTheme = typeof dialogThemes.system;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  label?: string;
  placeholder?: string;
  theme: DialogTheme;
  sx?: SxProps<Theme>;
}

const getLanguage = (language: string): string => {
  const langMap: Record<string, string> = {
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    python: "python",
    py: "python",
    html: "html",
    css: "css",
    ruby: "ruby",
    rb: "ruby",
    java: "java",
    php: "php",
    go: "go",
    rust: "rust",
    c: "c",
    cpp: "cpp",
    csharp: "csharp",
    cs: "csharp",
    swift: "swift",
    kotlin: "kotlin",
    scala: "scala",
    sql: "sql",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    markdown: "markdown",
    md: "markdown",
  };

  return langMap[language?.toLowerCase()] || "javascript";
};

const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  label,
  placeholder,
  theme,
  sx = {},
}: CodeEditorProps) => {
  const [editorValue, setEditorValue] = useState(value || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditorValue(newValue);
    onChange(newValue);
  };

  const customStyle = {
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
  } as { [key: string]: CSSProperties };

  return (
    <Box sx={{ mt: 2, ...sx }}>
      {label && (
        <FormLabel
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mb: 1,
            display: "block",
            "&.Mui-focused": {
              color: theme.gradientEnd,
            },
          }}
        >
          {label}
        </FormLabel>
      )}

      {isEditing ? (
        <TextField
          fullWidth
          multiline
          minRows={8}
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder}
          onBlur={() => setIsEditing(false)}
          autoFocus
          sx={{
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
          }}
        />
      ) : (
        <Box onClick={() => setIsEditing(true)} sx={{ cursor: "pointer" }}>
          {editorValue ? (
            <SyntaxHighlighter
              language={getLanguage(language)}
              style={customStyle}
              wrapLines
              wrapLongLines
            >
              {editorValue}
            </SyntaxHighlighter>
          ) : (
            <Box
              sx={{
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
              }}
            >
              {placeholder || "Cliquez pour ajouter du code"}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CodeEditor;
