import { Box, Chip } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";
import { COLORS, ColorStyle } from "../data/colors";
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

  const getCodeColors = (): ColorStyle => {
    switch (typedData.codeType) {
      case "class":
        return COLORS.quaternary;
      case "function":
        return COLORS.secondary;
      case "interface":
        return COLORS.tertiary;
      case "variable":
        return COLORS.primary;
      default:
        return COLORS.quaternary;
    }
  };

  const getChipBorderColor = () => {
    switch (typedData.codeType) {
      case "class":
        return "#ab47bc";
      case "function":
        return "#26a69a";
      case "interface":
        return "#ffa726";
      case "variable":
        return "#42a5f5";
      default:
        return "#ab47bc";
    }
  };

  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      technology={typedData.language}
      onEdit={typedData.onEdit}
      colors={getCodeColors()}
      selected={selected}
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom],
      }}
    >
      <Box>
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
            position: "absolute",
            top: 50,
            right: 10,
          }}
          variant="outlined"
        />
      </Box>
    </C4Block>
  );
});

export default CodeBlock;
