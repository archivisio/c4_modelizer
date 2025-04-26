export type Position = { x: number; y: number };

export interface BaseBlock {
  id: string;
  name: string;
  description?: string;
  url?: string;
  position: Position;
}

import { ConnectionData } from './connection';




export interface SystemBlock extends BaseBlock {
  technology?: string;
  connections: ConnectionData[];
  containers?: ContainerBlock[];
}

export interface ContainerBlock extends BaseBlock {
  systemId: string;
  connections: ConnectionData[];
  technology?: string;
  components?: ComponentBlock[];
}

export interface ComponentBlock extends BaseBlock {
  containerId: string;
  systemId: string;
  connections: ConnectionData[];
  technology?: string;
  codeElements?: CodeBlock[];
}

export interface CodeBlock extends BaseBlock {
  componentId: string;
  containerId: string;
  systemId: string;
  codeType: 'class' | 'function' | 'interface' | 'variable' | 'other';
  language?: string;
  code?: string;
  connections: ConnectionData[];
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
