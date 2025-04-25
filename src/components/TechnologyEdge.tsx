import { EdgeProps, getBezierPath, Position } from "@xyflow/react";
import React from "react";
import { getTechnologyById } from "../data/technologies";
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
    data,
  } = props;

  const technologyId =
    typeof data?.technology === "string"
      ? data.technology
      : typeof data?.technologyId === "string"
        ? data.technologyId
        : undefined;

  const isHorizontal = Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY);
  const sourcePosition = isHorizontal
    ? (sourceX < targetX ? Position.Right : Position.Left)
    : (sourceY < targetY ? Position.Bottom : Position.Top);

  const targetPosition = isHorizontal
    ? (sourceX < targetX ? Position.Left : Position.Right)
    : (sourceY < targetY ? Position.Top : Position.Bottom);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isLeftToRight = sourceX < targetX;
  const technology = technologyId ? getTechnologyById(technologyId) : null;
  const color = technology?.color || "#51a2ff";
  const enhancedStyle = {
    ...style,
    stroke: color,
    strokeWidth: 2.5,
    opacity: 0.8,
    filter: `drop-shadow(0 0 5px ${color}80)`,
  };
  const markerEndId = `marker-${id}`;
  const customMarkerEnd = `url(#${markerEndId})`;

  return (
    <g>
      <defs>
        <marker
          id={markerEndId}
          markerWidth="18"
          markerHeight="18"
          refX="10"
          refY="5"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={color}
            style={{ filter: `drop-shadow(0 0 2px ${color}80)` }}
          />
        </marker>
      </defs>
      <path
        id={id}
        style={enhancedStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={customMarkerEnd}
      />
      {technologyId && (
        <foreignObject
          x={isLeftToRight ? labelX - 40 : labelX - 40}
          y={labelY - ICON_SIZE / 2 - 8}
          width={80}
          height={40}
          style={{
            overflow: "visible",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
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
