import { ContainerBlock as ContainerBlockType, NodeData } from "@/types/c4";
import C4Block from "@components/common/C4Block";
import { COLORS } from "@data/colors";
import { Position } from "@xyflow/react";
import { memo } from "react";

const ContainerBlock: React.FC<NodeData<ContainerBlockType>> = memo(
  ({ data, selected }) => {
    return (
      <C4Block
        item={data}
        onEdit={data.onEdit}
        colors={COLORS.secondary}
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
