import { Position } from '@xyflow/react';
import { memo } from 'react';
import C4Block from './common/C4Block';

// Définition des données spécifiques au component
export type ComponentBlockData = {
  name: string;
  description?: string;
  technology?: string;
  onEdit: () => void;
};

// Interface pour les props que ReactFlow v12 passe au composant
interface ComponentBlockProps {
  data: Record<string, unknown>; // Record<string, unknown> au lieu de any pour éviter les linting errors
  selected: boolean;
}

const ComponentBlock: React.FC<ComponentBlockProps> = memo(({ data, selected }) => {
  // Typage explicite pour ReactFlow v12
  const typedData = data as ComponentBlockData;
  
  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      technology={typedData.technology}
      onEdit={typedData.onEdit}
      type="component"
      variant="tertiary"
      selected={selected}
      handlePositions={{ 
        source: [Position.Right, Position.Bottom, Position.Top], 
        target: [Position.Left, Position.Top, Position.Bottom] 
      }}
    />
  );
});

export default ComponentBlock;
