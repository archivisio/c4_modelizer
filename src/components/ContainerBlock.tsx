import { Position } from '@xyflow/react';
import { memo } from 'react';
import C4Block from './common/C4Block';

// Définition des données spécifiques au container
export type ContainerBlockData = {
  name: string;
  description?: string;
  technology?: string;
  onEdit: () => void;
};

// Interface pour les props que ReactFlow v12 passe au composant
interface ContainerBlockProps {
  data: Record<string, unknown>; // Utilisation de Record au lieu de any pour u00e9viter les erreurs de linting
  selected: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = memo(({ data, selected }) => {
  // Typage explicite pour ReactFlow v12
  const typedData = data as ContainerBlockData;
  
  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      onEdit={typedData.onEdit}
      type="container"
      variant="secondary"
      technology={typedData.technology}
      handlePositions={{ 
        source: [Position.Right, Position.Bottom, Position.Top], 
        target: [Position.Left, Position.Top, Position.Bottom] 
      }}
      selected={selected}
    />
  );
});

export default ContainerBlock;
