import { Box, Chip } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";
import C4Block from "./common/C4Block";

export type CodeBlockData = {
  name: string;
  description?: string;
  codeType: "class" | "function" | "interface" | "variable" | "other";
  language?: string;
  code?: string;
  onEdit: () => void;
};

interface CodeBlockProps {
  data: Record<string, unknown>;
  selected: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ data, selected }) => {
  const typedData = data as CodeBlockData;

  const getVariantFromCodeType = () => {
    switch (typedData.codeType) {
      case "class":
        return "quaternary";
      case "function":
        return "secondary";
      case "interface":
        return "tertiary";
      case "variable":
        return "primary";
      default:
        return "quaternary";
    }
  };

  const getChipBorderColor = () => {
    switch (typedData.codeType) {
      case "class":
        return "#ab47bc"; // quaternary color
      case "function":
        return "#26a69a"; // secondary color
      case "interface":
        return "#ffa726"; // tertiary color
      case "variable":
        return "#42a5f5"; // primary color
      default:
        return "#ab47bc"; // quaternary color
    }
  };

  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      technology={typedData.language}
      onEdit={typedData.onEdit}
      variant={getVariantFromCodeType()}
      selected={selected}
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom],
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Chip
          size="small"
          label={typedData.codeType}
          sx={{
            borderColor: getChipBorderColor(),
            color: "#fff",
            fontWeight: "medium",
            backgroundColor: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(4px)",
            "& .MuiChip-label": { px: 1.5 },
          }}
          variant="outlined"
        />
      </Box>

      {typedData.code && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 1,
            fontSize: "0.75rem",
            fontFamily: '"Fira Code", "Roboto Mono", monospace',
            overflowX: "auto",
            maxHeight: "80px",
            overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e0e0e0",
            backdropFilter: "blur(4px)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          {typedData.code}
        </Box>
      )}
    </C4Block>
  );
});

export default CodeBlock;
