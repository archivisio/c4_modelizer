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
    setActiveSystem,
    setModel 
  } = useC4Store();
  
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Get current active system
  const activeSystem = useMemo(
    () => model.activeSystemId ? model.systems.find(s => s.id === model.activeSystemId) : undefined,
    [model.activeSystemId, model.systems]
  );

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
    } else if (activeSystem && activeSystem.containers) {
      // Container level connections
      return activeSystem.containers.flatMap((container) =>
        container.connections.map((targetId) => ({
          id: `${container.id}->${targetId}`,
          source: container.id,
          target: targetId,
        }))
      );
    }
    return [];
  }, [model.systems, model.viewLevel, activeSystem]);

  // Get current nodes based on view level
  const currentNodes = useMemo(() => {
    return model.viewLevel === 'system' ? systemNodes : containerNodes;
  }, [model.viewLevel, systemNodes, containerNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (params.source && params.target) {
        if (model.viewLevel === 'system') {
          connectSystems(params.source, params.target);
        } else if (model.activeSystemId) {
          connectContainers(model.activeSystemId, params.source, params.target);
        }
      }
    },
    [connectSystems, connectContainers, model.viewLevel, model.activeSystemId]
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
    } else if (model.activeSystemId) {
      // Add a new container to the active system
      addContainer(model.activeSystemId, {
        name: t('new_container'),
        description: '',
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

  // Navigation - handling double click on system to drill down to its containers
  const handleSystemDoubleClick = useCallback(
    (systemId: string) => {
      setActiveSystem(systemId);
    },
    [setActiveSystem]
  );

  // Handle node position changes based on current view level
  const handleNodePositionChange = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (model.viewLevel === 'system') {
        updateSystem(id, { position });
      } else if (model.activeSystemId) {
        updateContainer(model.activeSystemId, id, { position });
      }
    },
    [model.viewLevel, model.activeSystemId, updateSystem, updateContainer]
  );

  // Element editing logic
  const editingElement = useMemo(() => {
    if (!editId) return null;
    
    if (isEditingContainer && activeSystem && activeSystem.containers) {
      return activeSystem.containers.find(c => c.id === editId) || null;
    } else {
      return model.systems.find(s => s.id === editId) || null;
    }
  }, [editId, isEditingContainer, model.systems, activeSystem]);

  const handleDialogSave = (name: string, description: string) => {
    if (editId) {
      if (isEditingContainer && model.activeSystemId) {
        updateContainer(model.activeSystemId, editId, { name, description });
      } else {
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
        
        <NavBar systemName={activeSystem?.name} />
        
        <FlowCanvas 
          nodes={currentNodes} 
          edges={edges} 
          onConnect={onConnect} 
          onNodePositionChange={handleNodePositionChange}
          viewLevel={model.viewLevel}
          onNodeDoubleClick={handleSystemDoubleClick}
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
