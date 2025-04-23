import { Position } from '@xyflow/react';
import { memo } from 'react';
import C4Block from './common/C4Block';

// Définition des données spécifiques au code
export type CodeBlockData = {
  name: string;
  description?: string;
  codeType: 'class' | 'function' | 'interface' | 'variable' | 'other';
  language?: string;
  code?: string;
  onEdit: () => void;
};

// Interface pour les props que ReactFlow v12 passe au composant
interface CodeBlockProps {
  data: Record<string, unknown>; // Record<string, unknown> au lieu de any
  selected: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ data, selected }) => {
  // Typage explicite pour ReactFlow v12
  const typedData = data as CodeBlockData;
  
  // Determine the variant based on the code type
  const getVariantFromCodeType = () => {
    switch (typedData.codeType) {
      case 'class':
        return 'quaternary'; // Purple variant
      case 'function':
        return 'secondary'; // Green variant
      case 'interface':
        return 'tertiary'; // Yellow variant
      case 'variable':
        return 'primary'; // Blue variant
      default:
        return 'quaternary'; // Default is purple
    }
  };

  return (
    <C4Block
      name={typedData.name}
      description={typedData.description}
      technology={typedData.language}
      onEdit={typedData.onEdit}
      type="code"
      codeType={typedData.codeType}
      code={typedData.code}
      variant={getVariantFromCodeType()}
      selected={selected}
      handlePositions={{ 
        source: [Position.Right, Position.Bottom, Position.Top], 
        target: [Position.Left, Position.Top, Position.Bottom] 
      }}
    />
  );
});

export default CodeBlock;
