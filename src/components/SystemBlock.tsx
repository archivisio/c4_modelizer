import { Position } from "@xyflow/react";
import C4Block from "./common/C4Block";

export type SystemBlockData = {
  name: string;
  description?: string;
  onEdit: () => void;
  systemType?: string;
};

type NodeProps = {
  data: Record<string, unknown>;
};

import { getSystemTypeIcon } from "./SystemTypeIcon";

export default function SystemBlock({ data }: NodeProps) {
  const typedData = data as SystemBlockData;

  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      onEdit={typedData.onEdit}
      variant="primary"
      handlePositions={{
        source: [Position.Right, Position.Bottom, Position.Top],
        target: [Position.Left, Position.Top, Position.Bottom],
      }}
    >
      {typedData.systemType && (
        <span style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          {getSystemTypeIcon(typedData.systemType)}
          <span style={{ fontSize: 12, color: "#fff", opacity: 0.85 }}>
            {typedData.systemType.replace(/_/g, " ")}
          </span>
        </span>
      )}
    </C4Block>
  );
}
