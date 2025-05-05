import { useDialogs } from '@contexts/DialogContext';
import { ConnectionInfo } from '@interfaces/connection';
import { useC4Store } from '@store/c4Store';
import { Connection, Edge } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

export function useEdges() {
  const {
    model,
    connectSystems,
    connectContainers,
    connectComponents,
    connectCodeElements,
    updateConnection,
    removeConnection
  } = useC4Store();

  const { openConnectionDialog, closeConnectionDialog } = useDialogs();

  const edges: Edge[] = useMemo(() => {
    const { viewLevel, systems, activeSystemId } = model;

    const activeSystem = activeSystemId
      ? systems.find(s => s.id === activeSystemId)
      : undefined;

    const activeContainer = activeSystem?.containers?.find(
      c => c.id === model.activeContainerId
    );

    const activeComponent = activeContainer?.components?.find(
      c => c.id === model.activeComponentId
    );

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
        }))
      );
    } else if (viewLevel === 'container' && activeSystem?.containers) {
      return activeSystem.containers.flatMap((container) =>
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
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    } else if (viewLevel === 'component' && activeContainer?.components) {
      return activeContainer.components.flatMap((component) =>
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
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    } else if (viewLevel === 'code' && activeComponent?.codeElements) {
      return activeComponent.codeElements.flatMap((codeElement) =>
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
          type: conn.technology || conn.label ? 'technology' : 'default',
        }))
      );
    }
    return [];
  }, [model]);

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
        } else if (model.viewLevel === 'container' && model.activeSystemId) {
          connectContainers(model.activeSystemId, source, connectionData);
        } else if (
          model.viewLevel === 'component' &&
          model.activeSystemId &&
          model.activeContainerId
        ) {
          connectComponents(
            model.activeSystemId,
            model.activeContainerId,
            source,
            connectionData
          );
        } else if (
          model.viewLevel === 'code' &&
          model.activeSystemId &&
          model.activeContainerId &&
          model.activeComponentId
        ) {
          connectCodeElements(
            model.activeSystemId,
            model.activeContainerId,
            model.activeComponentId,
            source,
            connectionData
          );
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
      model.activeSystemId,
      model.activeContainerId,
      model.activeComponentId,
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
      const systemId = model.activeSystemId || '';
      const data = {
        label: connectionInfo.label,
        technology: connectionInfo.technology,
        description: connectionInfo.description,
        labelPosition: connectionInfo.labelPosition,
        bidirectional: connectionInfo.bidirectional,
      };

      updateConnection(
        level,
        systemId,
        connectionInfo.sourceId,
        connectionInfo.targetId,
        data
      );

      closeConnectionDialog();
    },
    [model.viewLevel, model.activeSystemId, updateConnection, closeConnectionDialog]
  );

  const handleConnectionDelete = useCallback(
    (connectionInfo: ConnectionInfo) => {
      if (connectionInfo) {
        const level = model.viewLevel;
        const systemId = model.activeSystemId || '';
        removeConnection(
          level,
          systemId,
          connectionInfo.sourceId,
          connectionInfo.targetId
        );
      }
    },
    [model.viewLevel, model.activeSystemId, removeConnection]
  );

  return {
    edges,
    onConnect,
    handleEdgeClick,
    handleConnectionSave,
    handleConnectionDelete
  };
}
