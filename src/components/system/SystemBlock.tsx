import type { NodeData, SystemBlock as SystemBlockType } from "c4-modelizer-sdk/core";
import C4Block from "@components/common/C4Block";
import { useTheme } from "@mui/material";
import { Position } from "@xyflow/react";

export default function SystemBlock({
  data,
}: NodeData<SystemBlockType>) {
  const theme = useTheme();
  return (
    <C4Block
      item={data}
      onEdit={data.onEdit}
      colors={theme.c4Colors.system}
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Left, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom, Position.Right],
      }}
    />
  );
}
