import { Position } from '@xyflow/react';
import C4Block from './common/C4Block';

export type SystemBlockData = {
  name: string;
  description?: string;
  onEdit: () => void;
};

// Interface simplifu00e9e pour u00e9viter les problèmes de typage avec ReactFlow v12
type NodeProps = {
  data: Record<string, unknown>;
}

export default function SystemBlock({ data }: NodeProps) {
  // Typage explicite du data pour ReactFlow v12
  const typedData = data as SystemBlockData;
  
  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      onEdit={typedData.onEdit}
      type="system"
      variant="primary"
      handlePositions={{ 
        source: [Position.Right, Position.Bottom, Position.Top], 
        target: [Position.Left, Position.Top, Position.Bottom] 
      }}
    />
  );
}
