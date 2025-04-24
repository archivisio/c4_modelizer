import { Position } from "@xyflow/react";
import { memo } from "react";
import C4Block from "./common/C4Block";

export type CodeBlockData = {
  name: string;
  description?: string;
  codeType: "class" | "function" | "interface" | "variable" | "other";
  language?: string;
  code?: string;
  onEdit: () => void;
};

interface CodeBlockProps {
  data: Record<string, unknown>;
  selected: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ data, selected }) => {
  const typedData = data as CodeBlockData;

  const getVariantFromCodeType = () => {
    switch (typedData.codeType) {
      case "class":
        return "quaternary";
      case "function":
        return "secondary";
      case "interface":
        return "tertiary";
      case "variable":
        return "primary";
      default:
        return "quaternary";
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
        target: [Position.Left, Position.Top, Position.Bottom],
      }}
    />
  );
});

export default CodeBlock;
