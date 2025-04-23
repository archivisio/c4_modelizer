import { memo } from 'react';
import { Position } from 'reactflow';
import C4Block from './common/C4Block';

interface ContainerBlockProps {
  data: {
    name: string;
    description?: string;
    technology?: string;
    onEdit: () => void;
  };
  selected: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = memo(({ data, selected }) => {
  return (
    <C4Block
      name={data.name}
      description={data.description}
      technology={data.technology}
      onEdit={data.onEdit}
      type="container"
      variant="secondary"
      selected={selected}
      handlePositions={{ source: Position.Bottom, target: Position.Top }}
    />
  );
});

export default ContainerBlock;
