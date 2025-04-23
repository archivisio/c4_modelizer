import { NodeProps, Position } from 'reactflow';
import C4Block from './common/C4Block';

export type SystemBlockData = {
  name: string;
  description?: string;
  onEdit: () => void;
};

export default function SystemBlock({ data }: NodeProps<SystemBlockData>) {
  return (
    <C4Block
      name={data.name}
      description={data.description}
      onEdit={data.onEdit}
      type="system"
      variant="primary"
      handlePositions={{ source: Position.Right, target: Position.Left }}
    />
  );
}
