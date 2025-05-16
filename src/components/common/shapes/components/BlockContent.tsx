import React from "react";
import { DescriptionText, PathText } from "../../c4BlockStyled";

interface BlockContentProps {
  description?: string;
  isClone: boolean;
  clonePath?: string;
  children?: React.ReactNode;
}

const BlockContent: React.FC<BlockContentProps> = ({
  description,
  isClone,
  clonePath,
  children,
}) => {
  return (
    <>
      {description && (
        <DescriptionText variant="body2">{description}</DescriptionText>
      )}

      {children}

      {isClone && clonePath && (
        <PathText variant="caption">{clonePath}</PathText>
      )}
    </>
  );
};

export default BlockContent;
