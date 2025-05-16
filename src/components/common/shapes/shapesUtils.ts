import { Position } from '@xyflow/react';
import { ShapeComponent, ShapeType } from './BaseShape';
import DatabaseShape from './DatabaseShape';
import DefaultShape from './DefaultShape';
import StorageShape from './StorageShape';
import UserShape from './UserShape';

const ShapesRegistry: Record<ShapeType, ShapeComponent> = {
  default: {
    Component: DefaultShape,
    handlePositions: { source: Position.Bottom, target: Position.Top },
  },
  user: {
    Component: UserShape,
    handlePositions: { source: Position.Bottom, target: Position.Top },
  },
  database: {
    Component: DatabaseShape,
    handlePositions: { source: [Position.Left, Position.Right], target: Position.Top },
  },
  storage: {
    Component: StorageShape,
    handlePositions: { source: Position.Bottom, target: [Position.Left, Position.Top, Position.Right] },
  },
};

export const getShapeByType = (type: ShapeType): ShapeComponent => {
  return ShapesRegistry[type] || ShapesRegistry.default;
};

export default ShapesRegistry;
