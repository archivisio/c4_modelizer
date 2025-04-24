import { Box } from "@mui/material";
import { Connection, Edge, Node, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CodeEditDialog from "./components/CodeEditDialog";
import ComponentEditDialog from "./components/ComponentEditDialog";
import ConnectionEditDialog from "./components/ConnectionEditDialog";
import ContainerEditDialog from "./components/ContainerEditDialog";
import ErrorNotification from "./components/ErrorNotification";
import {
  handleExportModel,
  handleImportModel,
} from "./components/FileOperations";
import FlowCanvas from "./components/FlowCanvas";
import NavBar from "./components/NavBar";
import SystemEditDialog from "./components/SystemEditDialog";
import Toolbar from "./components/Toolbar";
import "./i18n";
import { useC4Store } from "./store/c4Store";
import {
  CodeBlock,
  ComponentBlock,
  ContainerBlock,
  SystemBlock,
} from "./types/c4";
import { ConnectionInfo } from "./types/connection";

function App() {
  const {
    model,
    addSystem,
    updateSystem,
    removeSystem,
    connectSystems,
    addContainer,
    updateContainer,
    removeContainer,
    connectContainers,
    addComponent,
    updateComponent,
    removeComponent,
    connectComponents,
    addCodeElement,
    updateCodeElement,
    removeCodeElement,
    connectCodeElements,
    updateConnection,
    removeConnection,
    setActiveSystem,
    setActiveContainer,
    setActiveComponent,
    setModel,
  } = useC4Store();

  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] =
    useState<ConnectionInfo | null>(null);
  const { t } = useTranslation();

  const activeSystem = useMemo(
    () =>
      model.activeSystemId
        ? model.systems.find((s) => s.id === model.activeSystemId)
        : undefined,
    [model.activeSystemId, model.systems]
  );

  const activeContainer = useMemo(() => {
    if (!activeSystem || !model.activeContainerId || !activeSystem.containers)
      return undefined;
    return activeSystem.containers.find(
      (c) => c.id === model.activeContainerId
    );
  }, [activeSystem, model.activeContainerId]);

  const activeComponent = useMemo(() => {
    if (
      !activeContainer ||
      !model.activeComponentId ||
      !activeContainer.components
    )
      return undefined;
    return activeContainer.components.find(
      (c) => c.id === model.activeComponentId
    );
  }, [activeContainer, model.activeComponentId]);

  const systemNodes: Node[] = useMemo(
    () =>
      model.systems.map((sys) => ({
        id: sys.id,
        type: "system",
        position: sys.position,
        data: {
          name: sys.name,
          description: sys.description,
          onEdit: () => {
            setEditId(sys.id);
            setIsEditingContainer(false);
            setDialogOpen(true);
          },
        },
      })),
    [model.systems]
  );

  const containerNodes: Node[] = useMemo(() => {
    if (!activeSystem || !activeSystem.containers) return [];

    return activeSystem.containers.map((container) => ({
      id: container.id,
      type: "container",
      position: container.position,
      data: {
        name: container.name,
        description: container.description,
        technology: container.technology,
        onEdit: () => {
          setEditId(container.id);
          setIsEditingContainer(true);
          setDialogOpen(true);
        },
      },
    }));
  }, [activeSystem]);

  const componentNodes: Node[] = useMemo(() => {
    if (!activeContainer || !activeContainer.components) return [];

    return activeContainer.components.map((component) => ({
      id: component.id,
      type: "component",
      position: component.position,
      data: {
        name: component.name,
        description: component.description,
        technology: component.technology,
        onEdit: () => {
          setEditId(component.id);
          setIsEditingContainer(false);
          setDialogOpen(true);
        },
      },
    }));
  }, [activeContainer]);

  const codeNodes: Node[] = useMemo(() => {
    if (!activeComponent || !activeComponent.codeElements) return [];

    return activeComponent.codeElements.map((codeElement) => ({
      id: codeElement.id,
      type: "code",
      position: codeElement.position,
      data: {
        name: codeElement.name,
        description: codeElement.description,
        codeType: codeElement.codeType,
        language: codeElement.language,
        code: codeElement.code,
        onEdit: () => {
          setEditId(codeElement.id);
          setIsEditingContainer(false);
          setDialogOpen(true);
        },
      },
    }));
  }, [activeComponent]);

  const edges: Edge[] = useMemo(() => {
    if (model.viewLevel === "system") {
      return model.systems.flatMap((sys) =>
        sys.connections.map((conn) => ({
          id: `${sys.id}->${conn.targetId}`,
          source: sys.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: { technology: conn.technology, description: conn.description },
          type: conn.technology || conn.label ? "connection" : "default",
        }))
      );
    } else if (
      model.viewLevel === "container" &&
      activeSystem &&
      activeSystem.containers
    ) {
      return activeSystem.containers.flatMap((container) =>
        container.connections.map((conn) => ({
          id: `${container.id}->${conn.targetId}`,
          source: container.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: { technology: conn.technology, description: conn.description },
          type: conn.technology || conn.label ? "connection" : "default",
        }))
      );
    } else if (
      model.viewLevel === "component" &&
      activeContainer &&
      activeContainer.components
    ) {
      return activeContainer.components.flatMap((component) =>
        component.connections.map((conn) => ({
          id: `${component.id}->${conn.targetId}`,
          source: component.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: { technology: conn.technology, description: conn.description },
          type: conn.technology || conn.label ? "connection" : "default",
        }))
      );
    } else if (
      model.viewLevel === "code" &&
      activeComponent &&
      activeComponent.codeElements
    ) {
      return activeComponent.codeElements.flatMap((codeElement) =>
        codeElement.connections.map((conn) => ({
          id: `${codeElement.id}->${conn.targetId}`,
          source: codeElement.id,
          target: conn.targetId,
          sourceHandle: conn.sourceHandle,
          targetHandle: conn.targetHandle,
          label: conn.label,
          data: { technology: conn.technology, description: conn.description },
          type: conn.technology || conn.label ? "connection" : "default",
        }))
      );
    }
    return [];
  }, [
    model.systems,
    model.viewLevel,
    activeSystem,
    activeContainer,
    activeComponent,
  ]);

  const currentNodes = useMemo(() => {
    if (model.viewLevel === "system") return systemNodes;
    if (model.viewLevel === "container") return containerNodes;
    if (model.viewLevel === "component") return componentNodes;
    return codeNodes;
  }, [model.viewLevel, systemNodes, containerNodes, componentNodes, codeNodes]);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      if (source && target) {
        const connectionData = {
          targetId: target,
          sourceHandle,
          targetHandle,
        };

        if (model.viewLevel === "system") {
          connectSystems(source, connectionData);
        } else if (model.viewLevel === "container" && model.activeSystemId) {
          connectContainers(model.activeSystemId, source, connectionData);
        } else if (
          model.viewLevel === "component" &&
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
          model.viewLevel === "code" &&
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
        setEditingConnection(connectionInfo);
        setConnectionDialogOpen(true);
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
    ]
  );

  const handleAddElement = () => {
    if (model.viewLevel === "system") {
      addSystem({
        name: t("new_system"),
        description: "",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        connections: [],
      });
    } else if (model.viewLevel === "container" && model.activeSystemId) {
      addContainer(model.activeSystemId, {
        name: t("new_container"),
        description: "",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        connections: [],
      });
    } else if (
      model.viewLevel === "component" &&
      model.activeSystemId &&
      model.activeContainerId
    ) {
      addComponent(model.activeSystemId, model.activeContainerId, {
        name: t("new_component"),
        description: "",
        technology: "",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        connections: [],
      });
    } else if (
      model.viewLevel === "code" &&
      model.activeSystemId &&
      model.activeContainerId &&
      model.activeComponentId
    ) {
      addCodeElement(
        model.activeSystemId,
        model.activeContainerId,
        model.activeComponentId,
        {
          name: t("new_code_element"),
          description: "",
          codeType: "class",
          language: "",
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          },
          connections: [],
        }
      );
    }
  };

  const handleExport = () => {
    handleExportModel(model);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImportModel(file, setModel, setImportError);
  };

  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      if (model.viewLevel === "system") {
        setActiveSystem(nodeId);
      } else if (model.viewLevel === "container") {
        setActiveContainer(nodeId);
      } else if (model.viewLevel === "component") {
        setActiveComponent(nodeId);
      }
    },
    [model.viewLevel, setActiveSystem, setActiveContainer, setActiveComponent]
  );

  const handleNodePositionChange = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (model.viewLevel === "system") {
        updateSystem(id, { position });
      } else if (model.viewLevel === "container" && model.activeSystemId) {
        updateContainer(model.activeSystemId, id, { position });
      } else if (
        model.viewLevel === "component" &&
        model.activeSystemId &&
        model.activeContainerId
      ) {
        updateComponent(model.activeSystemId, model.activeContainerId, id, {
          position,
        });
      } else if (
        model.viewLevel === "code" &&
        model.activeSystemId &&
        model.activeContainerId &&
        model.activeComponentId
      ) {
        updateCodeElement(
          model.activeSystemId,
          model.activeContainerId,
          model.activeComponentId,
          id,
          { position }
        );
      }
    },
    [
      model.viewLevel,
      model.activeSystemId,
      model.activeContainerId,
      model.activeComponentId,
      updateSystem,
      updateContainer,
      updateComponent,
      updateCodeElement,
    ]
  );

  const editingElement = useMemo(() => {
    if (!editId) return null;

    if (
      model.viewLevel === "code" &&
      activeComponent &&
      activeComponent.codeElements
    ) {
      return activeComponent.codeElements.find((c) => c.id === editId) || null;
    } else if (
      model.viewLevel === "component" &&
      activeContainer &&
      activeContainer.components
    ) {
      return activeContainer.components.find((c) => c.id === editId) || null;
    } else if (isEditingContainer && activeSystem && activeSystem.containers) {
      return activeSystem.containers.find((c) => c.id === editId) || null;
    } else {
      return model.systems.find((s) => s.id === editId) || null;
    }
  }, [
    editId,
    isEditingContainer,
    model.viewLevel,
    model.systems,
    activeSystem,
    activeContainer,
    activeComponent,
  ]) as SystemBlock | ContainerBlock | ComponentBlock | CodeBlock | null;

  const handleDialogSave = (
    name: string,
    description: string,
    technology?: string,
    codeType?: "class" | "function" | "interface" | "variable" | "other",
    language?: string,
    code?: string
  ) => {
    if (editId) {
      if (
        model.viewLevel === "code" &&
        model.activeSystemId &&
        model.activeContainerId &&
        model.activeComponentId
      ) {
        updateCodeElement(
          model.activeSystemId,
          model.activeContainerId,
          model.activeComponentId,
          editId,
          {
            name,
            description,
            codeType: codeType || "other",
            language,
            code,
          }
        );
      } else if (
        model.viewLevel === "component" &&
        model.activeSystemId &&
        model.activeContainerId
      ) {
        updateComponent(model.activeSystemId, model.activeContainerId, editId, {
          name,
          description,
          technology,
        });
      } else if (isEditingContainer && model.activeSystemId) {
        updateContainer(model.activeSystemId, editId, {
          name,
          description,
          technology,
        });
      } else {
        updateSystem(editId, { name, description });
      }
    }
    setDialogOpen(false);
    setEditId(null);
  };

  const handleConnectionSave = useCallback(
    (connectionInfo: ConnectionInfo) => {
      const level = model.viewLevel;
      const systemId = model.activeSystemId || "";
      const data = {
        label: connectionInfo.label,
        technology: connectionInfo.technology,
        description: connectionInfo.description,
      };

      updateConnection(
        level,
        systemId,
        connectionInfo.sourceId,
        connectionInfo.targetId,
        data
      );
      setConnectionDialogOpen(false);
      setEditingConnection(null);
    },
    [model.viewLevel, model.activeSystemId, updateConnection]
  );

  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const connectionInfo: ConnectionInfo = {
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      label: edge.label as string | undefined,
      technology: edge.data?.technology as string | undefined,
      description: edge.data?.description as string | undefined,
    };
    setEditingConnection(connectionInfo);
    setConnectionDialogOpen(true);
  }, []);

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      if (model.viewLevel === "system") {
        removeSystem(nodeId);
      } else if (model.viewLevel === "container" && model.activeSystemId) {
        removeContainer(model.activeSystemId, nodeId);
      } else if (
        model.viewLevel === "component" &&
        model.activeSystemId &&
        model.activeContainerId
      ) {
        removeComponent(model.activeSystemId, model.activeContainerId, nodeId);
      } else if (
        model.viewLevel === "code" &&
        model.activeSystemId &&
        model.activeContainerId &&
        model.activeComponentId
      ) {
        removeCodeElement(
          model.activeSystemId,
          model.activeContainerId,
          model.activeComponentId,
          nodeId
        );
      }
    },
    [
      model.viewLevel,
      model.activeSystemId,
      model.activeContainerId,
      model.activeComponentId,
      removeSystem,
      removeContainer,
      removeComponent,
      removeCodeElement,
    ]
  );

  const handleEdgeDelete = useCallback(
    (edge: Edge) => {
      const sourceId = edge.source;
      const targetId = edge.target;
      const level = model.viewLevel as
        | "system"
        | "container"
        | "component"
        | "code";
      const systemId = model.activeSystemId || "";

      removeConnection(level, systemId, sourceId, targetId);
    },
    [model.viewLevel, model.activeSystemId, removeConnection]
  );

  return (
    <ReactFlowProvider>
      <Box sx={{ height: "100vh", bgcolor: "#0a1929", color: "#fff" }}>
        <Toolbar
          onAddSystem={handleAddElement}
          onExport={handleExport}
          onImport={handleImport}
        />

        <NavBar
          systemName={activeSystem?.name}
          containerName={activeContainer?.name}
          componentName={activeComponent?.name}
        />

        <FlowCanvas
          nodes={currentNodes}
          edges={edges}
          onConnect={onConnect}
          onNodePositionChange={handleNodePositionChange}
          viewLevel={model.viewLevel}
          onNodeDoubleClick={handleNodeDoubleClick}
          onEdgeClick={handleEdgeClick}
          onNodeDelete={handleNodeDelete}
          onEdgeDelete={handleEdgeDelete}
        />

        {model.viewLevel === "system" && editingElement && (
          <SystemEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            onSave={(name, description) => {
              handleDialogSave(name, description);
            }}
            onClose={() => {
              setDialogOpen(false);
              setEditId(null);
            }}
          />
        )}

        {isEditingContainer && editingElement && (
          <ContainerEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialTechnology={
              (editingElement as ContainerBlock).technology || ""
            }
            onSave={(name, description, technology) => {
              handleDialogSave(name, description, technology);
            }}
            onClose={() => {
              setDialogOpen(false);
              setEditId(null);
            }}
          />
        )}

        {model.viewLevel === "component" && editingElement && (
          <ComponentEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialTechnology={
              (editingElement as ComponentBlock).technology || ""
            }
            onSave={(name, description, technology) => {
              handleDialogSave(name, description, technology);
            }}
            onClose={() => {
              setDialogOpen(false);
              setEditId(null);
            }}
          />
        )}

        {model.viewLevel === "code" && editingElement && (
          <CodeEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialCodeType={(editingElement as CodeBlock).codeType || "class"}
            initialLanguage={(editingElement as CodeBlock).language || ""}
            initialCode={(editingElement as CodeBlock).code || ""}
            onSave={(name, description, codeType, language, code) => {
              handleDialogSave(
                name,
                description,
                undefined,
                codeType,
                language,
                code
              );
            }}
            onClose={() => {
              setDialogOpen(false);
              setEditId(null);
            }}
          />
        )}

        <ErrorNotification message={importError} />

        {/* Dialog d'édition de connexion */}
        {connectionDialogOpen && (
          <ConnectionEditDialog
            open={connectionDialogOpen}
            connection={editingConnection}
            onClose={() => {
              setConnectionDialogOpen(false);
              setEditingConnection(null);
            }}
            onSave={handleConnectionSave}
          />
        )}
      </Box>
    </ReactFlowProvider>
  );
}

export default App;
