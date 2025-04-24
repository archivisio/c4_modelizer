import { EdgeProps, getBezierPath } from "@xyflow/react";
import React from "react";
import TechnologyIcon from "./TechnologyIcon";

const ICON_SIZE = 18;

const TechnologyEdge: React.FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style = {},
    markerEnd,
    data,
  } = props;

  const technologyId =
    typeof data?.technology === "string"
      ? data.technology
      : typeof data?.technologyId === "string"
      ? data.technologyId
      : undefined;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isLeftToRight = sourceX < targetX;
  const adjustedMarkerEnd = markerEnd;

  return (
    <g>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={
          typeof adjustedMarkerEnd === "string" ? adjustedMarkerEnd : undefined
        }
      />
      {technologyId && (
        <foreignObject
          x={labelX - 40}
          y={labelY - ICON_SIZE / 2 - 8}
          width={80}
          height={40}
          style={{
            overflow: "visible",
            transform: isLeftToRight ? "none" : "rotate(180deg)",
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
              transform: isLeftToRight ? "none" : "rotate(180deg)",
            }}
          >
            <TechnologyIcon
              technologyId={technologyId}
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
        </foreignObject>
      )}
    </g>
  );
};

export default TechnologyEdge;
