import { ComponentBlock as ComponentBlockType, NodeData } from "@/types/c4";
import C4Block from "@components/common/C4Block";
import { useTheme } from "@mui/material";
import { Position } from "@xyflow/react";
import { memo } from "react";

const ComponentBlock: React.FC<NodeData<ComponentBlockType>> = memo(
  ({ data, selected }) => {
    const theme = useTheme();
    return (
      <C4Block
        item={data}
        onEdit={data.onEdit}
        colors={theme.c4Colors.component}
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
      />
    );
  }
);

export default ComponentBlock;
