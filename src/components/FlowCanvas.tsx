import SelectionIcon from "@mui/icons-material/HighlightAlt";
import PanToolIcon from "@mui/icons-material/PanTool";
import { Box } from "@mui/material";
import {
  Background,
  BackgroundVariant,
  Connection,
  ControlButton,
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
import { useTranslation } from "react-i18next";

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
}

const nodeTypes = {
  system: SystemBlock,
  container: ContainerBlock,
  component: ComponentBlock,
  code: CodeBlock,
};

const SelectionPanToggle = ({
  isSelectionMode,
  onToggle,
}: {
  isSelectionMode: boolean;
  onToggle: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <ControlButton
      onClick={onToggle}
      title={
        isSelectionMode ? t("switchToPanMode") : t("switchToSelectionMode")
      }
    >
      {isSelectionMode ? (
        <PanToolIcon fontSize="small" />
      ) : (
        <SelectionIcon fontSize="small" />
      )}
    </ControlButton>
  );
};

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onConnect,
  onNodePositionChange,
  viewLevel,
  onNodeDoubleClick,
  onEdgeClick,
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(true);

  const toggleInteractionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
  }, []);
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
    const technologyId = (edge.data &&
      (edge.data.technology || edge.data.technologyId)) as string | undefined;

    if (technologyId) {
      return {
        ...edge,
        type: "technology",
        data: {
          ...edge.data,
          technologyId,
        },
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
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ width: "100%", height: "100%" }}
        selectionOnDrag={isSelectionMode}
        multiSelectionKeyCode="Control"
        selectionMode={SelectionMode.Partial}
        selectionKeyCode={null}
        panOnDrag={isSelectionMode ? [1, 2] : [0, 1, 2]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(81, 162, 255, 0.2)"
        />
        <MiniMap zoomable pannable />
        <Controls>
          <SelectionPanToggle
            isSelectionMode={isSelectionMode}
            onToggle={toggleInteractionMode}
          />
        </Controls>
      </ReactFlow>
    </Box>
  );
};

export default FlowCanvas;
