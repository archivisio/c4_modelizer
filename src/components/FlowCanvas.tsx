import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Paper } from "@mui/material";
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
  SelectionMode,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

import CodeBlock from "./CodeBlock";
import ComponentBlock from "./ComponentBlock";
import ContainerBlock from "./ContainerBlock";
import SystemBlock from "./SystemBlock";
import TechnologyEdge from "./TechnologyEdge";

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: Edge | Connection) => void;
  onNodePositionChange: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  viewLevel: "system" | "container" | "component" | "code";
  onNodeDoubleClick?: (nodeId: string) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (edge: Edge) => void;
}

const nodeTypes = {
  system: SystemBlock,
  container: ContainerBlock,
  component: ComponentBlock,
  code: CodeBlock,
};


const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onConnect,
  onNodePositionChange,
  viewLevel,
  onNodeDoubleClick,
  onEdgeClick,
  onNodeDelete,
  onEdgeDelete,
}) => {
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.id && change.position) {
          onNodePositionChange(change.id, change.position);
        }
      });
    },
    [onNodePositionChange]
  );

  const handleNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (onNodeDoubleClick && viewLevel !== "code") {
        onNodeDoubleClick(node.id);
      }
    },
    [onNodeDoubleClick, viewLevel]
  );

  const defaultEdgeOptions = {
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: "#51a2ff",
    },
    style: {
      strokeWidth: 2.5,
      stroke: "#51a2ff",
      opacity: 0.8,
      filter: "drop-shadow(0 0 5px rgba(81, 162, 255, 0.5))",
    },
  };

  const preparedEdges = edges.map((edge) => {
    const technologyId = (edge.data && (edge.data.technology || edge.data.technologyId)) as string | undefined;

    if (technologyId) {
      return {
        ...edge,
        type: "technology",
        data: {
          ...edge.data,
          technologyId
        }
      };
    }

    return {
      ...edge,
      style: {
        ...(edge.style || {}),
        ...defaultEdgeOptions.style,
      },
      markerEnd: defaultEdgeOptions.markerEnd,
      animated: edge.animated !== undefined ? edge.animated : true,
    };
  });

  const [contextMenu, setContextMenu] = useState<{
    id: string;
    type: "node" | "edge";
    top: number;
    left: number;
    edge?: Edge;
  } | null>(null);

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      setContextMenu({
        id: node.id,
        type: "node",
        top: event.clientY,
        left: event.clientX,
      });
    },
    []
  );

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();

      setContextMenu({
        id: edge.id,
        type: "edge",
        top: event.clientY,
        left: event.clientX,
        edge,
      });
    },
    []
  );

  const handleNodeDelete = useCallback(() => {
    if (contextMenu && contextMenu.type === "node" && onNodeDelete) {
      onNodeDelete(contextMenu.id);
      setContextMenu(null);
    }
  }, [contextMenu, onNodeDelete]);

  const handleEdgeDelete = useCallback(() => {
    if (
      contextMenu &&
      contextMenu.type === "edge" &&
      contextMenu.edge &&
      onEdgeDelete
    ) {
      onEdgeDelete(contextMenu.edge);
      setContextMenu(null);
    }
  }, [contextMenu, onEdgeDelete]);

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      if (onEdgeClick) {
        onEdgeClick(event, edge);
      }
    },
    [onEdgeClick]
  );

  return (
    <Box
      sx={{ width: "100vw", height: "calc(100vh - 100px)", bgcolor: "#0a1929" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={preparedEdges}
        edgeTypes={{ technology: TechnologyEdge }}
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeClick={onEdgeClick ? handleEdgeClick : undefined}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneClick={handlePaneClick}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ width: "100%", height: "100%" }}
        selectionOnDrag
        multiSelectionKeyCode="Control"
        selectionMode={SelectionMode.Partial}
        selectionKeyCode={null}
        panOnDrag={[1, 2]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(81, 162, 255, 0.2)"
        />
        <MiniMap nodeStrokeWidth={3} />
        <Controls />

        {contextMenu && (
          <div
            style={{
              position: "fixed",
              zIndex: 10,
              top: contextMenu.top,
              left: contextMenu.left,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 1,
                bgcolor: "#132f4c",
                color: "#fff",
                border: "1px solid rgba(81, 162, 255, 0.3)",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                }}
                onClick={
                  contextMenu.type === "node"
                    ? handleNodeDelete
                    : handleEdgeDelete
                }
                onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(81, 162, 255, 0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <DeleteIcon style={{ marginRight: 8, color: "#ff5252" }} />
                {contextMenu.type === "node"
                  ? "Supprimer le bloc"
                  : "Supprimer la connexion"}
              </div>
            </Paper>
          </div>
        )}
      </ReactFlow>
    </Box>
  );
};

export default FlowCanvas;
