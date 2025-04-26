import { Position } from "@xyflow/react";
import { COLORS } from "../data/colors";
import C4Block from "./common/C4Block";

export type SystemBlockData = {
  name: string;
  description?: string;
  onEdit: () => void;
  technology?: string;
  url?: string;
};

type NodeProps = {
  data: Record<string, unknown>;
};

export default function SystemBlock({ data }: NodeProps) {
  const typedData = data as SystemBlockData;

  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      onEdit={typedData.onEdit}
      colors={COLORS.primary}
      technology={typedData.technology}
      url={typedData.url}
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom],
      }}
    />
  );
}
