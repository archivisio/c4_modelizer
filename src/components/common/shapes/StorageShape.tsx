import React from "react";
import {
  BlockContainer,
  StyledCardContent,
} from "../c4BlockStyled";
import { ShapeProps } from "./BaseShape";
import BlockHeader from "./components/BlockHeader";
import BlockContent from "./components/BlockContent";
import { StorageIcon } from "./components/ShapeIcons";
import { StorageCard } from "./components/ShapeStyles";

const StorageShape: React.FC<ShapeProps> = ({
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
      <StorageCard
        colorstyles={colorStyles}
        selected={selected}
        data-has-description={description ? "true" : "false"}
        className="tech-card storage-shape"
      >
        <StyledCardContent>
          <StorageIcon colorStyles={colorStyles} />
          
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
      </StorageCard>
    </BlockContainer>
  );
};

export default StorageShape;
