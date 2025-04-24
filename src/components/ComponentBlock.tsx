import { Position } from "@xyflow/react";
import { memo } from "react";
import { COLORS } from "../data/colors";
import C4Block from "./common/C4Block";

export type ComponentBlockData = {
  name: string;
  description?: string;
  technology?: string;
  onEdit: () => void;
};

interface ComponentBlockProps {
  data: Record<string, unknown>;
  selected: boolean;
}

const ComponentBlock: React.FC<ComponentBlockProps> = memo(
  ({ data, selected }) => {
    const typedData = data as ComponentBlockData;

    return (
      <C4Block
        name={typedData.name}
        description={typedData.description}
        technology={typedData.technology}
        onEdit={typedData.onEdit}
        colors={COLORS.tertiary}
        selected={selected}
        handlePositions={{
          source: [Position.Right, Position.Bottom, Position.Top],
          target: [Position.Left, Position.Top, Position.Bottom],
        }}
      />
    );
  }
);

export default ComponentBlock;
