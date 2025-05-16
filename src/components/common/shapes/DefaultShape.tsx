import React from "react";
import {
  BlockContainer,
  StyledCard,
  StyledCardContent,
} from "../c4BlockStyled";
import { ShapeProps } from "./BaseShape";
import BlockHeader from "./components/BlockHeader";
import BlockContent from "./components/BlockContent";

const DefaultShape: React.FC<ShapeProps> = ({
  item,
  selected,
  colorStyles,
  children,
  description,
  isClone,
  clonePath,
  title,
  isEditing,
  onEditStart,
  onEditFinish,
  onTitleChange,
  url,
  onEdit,
}) => {
  return (
    <BlockContainer sx={{ opacity: isClone ? 0.5 : 1 }}>
      <StyledCard
        colorstyles={colorStyles}
        selected={selected}
        data-has-description={description ? "true" : "false"}
        className="tech-card"
      >
        <StyledCardContent>
          <BlockHeader
            item={item}
            title={title}
            isEditing={isEditing}
            isClone={isClone}
            url={url}
            colorStyles={colorStyles}
            onEditStart={onEditStart}
            onEditFinish={onEditFinish}
            onTitleChange={onTitleChange}
            onEdit={onEdit}
          />

          <BlockContent
            description={description}
            isClone={isClone}
            clonePath={clonePath}
          >
            {children}
          </BlockContent>
        </StyledCardContent>
      </StyledCard>
    </BlockContainer>
  );
};

export default DefaultShape;
