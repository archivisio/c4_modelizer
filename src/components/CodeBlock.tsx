import { memo } from 'react';
import { Position } from 'reactflow';
import C4Block from './common/C4Block';

interface CodeBlockProps {
  data: {
    name: string;
    description?: string;
    codeType: 'class' | 'function' | 'interface' | 'variable' | 'other';
    language?: string;
    code?: string;
    onEdit: () => void;
  };
  selected: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ data, selected }) => {
  // Determine the variant based on the code type
  const getVariantFromCodeType = () => {
    switch (data.codeType) {
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
      name={data.name}
      description={data.description}
      technology={data.language}
      onEdit={data.onEdit}
      type="code"
      codeType={data.codeType}
      code={data.code}
      variant={getVariantFromCodeType()}
      selected={selected}
      handlePositions={{ source: Position.Bottom, target: Position.Top }}
    />
  );
});

export default CodeBlock;
