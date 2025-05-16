import { ColorStyle } from "@/theme/theme";
import { BaseBlock } from "@/types/c4";
import React from "react";
import { HandlePositions } from "../C4Block";

export interface ShapeProps {
  item: BaseBlock;
  selected: boolean;
  colorStyles: ColorStyle;
  children?: React.ReactNode;
  description?: string;
  isClone: boolean;
  clonePath?: string;
  title: string;
  isEditing: boolean;
  onEditStart: () => void;
  onEditFinish: (save: boolean) => void;
  onTitleChange: (newTitle: string) => void;
  url?: string;
  onEdit?: () => void;
}

export interface ShapeComponent {
  Component: React.FC<ShapeProps>;
  handlePositions: HandlePositions;
}

export type ShapeType = "default" | "user" | "database" | "storage";

export interface ShapesRegistry {
  [key: string]: ShapeComponent;
}
