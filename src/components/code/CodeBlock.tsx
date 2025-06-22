import { ColorStyle } from "@theme/theme";
import type { CodeBlock as CodeBlockType, NodeData } from "@archivisio/c4-modelizer-sdk";
import C4Block from "@components/common/C4Block";
import { Box, Chip, useTheme } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";

const CodeBlock: React.FC<NodeData<CodeBlockType>> = memo(
  ({ data, selected }) => {
    const typedData = data;
    const theme = useTheme();

    const getCodeColors = (): ColorStyle => {
      switch (typedData.codeType) {
        case "class":
          return theme.c4Colors.code;
        case "function":
          return theme.c4Colors.system;
        case "interface":
          return theme.c4Colors.container;
        case "variable":
          return theme.c4Colors.component;
        default:
          return theme.c4Colors.code;
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
              top: 35,
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
