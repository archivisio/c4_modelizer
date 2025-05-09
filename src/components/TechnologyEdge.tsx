import { BaseBlock } from "@/types/c4";
import TechnologyIcon from "@components/TechnologyIcon";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import React from "react";
import { styled } from "@mui/system";

const ICON_SIZE = 18;

const EdgeLabelContainer = styled('div')(() => ({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  pointerEvents: "all",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 40,
  minHeight: 24,
  zIndex: 1
}));

const EdgeLabel = styled('span')(() => ({
  marginTop: 2,
  background: "rgba(255,255,255,0.95)",
  borderRadius: 4,
  padding: "1px 6px",
  fontSize: 12,
  fontWeight: 500,
  color: "#333",
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  whiteSpace: "nowrap",
  maxWidth: 70,
  overflow: "hidden",
  textOverflow: "ellipsis",
  border: "1px solid #eee"
}));

const createEdgeStyle = (style: React.CSSProperties | undefined, isBidirectional: boolean, id: string) => ({
  ...style,
  markerStart: isBidirectional
    ? `url(#bidirectional-marker-${id})`
    : undefined,
  animation: isBidirectional ? "none" : style?.animation,
});

function cubicBezierPoint(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
}

const TechnologyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  ...props
}) => {
  const isBidirectional = props.data?.bidirectional === true;

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  const [edgePath] = getBezierPath(edgePathParams);

  const labelPosition =
    typeof props.data?.labelPosition === "number"
      ? props.data.labelPosition
      : 50;
  const t = Math.max(0, Math.min(1, labelPosition / 100));
  let bezierX = 0,
    bezierY = 0;

  const bezierMatch = edgePath.match(
    /M\s*([\d.eE+-]+),([\d.eE+-]+)\s*C\s*([\d.eE+-]+),([\d.eE+-]+)\s+([\d.eE+-]+),([\d.eE+-]+)\s+([\d.eE+-]+),([\d.eE+-]+)/
  );
  if (bezierMatch) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = bezierMatch
      .slice(1, 9)
      .map(Number);
    bezierX = cubicBezierPoint(t, x1, x2, x3, x4);
    bezierY = cubicBezierPoint(t, y1, y2, y3, y4);
  }

  return (
    <>
      {isBidirectional && (
        <svg>
          <defs>
            <marker
              id={`bidirectional-marker-${id}`}
              markerWidth="8"
              markerHeight="8"
              refX="0"
              refY="4"
              orient="auto"
            >
              <polyline
                points="0,0 0,8 8,4 0,0"
                fill="#51a2ff"
                transform="translate(8, 0) scale(-1, 1)"
              />
            </marker>
          </defs>
        </svg>
      )}

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={createEdgeStyle(style, isBidirectional, id)}
      />
      <EdgeLabelRenderer>
        <EdgeLabelContainer
          style={{
            transform: `translate(-50%, -50%) translate(${bezierX}px,${bezierY}px)`
          }}
          className="nodrag nopan"
        >
          <TechnologyIcon
            item={props.data as unknown as BaseBlock}
            size={ICON_SIZE}
            showTooltip={true}
          />
          {props.label && (
            <EdgeLabel>
              {props.label}
            </EdgeLabel>
          )}
        </EdgeLabelContainer>
      </EdgeLabelRenderer>
    </>
  );
};

export default TechnologyEdge;
