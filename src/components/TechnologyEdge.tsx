import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import React from "react";
import TechnologyIcon from "./TechnologyIcon";

const ICON_SIZE = 18;

function cubicBezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const labelPosition = typeof props.data?.labelPosition === 'number' ? props.data.labelPosition : 50;
  const t = Math.max(0, Math.min(1, labelPosition / 100));
  let bezierX = 0, bezierY = 0;
  const bezierMatch = edgePath.match(
    /M\s*([\d.eE+-]+),([\d.eE+-]+)\s*C\s*([\d.eE+-]+),([\d.eE+-]+)\s+([\d.eE+-]+),([\d.eE+-]+)\s+([\d.eE+-]+),([\d.eE+-]+)/
  );
  if (bezierMatch) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = bezierMatch.slice(1, 9).map(Number);
    bezierX = cubicBezierPoint(t, x1, x2, x3, x4);
    bezierY = cubicBezierPoint(t, y1, y2, y3, y4);
  }

  const technologyId = props.data?.technologyId;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${bezierX}px,${bezierY}px)`,
            pointerEvents: "all",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 40,
            minHeight: 24,
            zIndex: 1,
          }}
          className="nodrag nopan"
        >
          <TechnologyIcon
            technologyId={technologyId as string}
            size={ICON_SIZE}
            showTooltip={true}
          />
          {props.label && (
            <span
              style={{
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
                border: "1px solid #eee",
              }}
            >
              {props.label}
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default TechnologyEdge;