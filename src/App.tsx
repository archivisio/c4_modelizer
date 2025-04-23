import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useC4Store } from './store/c4Store';
import SystemBlock from './components/SystemBlock';
import SystemEditDialog from './components/SystemEditDialog';
import { exportModel, importModel } from './utils/jsonIO';
import { SystemBlock as SystemBlockType } from './types/c4';
import { useTranslation } from 'react-i18next';
import './i18n';

const nodeTypes = { system: SystemBlock };

function App() {
  const { model, addSystem, updateSystem, connectSystems, setModel } = useC4Store();
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    const json = exportModel(model);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'c4model.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = evt.target?.result as string;
        const imported = importModel(json);
        if (imported) {
          setModel(imported);
          setImportError(null);
        } else {
          setImportError('Fichier JSON invalide.');
        }
      } catch {
        setImportError('Erreur lors de la lecture du fichier.');
      }
    };
    reader.readAsText(file);
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

  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100vh', bgcolor: '#f4f6fa' }}>
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t('app_title')}
            </Typography>
            <Tooltip title={t('add_system')}>
              <IconButton color="inherit" onClick={handleAddSystem}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('export_json')}>
              <IconButton color="inherit" onClick={handleExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('import_json')}>
              <IconButton color="inherit" component="span" onClick={() => fileInputRef.current?.click()}>
                <UploadFileIcon />
                <input
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImport}
                />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ width: '100vw', height: 'calc(100vh - 64px)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={changes => {
              changes.forEach(change => {
                if (change.type === 'position' && change.id) {
                  const node = nodes.find(n => n.id === change.id);
                  if (node && change.position) {
                    updateSystem(change.id, { position: change.position });
                  }
                }
              });
            }}
            nodeTypes={nodeTypes}
            fitView
            style={{ width: '100%', height: '100%' }}
          >
            <Background variant="dots" gap={16} size={1} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </Box>
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
        {importError && (
          <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'error.main', color: 'white', p: 2, borderRadius: 1 }}>
            {t(importError)}
          </Box>
        )}
      </Box>
    </ReactFlowProvider>
  );
}

export default App;
