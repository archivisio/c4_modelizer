import { Position } from "@xyflow/react";
import { memo } from "react";
import { COLORS } from "../data/colors";
import C4Block from "./common/C4Block";

export type ContainerBlockData = {
  name: string;
  description?: string;
  technology?: string;
  url?: string;
  onEdit: () => void;
};

interface ContainerBlockProps {
  data: Record<string, unknown>;
  selected: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = memo(
  ({ data, selected }) => {
    const typedData = data as ContainerBlockData;

    return (
      <C4Block
        name={typedData.name}
        description={typedData.description}
        onEdit={typedData.onEdit}
        colors={COLORS.secondary}
        technology={typedData.technology}
        url={typedData.url}
        handlePositions={{
          source: [Position.Right, Position.Bottom, Position.Top],
          target: [Position.Left, Position.Top, Position.Bottom],
        }}
        selected={selected}
      />
    );
  }
);

export default ContainerBlock;
