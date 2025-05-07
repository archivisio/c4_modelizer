export type Position = { x: number; y: number };

export interface BaseBlock {
  id: string;
  name: string;
  description?: string;
  url?: string;
  position: Position;
  type: 'system' | 'container' | 'component' | 'code';
  technology?: string;
}

import { ConnectionData } from './connection';

export interface SystemBlock extends BaseBlock {
  connections: ConnectionData[];
  containers?: ContainerBlock[];
  type: 'system';
}

export interface ContainerBlock extends BaseBlock {
  systemId: string;
  connections: ConnectionData[];
  components?: ComponentBlock[];
  type: 'container';
}

export interface ComponentBlock extends BaseBlock {
  containerId: string;
  systemId: string;
  connections: ConnectionData[];
  codeElements?: CodeBlock[];
  type: 'component';
}

export interface CodeBlock extends BaseBlock {
  componentId: string;
  containerId: string;
  systemId: string;
  codeType: 'class' | 'function' | 'interface' | 'variable' | 'other';
  code?: string;
  connections: ConnectionData[];
  type: 'code';
}

export interface NodeData<T extends BaseBlock> {
  data: {
    onEdit: () => void;
  } & T;
  selected: boolean;
}

export type TechnologyLevel = 'system' | 'container' | 'component' | 'code' | 'connection';

export type ViewLevel = 'system' | 'container' | 'component' | 'code';

export type C4Model = {
  systems: SystemBlock[];
  activeSystemId?: string;
  activeContainerId?: string;
  activeComponentId?: string;
  viewLevel: ViewLevel;
};
