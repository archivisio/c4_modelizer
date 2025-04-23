import { Box } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Connection, Edge, Node, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import ErrorNotification from './components/ErrorNotification';
import { handleExportModel, handleImportModel } from './components/FileOperations';
import FlowCanvas from './components/FlowCanvas';
import NavBar from './components/NavBar';
import SystemEditDialog from './components/SystemEditDialog';
import Toolbar from './components/Toolbar';
import './i18n';
import { useC4Store } from './store/c4Store';




function App() {
  const { 
    model, 
    addSystem, 
    updateSystem, 
    connectSystems, 
    addContainer,
    updateContainer,
    connectContainers,
    addComponent,
    updateComponent,
    connectComponents,
    setActiveSystem,
    setActiveContainer,
    setModel 
  } = useC4Store();
  
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Get current active system and container
  const activeSystem = useMemo(
    () => model.activeSystemId ? model.systems.find(s => s.id === model.activeSystemId) : undefined,
    [model.activeSystemId, model.systems]
  );

  const activeContainer = useMemo(() => {
    if (!activeSystem || !model.activeContainerId || !activeSystem.containers) return undefined;
    return activeSystem.containers.find(c => c.id === model.activeContainerId);
  }, [activeSystem, model.activeContainerId]);

  // Convert systems to React Flow nodes for system level view
  const systemNodes: Node[] = useMemo(
    () =>
      model.systems.map((sys) => ({
        id: sys.id,
        type: 'system',
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

  // Convert containers to React Flow nodes for container level view
  const containerNodes: Node[] = useMemo(
    () => {
      if (!activeSystem || !activeSystem.containers) return [];
      
      return activeSystem.containers.map((container) => ({
        id: container.id,
        type: 'container',
        position: container.position,
        data: {
          name: container.name,
          description: container.description,
          onEdit: () => {
            setEditId(container.id);
            setIsEditingContainer(true);
            setDialogOpen(true);
          },
        },
      }));
    },
    [activeSystem]
  );

  // Convert components to React Flow nodes for component level view
  const componentNodes: Node[] = useMemo(
    () => {
      if (!activeContainer || !activeContainer.components) return [];
      
      return activeContainer.components.map((component) => ({
        id: component.id,
        type: 'component',
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
    },
    [activeContainer]
  );

  // Convert connections to React Flow edges based on current view level
  const edges: Edge[] = useMemo(() => {
    if (model.viewLevel === 'system') {
      // System level connections
      return model.systems.flatMap((sys) =>
        sys.connections.map((targetId) => ({
          id: `${sys.id}->${targetId}`,
          source: sys.id,
          target: targetId,
        }))
      );
    } else if (model.viewLevel === 'container' && activeSystem && activeSystem.containers) {
      // Container level connections
      return activeSystem.containers.flatMap((container) =>
        container.connections.map((targetId) => ({
          id: `${container.id}->${targetId}`,
          source: container.id,
          target: targetId,
        }))
      );
    } else if (model.viewLevel === 'component' && activeContainer && activeContainer.components) {
      // Component level connections
      return activeContainer.components.flatMap((component) =>
        component.connections.map((targetId) => ({
          id: `${component.id}->${targetId}`,
          source: component.id,
          target: targetId,
        }))
      );
    }
    return [];
  }, [model.systems, model.viewLevel, activeSystem, activeContainer]);

  // Get current nodes based on view level
  const currentNodes = useMemo(() => {
    if (model.viewLevel === 'system') return systemNodes;
    if (model.viewLevel === 'container') return containerNodes;
    return componentNodes;
  }, [model.viewLevel, systemNodes, containerNodes, componentNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (params.source && params.target) {
        if (model.viewLevel === 'system') {
          connectSystems(params.source, params.target);
        } else if (model.viewLevel === 'container' && model.activeSystemId) {
          connectContainers(model.activeSystemId, params.source, params.target);
        } else if (model.viewLevel === 'component' && model.activeSystemId && model.activeContainerId) {
          connectComponents(model.activeSystemId, model.activeContainerId, params.source, params.target);
        }
      }
    },
    [connectSystems, connectContainers, connectComponents, model.viewLevel, model.activeSystemId, model.activeContainerId]
  );

  // Handle adding new elements based on current view
  const handleAddElement = () => {
    if (model.viewLevel === 'system') {
      // Add a new system
      addSystem({
        name: t('new_system'),
        description: '',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        connections: [],
      });
    } else if (model.viewLevel === 'container' && model.activeSystemId) {
      // Add a new container to the active system
      addContainer(model.activeSystemId, {
        name: t('new_container'),
        description: '',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        connections: [],
      });
    } else if (model.viewLevel === 'component' && model.activeSystemId && model.activeContainerId) {
      // Add a new component to the active container
      addComponent(model.activeSystemId, model.activeContainerId, {
        name: t('new_component'),
        description: '',
        technology: '',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        connections: [],
      });
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

  // Navigation - handling double click to drill down
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      if (model.viewLevel === 'system') {
        // Double-click on system to view its containers
        setActiveSystem(nodeId);
      } else if (model.viewLevel === 'container') {
        // Double-click on container to view its components
        setActiveContainer(nodeId);
      }
    },
    [model.viewLevel, setActiveSystem, setActiveContainer]
  );

  // Handle node position changes based on current view level
  const handleNodePositionChange = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (model.viewLevel === 'system') {
        updateSystem(id, { position });
      } else if (model.viewLevel === 'container' && model.activeSystemId) {
        updateContainer(model.activeSystemId, id, { position });
      } else if (model.viewLevel === 'component' && model.activeSystemId && model.activeContainerId) {
        updateComponent(model.activeSystemId, model.activeContainerId, id, { position });
      }
    },
    [model.viewLevel, model.activeSystemId, model.activeContainerId, updateSystem, updateContainer, updateComponent]
  );

  // Element editing logic
  const editingElement = useMemo(() => {
    if (!editId) return null;
    
    if (model.viewLevel === 'component' && activeContainer && activeContainer.components) {
      // Editing a component
      return activeContainer.components.find(c => c.id === editId) || null;
    } else if (isEditingContainer && activeSystem && activeSystem.containers) {
      // Editing a container
      return activeSystem.containers.find(c => c.id === editId) || null;
    } else {
      // Editing a system
      return model.systems.find(s => s.id === editId) || null;
    }
  }, [editId, isEditingContainer, model.viewLevel, model.systems, activeSystem, activeContainer]);

  const handleDialogSave = (name: string, description: string, technology?: string) => {
    if (editId) {
      if (model.viewLevel === 'component' && model.activeSystemId && model.activeContainerId) {
        // Saving a component
        updateComponent(model.activeSystemId, model.activeContainerId, editId, { name, description, technology });
      } else if (isEditingContainer && model.activeSystemId) {
        // Saving a container
        updateContainer(model.activeSystemId, editId, { name, description });
      } else {
        // Saving a system
        updateSystem(editId, { name, description });
      }
    }
    setDialogOpen(false);
    setEditId(null);
  };



  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100vh', bgcolor: '#f4f6fa' }}>
        <Toolbar 
          onAddSystem={handleAddElement} 
          onExport={handleExport} 
          onImport={handleImport} 
        />
        
        <NavBar 
          systemName={activeSystem?.name} 
          containerName={activeContainer?.name} 
        />
        
        <FlowCanvas 
          nodes={currentNodes} 
          edges={edges} 
          onConnect={onConnect} 
          onNodePositionChange={handleNodePositionChange}
          viewLevel={model.viewLevel}
          onNodeDoubleClick={handleNodeDoubleClick}
        />
        
        {editingElement && (
          <SystemEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ''}
            onSave={handleDialogSave}
            onClose={() => {
              setDialogOpen(false);
              setEditId(null);
            }}
          />
        )}
        
        <ErrorNotification message={importError} />
      </Box>
    </ReactFlowProvider>
  );
}

export default App;
