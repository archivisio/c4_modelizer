import { NodeData, SystemBlock as SystemBlockType } from "@/types/c4";
import C4Block from "@components/common/C4Block";
import { COLORS } from "@data/colors";
import { Position } from "@xyflow/react";

export default function SystemBlock({
  data,
}: NodeData<SystemBlockType>) {
  return (
    <C4Block
      item={data}
      onEdit={data.onEdit}
      colors={COLORS.primary}
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Left, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom, Position.Right],
      }}
    />
  );
}
