import { getTechnologyById } from '@/data/technologies';
import { useDialogs } from '@contexts/DialogContext';
import { useFilteredEntities, useFlatC4Store } from '@store/flatC4Store';
import { Connection, Edge, MarkerType } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import { ConnectionInfo } from '../types/connection';

const markerStart = (technologyId: string | undefined) => {
  const technology = getTechnologyById(technologyId as string);
  return {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: technology?.color,
  };
}

const markerEnd = (technologyId: string | undefined) => {
  const technology = getTechnologyById(technologyId as string);
  return {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: technology?.color,
  };
}

export function useFlatEdges() {
  const {
    model,
    connectSystems,
    connectContainers,
    connectComponents,
    connectCodeElements,
    updateConnection,
    removeConnection
  } = useFlatC4Store();

  const { containers, components, codeElements } = useFilteredEntities();
  const { openConnectionDialog, closeConnectionDialog } = useDialogs();

  const edges: Edge[] = useMemo(() => {
    const { viewLevel, systems } = model;

    if (viewLevel === 'system') {
      return systems.flatMap((sys) =>
        sys.connections.map((conn) => ({
          id: `${sys.id}->${conn.targetId}`,
          source: sys.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: {
            technology: conn.technology,
            description: conn.description,
            labelPosition: conn.labelPosition,
            bidirectional: conn.bidirectional,
          },
          type: conn.technology || conn.label ? 'technology' : 'default',
          markerStart: markerStart(conn.technology),
          markerEnd: markerEnd(conn.technology),
        }))
      );
    } else if (viewLevel === 'container') {
      return containers.flatMap((container) =>
        container.connections.map((conn) => ({
          id: `${container.id}->${conn.targetId}`,
          source: container.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: {
            technology: conn.technology,
            description: conn.description,
            labelPosition: conn.labelPosition,
            bidirectional: conn.bidirectional,
          },
          markerStart: markerStart(conn.technology),
          markerEnd: markerEnd(conn.technology),
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    } else if (viewLevel === 'component') {
      return components.flatMap((component) =>
        component.connections.map((conn) => ({
          id: `${component.id}->${conn.targetId}`,
          source: component.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: {
            technology: conn.technology,
            description: conn.description,
            labelPosition: conn.labelPosition,
            bidirectional: conn.bidirectional,
          },
          markerStart: markerStart(conn.technology),
          markerEnd: markerEnd(conn.technology),
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    } else if (viewLevel === 'code') {
      return codeElements.flatMap((codeElement) =>
        codeElement.connections.map((conn) => ({
          id: `${codeElement.id}->${conn.targetId}`,
          source: codeElement.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: {
            technology: conn.technology,
            description: conn.description,
            labelPosition: conn.labelPosition,
            bidirectional: conn.bidirectional,
          },
          markerStart: markerStart(conn.technology),
          markerEnd: markerEnd(conn.technology),
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    }
    return [];
  }, [model, containers, components, codeElements]);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      if (source && target) {
        const connectionData = {
          targetId: target,
          sourceHandle,
          targetHandle,
        };

        if (model.viewLevel === 'system') {
          connectSystems(source, connectionData);
        } else if (model.viewLevel === 'container') {
          connectContainers(source, connectionData);
        } else if (model.viewLevel === 'component') {
          connectComponents(source, connectionData);
        } else if (model.viewLevel === 'code') {
          connectCodeElements(source, connectionData);
        }

        const edgeId = `${source}->${target}`;
        const connectionInfo: ConnectionInfo = {
          id: edgeId,
          sourceId: source,
          targetId: target,
          sourceHandle,
          targetHandle,
        };
        openConnectionDialog(connectionInfo);
      }
    },
    [
      model.viewLevel,
      connectSystems,
      connectContainers,
      connectComponents,
      connectCodeElements,
      openConnectionDialog
    ]
  );

  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const connectionInfo: ConnectionInfo = {
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      label: edge.label as string | undefined,
      technology: edge.data?.technology as string | undefined,
      description: edge.data?.description as string | undefined,
      labelPosition: edge.data?.labelPosition as number | undefined,
      bidirectional: edge.data?.bidirectional as boolean | undefined,
    };

    openConnectionDialog(connectionInfo);
  }, [openConnectionDialog]);

  const handleConnectionSave = useCallback(
    (connectionInfo: ConnectionInfo) => {
      const level = model.viewLevel;
      const data = {
        label: connectionInfo.label,
        technology: connectionInfo.technology,
        description: connectionInfo.description,
        labelPosition: connectionInfo.labelPosition,
        bidirectional: connectionInfo.bidirectional,
      };

      updateConnection(
        level,
        connectionInfo.sourceId,
        connectionInfo.targetId,
        data
      );

      closeConnectionDialog();
    },
    [model.viewLevel, updateConnection, closeConnectionDialog]
  );

  const handleConnectionDelete = useCallback(
    (connectionInfo: ConnectionInfo) => {
      if (connectionInfo) {
        const level = model.viewLevel;
        removeConnection(
          level,
          connectionInfo.sourceId,
          connectionInfo.targetId
        );
      }
    },
    [model.viewLevel, removeConnection]
  );

  return {
    edges,
    onConnect,
    handleEdgeClick,
    handleConnectionSave,
    handleConnectionDelete
  };
}
