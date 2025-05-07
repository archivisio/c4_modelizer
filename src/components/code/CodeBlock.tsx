import { CodeBlock as CodeBlockType, NodeData } from "@/types/c4";
import C4Block from "@components/common/C4Block";
import { COLORS, ColorStyle } from "@data/colors";
import { Box, Chip } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";

const CodeBlock: React.FC<NodeData<CodeBlockType>> = memo(
  ({ data, selected }) => {
    const typedData = data;

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
        item={typedData}
        onEdit={typedData.onEdit}
        colors={getCodeColors()}
        selected={selected}
        handlePositions={{
          source: [
            Position.Right,
            Position.Bottom,
            Position.Left,
            Position.Top,
          ],
          target: [
            Position.Left,
            Position.Top,
            Position.Bottom,
            Position.Right,
          ],
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
  }
);

export default CodeBlock;
