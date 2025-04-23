import { Box } from '@mui/material';
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  ReactFlow,
} from '@xyflow/react';
import React, { useCallback } from 'react';
import CodeBlock from './CodeBlock';
import ComponentBlock from './ComponentBlock';
import ContainerBlock from './ContainerBlock';
import SystemBlock from './SystemBlock';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: Edge | Connection) => void;
  onNodePositionChange: (id: string, position: { x: number; y: number }) => void;
  viewLevel: 'system' | 'container' | 'component' | 'code';
  onNodeDoubleClick?: (nodeId: string) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
}

const nodeTypes = { 
  system: SystemBlock, 
  container: ContainerBlock, 
  component: ComponentBlock, 
  code: CodeBlock 
};

const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  nodes, 
  edges, 
  onConnect, 
  onNodePositionChange,
  viewLevel,
  onNodeDoubleClick,
  onEdgeClick
}) => {
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'position' && change.id && change.position) {
          onNodePositionChange(change.id, change.position);
        }
      });
    },
    [onNodePositionChange]
  );

  const handleNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      // Permet le double-clic pour naviguer à chaque niveau sauf le niveau code
      if (onNodeDoubleClick && viewLevel !== 'code') {
        onNodeDoubleClick(node.id);
      }
    },
    [onNodeDoubleClick, viewLevel]
  );

  // Default edge options with arrow marker and animation
  const defaultEdgeOptions = {
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
    },
    style: { strokeWidth: 2 },
  };

  // Gestionnaire pour les clics sur les connexions
  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation(); // Empêcher la propagation aux autres éléments
      if (onEdgeClick) {
        onEdgeClick(event, edge);
      }
    },
    [onEdgeClick]
  );

  return (
    <Box sx={{ width: '100vw', height: 'calc(100vh - 100px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeClick={onEdgeClick ? handleEdgeClick : undefined}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default FlowCanvas;
