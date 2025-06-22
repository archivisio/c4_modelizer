import { ColorStyle } from "@theme/theme";
import { Box, FormLabel, SxProps, TextField, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  createSyntaxHighlighterStyle,
  getEditorClickableBoxStyles,
  getEditorContainerStyles,
  getFormLabelStyles,
  getPlaceholderBoxStyles,
  getTextFieldStyles,
} from "./codeEditorStyled";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  label?: string;
  placeholder?: string;
  theme: ColorStyle;
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
  const { t } = useTranslation();
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

  const customStyle = createSyntaxHighlighterStyle(theme);

  return (
    <Box sx={getEditorContainerStyles(sx)}>
      {label && <FormLabel sx={getFormLabelStyles(theme)}>{label}</FormLabel>}

      {isEditing ? (
        <TextField
          fullWidth
          multiline
          minRows={8}
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder}
          onBlur={() => setIsEditing(false)}
          data-testid="input_code"
          autoFocus
          sx={getTextFieldStyles(theme)}
        />
      ) : (
        <Box
          sx={getEditorClickableBoxStyles()}
          onClick={() => setIsEditing(true)}
          title={t("click_to_edit")}
        >
          {editorValue ? (
            <SyntaxHighlighter
              data-testid="input_code"
              language={getLanguage(language)}
              style={customStyle}
              wrapLines
              wrapLongLines
            >
              {editorValue}
            </SyntaxHighlighter>
          ) : (
            <Box data-testid="input_code" sx={getPlaceholderBoxStyles(theme)}>
              {placeholder || t("enter_code_here")}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CodeEditor;
