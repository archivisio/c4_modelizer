import type { ContainerBlock as ContainerBlockType, NodeData } from "c4-modelizer-sdk/core";
import C4Block from "@components/common/C4Block";
import { useTheme } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";

const ContainerBlock: React.FC<NodeData<ContainerBlockType>> = memo(
  ({ data, selected }) => {
    const theme = useTheme();
    return (
      <C4Block
        item={data}
        onEdit={data.onEdit}
        colors={theme.c4Colors.container}
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
        selected={selected}
      />
    );
  }
);

export default ContainerBlock;
