import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock, ViewLevel } from './c4';
import { ConnectionData } from './connection';

export interface FlatSystemBlock extends SystemBlock {
  connections: ConnectionData[];
}

export interface FlatContainerBlock extends Omit<ContainerBlock, 'components'> {
  connections: ConnectionData[];
}

export interface FlatComponentBlock extends Omit<ComponentBlock, 'codeElements'> {
  connections: ConnectionData[];
}

export interface FlatCodeBlock extends CodeBlock {
  connections: ConnectionData[];
}

export interface FlatC4Model {
  systems: FlatSystemBlock[];
  containers: FlatContainerBlock[];
  components: FlatComponentBlock[];
  codeElements: FlatCodeBlock[];
  viewLevel: ViewLevel;
  activeSystemId?: string;
  activeContainerId?: string;
  activeComponentId?: string;
}
