import SelectionIcon from "@mui/icons-material/HighlightAlt";
import PanToolIcon from "@mui/icons-material/PanTool";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
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
  PanOnScrollMode,
  ReactFlow,
  SelectionMode,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDialogs } from "@/contexts/DialogContext";
import useFlatStore from "@/hooks/useFlatStore";
import { ViewLevel } from "../types/c4";
import CodeBlock from "./code/CodeBlock";
import ComponentBlock from "./component/ComponentBlock";
import ContainerBlock from "./container/ContainerBlock";
import SystemBlock from "./system/SystemBlock";
import TechnologyEdge from "./TechnologyEdge";

const FlowCanvasContainer = styled(Box)(() => ({
  width: "100vw",
  height: "calc(100vh - 100px)",
  backgroundColor: "#0a1929",
}));

const StyledReactFlow = styled(ReactFlow)(() => ({
  width: "100%",
  height: "100%",
}));

const StyledBackground = styled(Background)(() => ({
  "& .react-flow__background-dots": {
    color: "rgba(81, 162, 255, 0.2)",
  },
}));

const defaultEdgeStyle = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: "#51a2ff",
  },
  markerStart: {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: "#51a2ff",
  },
  style: {
    strokeWidth: 1.5,
    stroke: "#51a2ff",
    opacity: 0.8,
    filter: "drop-shadow(0 0 5px rgba(81, 162, 255, 0.5))",
  },
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: Edge | Connection) => void;
  onNodePositionChange: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  viewLevel: ViewLevel;
  onNodeDoubleClick?: (nodeId: string) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
}

const nodeTypes = {
  system: SystemBlock,
  container: ContainerBlock,
  component: ComponentBlock,
  code: CodeBlock,
};

const edgeTypes = {
  technology: TechnologyEdge,
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
  onNodeDoubleClick,
  onEdgeClick,
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(true);
  const { setPendingConnection } = useDialogs();
  const { getBlockById } = useFlatStore();
  const reactFlowInstance = useReactFlow();

  const toggleInteractionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
  }, []);
  const [internalNodes, setInternalNodes] = useState<Node[]>(nodes);

  useEffect(() => {
    setInternalNodes(nodes);
  }, [nodes]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setInternalNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const handleNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodePositionChange(node.id, node.position);
    },
    [onNodePositionChange]
  );

  const handleNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      if (onNodeDoubleClick) {
        onNodeDoubleClick(node.id);
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      }
    },
    [onNodeDoubleClick, reactFlowInstance]
  );

  const defaultEdgeOptions = defaultEdgeStyle;

  const preparedEdges = edges.map((edge) => {
    const technologyId = (edge.data &&
      (edge.data.technology || edge.data.technologyId)) as string | undefined;
    return {
      ...edge,
      type: "technology",
      data: {
        ...edge.data,
        technologyId,
      },
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

  const isValidConnection = useCallback(
    (connectionState: Edge | Connection) => {
      if (connectionState.source === connectionState.target) {
        return false;
      }

      const sourceNode = getBlockById(connectionState.source);
      if (
        sourceNode?.connections
          ?.map((conn) => conn.targetId)
          .includes(connectionState.target)
      ) {
        return false;
      }

      return true;
    },
    [getBlockById]
  );

  return (
    <FlowCanvasContainer>
      <StyledReactFlow
        nodes={internalNodes}
        edges={preparedEdges}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodesChange={handleNodesChange}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeClick={onEdgeClick ? handleEdgeClick : undefined}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        selectionOnDrag={isSelectionMode}
        multiSelectionKeyCode="Control"
        selectionMode={SelectionMode.Partial}
        selectionKeyCode={null}
        panOnDrag={isSelectionMode ? [1, 2] : [0, 1, 2]}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnScrollMode={PanOnScrollMode.Free}
        isValidConnection={(connectionState) =>
          isValidConnection(connectionState)
        }
        onConnectEnd={(event, connectionState) => {
          if (connectionState.fromNode && !connectionState.toNode) {
            setPendingConnection({ event, connectionState });
          }
        }}
      >
        <StyledBackground variant={BackgroundVariant.Dots} gap={20} size={1} />
        <MiniMap zoomable pannable />
        <Controls>
          <SelectionPanToggle
            isSelectionMode={isSelectionMode}
            onToggle={toggleInteractionMode}
          />
        </Controls>
      </StyledReactFlow>
    </FlowCanvasContainer>
  );
};

export default FlowCanvas;
