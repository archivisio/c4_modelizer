import { getTechnologyById } from "@/data/technologies";
import { useClonePath } from "@/hooks/useClonePath";
import { useFlatModelActions } from "@/hooks/useFlatModelActions";
import { ColorStyle } from "@/theme/theme";
import { BaseBlock } from "@/types/c4";
import { useTheme } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { hexToRgb } from "./c4BlockStyled";
import { getShapeByType } from "./shapes/shapesUtils";
import { ShapeType } from "./shapes/BaseShape";

export type HandlePositions = {
  source: Position | Position[];
  target: Position | Position[];
};

export interface C4BlockProps {
  item: BaseBlock;
  selected?: boolean;
  onEdit: () => void;
  colors: ColorStyle;
  handlePositions?: HandlePositions;
  children?: React.ReactNode;
}

const createHandleStyle = (colorStyles: ColorStyle, isSource = false) => ({
  background: colorStyles.border,
  border: `2px solid ${colorStyles.border}`,
  width: 6,
  height: 6,
  ...(isSource && { boxShadow: `0 0 5px ${colorStyles.border}` }),
});

const C4Block: React.FC<C4BlockProps> = ({
  item,
  selected = false,
  onEdit,
  colors,
  handlePositions: customHandlePositions,
  children,
}) => {
  const theme = useTheme();
  const { technology, name, description, url, shape } = item;
  const techData = technology ? getTechnologyById(technology) : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const { handleElementSave } = useFlatModelActions();
  const [title, setTitle] = useState(name);
  const clonePath = useClonePath(item);
  const isClone = !!item.original;
  const defaultColorStyle = colors;
  const colorStyles: ColorStyle = techData
    ? {
        ...theme.c4Colors.system,
        background: `rgba(${hexToRgb(techData.color)}, 0.1)`,
        gradient: `linear-gradient(135deg, rgba(${hexToRgb(
          techData.color
        )}, 0.15) 0%, rgba(${hexToRgb(techData.color)}, 0.05) 100%)`,
        gradientHover: `linear-gradient(135deg, rgba(${hexToRgb(
          techData.color
        )}, 0.25) 0%, rgba(${hexToRgb(techData.color)}, 0.15) 100%)`,
        border: techData.color,
        hover: techData.color,
        glow: `0 0 15px rgba(${hexToRgb(techData.color)}, 0.3)`,
      }
    : defaultColorStyle;

  // Determine the shape to use based on the item's shape property or technology shape
  const shapeType = (shape || (techData?.shape) || 'default') as ShapeType;
  const { Component: ShapeComponent, handlePositions: defaultHandlePositions } = getShapeByType(shapeType);
  const handlePositions = customHandlePositions || defaultHandlePositions;
  
  const onTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const onEditStart = () => {
    setIsEditing(true);
  };

  const onEditFinish = (save: boolean) => {
    if (save) {
      handleElementSave(item.id, { ...item, name: title });
    } else {
      setTitle(name);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    setTitle(name);
  }, [name]);

  return (
    <>
      {Array.isArray(handlePositions.target) ? (
        handlePositions.target.map((position: Position, index: number) => (
          <Handle
            key={`target-${index}`}
            type="target"
            position={position}
            data-testid={`target-${position}-${index}`}
            id={`target-${position}-${index}`}
            style={createHandleStyle(colorStyles)}
          />
        ))
      ) : (
        <Handle
          type="target"
          position={handlePositions.target}
          data-testid={`target-${handlePositions.target}`}
          id={`target-${handlePositions.target}`}
          style={createHandleStyle(colorStyles)}
        />
      )}

      <ShapeComponent
        item={item}
        selected={selected}
        colorStyles={colorStyles}
        description={description}
        isClone={isClone}
        clonePath={clonePath || undefined}
        title={title}
        isEditing={isEditing}
        onEditStart={onEditStart}
        onEditFinish={onEditFinish}
        onTitleChange={onTitleChange}
        url={url}
        onEdit={onEdit}
      >
        {children}
      </ShapeComponent>

      {Array.isArray(handlePositions.source) ? (
        handlePositions.source.map((position: Position, index: number) => (
          <Handle
            key={`source-${index}`}
            type="source"
            position={position}
            data-testid={`source-${position}-${index}`}
            id={`source-${position}-${index}`}
            style={createHandleStyle(colorStyles, true)}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={handlePositions.source}
          id={`source-${handlePositions.source}`}
          data-testid={`source-${handlePositions.source}`}
          style={createHandleStyle(colorStyles, true)}
        />
      )}
    </>
  );
};

export default C4Block;
