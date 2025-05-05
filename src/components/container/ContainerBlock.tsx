import C4Block from "@components/common/C4Block";
import { COLORS } from "@data/colors";
import { Position } from "@xyflow/react";
import { memo } from "react";

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
          source: [Position.Right, Position.Bottom, Position.Left, Position.Top],
          target: [Position.Left, Position.Top, Position.Bottom, Position.Right],
        }}
        selected={selected}
      />
    );
  }
);

export default ContainerBlock;
