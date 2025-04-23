import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeChange,
} from 'reactflow';
import SystemBlock from './SystemBlock';
import ContainerBlock from './ContainerBlock';
import ComponentBlock from './ComponentBlock';
import CodeBlock from './CodeBlock';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: Edge | Connection) => void;
  onNodePositionChange: (id: string, position: { x: number; y: number }) => void;
  viewLevel: 'system' | 'container' | 'component' | 'code';
  onNodeDoubleClick?: (nodeId: string) => void;
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
  onNodeDoubleClick
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

  return (
    <Box sx={{ width: '100vw', height: 'calc(100vh - 100px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
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
