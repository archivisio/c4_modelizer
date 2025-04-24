export type Position = { x: number; y: number };

export interface BaseBlock {
  id: string;
  name: string;
  description?: string;
  position: Position;
}

import { ConnectionData } from './connection';


export type SystemType =
  | 'web_application'
  | 'mobile_application'
  | 'public_api'
  | 'microservices'
  | 'enterprise_information_system'
  | 'data_management_system'
  | 'notification_or_messaging_system'
  | 'payment_system'
  | 'authentication_and_authorization_system'
  | 'external_system'
  | 'desktop_application'
  | 'iot_or_embedded_system'
  | 'batch_or_async_processing_system'
  | 'monitoring_and_observability_system'
  | 'security_system';

export interface SystemBlock extends BaseBlock {
  systemType: SystemType;
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
