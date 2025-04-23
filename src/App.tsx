import { Box } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Connection, Edge, Node, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import ErrorNotification from './components/ErrorNotification';
import FlowCanvas from './components/FlowCanvas';
import SystemEditDialog from './components/SystemEditDialog';
import Toolbar from './components/Toolbar';
import { handleExportModel, handleImportModel } from './components/FileOperations';
import './i18n';
import { useC4Store } from './store/c4Store';



function App() {
  const { model, addSystem, updateSystem, connectSystems, setModel } = useC4Store();
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Convert systems to React Flow nodes
  const nodes: Node[] = useMemo(
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
            setDialogOpen(true);
          },
        },
      })),
    [model.systems]
  );

  // Convert connections to React Flow edges
  const edges: Edge[] = useMemo(() => {
    return model.systems.flatMap((sys) =>
      sys.connections.map((targetId) => ({
        id: `${sys.id}->${targetId}`,
        source: sys.id,
        target: targetId,
      }))
    );
  }, [model.systems]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (params.source && params.target) {
        connectSystems(params.source, params.target);
      }
    },
    [connectSystems]
  );

  const handleAddSystem = () => {
    addSystem({
      name: t('new_system'),
      description: '',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      connections: [],
    });
  };

  const handleExport = () => {
    handleExportModel(model);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImportModel(file, setModel, setImportError);
  };

  // Edition d'un système
  const editingSystem = editId ? model.systems.find((s) => s.id === editId) : null;
  const handleDialogSave = (name: string, description: string) => {
    if (editId) {
      updateSystem(editId, { name, description });
    }
    setDialogOpen(false);
    setEditId(null);
  };

  const handleNodePositionChange = (id: string, position: { x: number; y: number }) => {
    updateSystem(id, { position });
  };

  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100vh', bgcolor: '#f4f6fa' }}>
        <Toolbar 
          onAddSystem={handleAddSystem} 
          onExport={handleExport} 
          onImport={handleImport} 
        />
        <FlowCanvas 
          nodes={nodes} 
          edges={edges} 
          onConnect={onConnect} 
          onNodePositionChange={handleNodePositionChange} 
        />
        {editingSystem && (
          <SystemEditDialog
            open={dialogOpen}
            initialName={editingSystem.name}
            initialDescription={editingSystem.description}
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
