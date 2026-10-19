import React from 'react';
import { ShapeElement } from '../../types/canvas';

interface Props {
  element: ShapeElement;
  isSelected: boolean;
}

export const ShapeElementView: React.FC<Props> = ({ element, isSelected }) => {
  const { width, height, shapeType, fillColor, strokeColor, strokeWidth, strokeDash, cornerRadius } = element;

  const strokeDashArray = strokeDash === 'dashed' ? '8 6' : strokeDash === 'dotted' ? '3 3' : 'none';

  const renderShapePath = () => {
    switch (shapeType) {
      case 'rectangle':
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={Math.max(1, width - strokeWidth)}
            height={Math.max(1, height - strokeWidth)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'rounded-rectangle':
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={Math.max(1, width - strokeWidth)}
            height={Math.max(1, height - strokeWidth)}
            rx={cornerRadius || 24}
            ry={cornerRadius || 24}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'circle':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={Math.max(1, (width - strokeWidth) / 2)}
            ry={Math.max(1, (height - strokeWidth) / 2)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height - strokeWidth} ${strokeWidth},${height - strokeWidth}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'star': {
        const cx = width / 2;
        const cy = height / 2;
        const outerR = Math.min(width, height) / 2 - strokeWidth;
        const innerR = outerR * 0.42;
        const points = 5;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / points;
        let pathStr = '';

        for (let i = 0; i < points; i++) {
          const x1 = cx + Math.cos(rot) * outerR;
          const y1 = cy + Math.sin(rot) * outerR;
          pathStr += `${i === 0 ? 'M' : 'L'} ${x1} ${y1} `;
          rot += step;

          const x2 = cx + Math.cos(rot) * innerR;
          const y2 = cy + Math.sin(rot) * innerR;
          pathStr += `L ${x2} ${y2} `;
          rot += step;
        }
        pathStr += 'Z';

        return (
          <path
            d={pathStr}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );
      }

      case 'polygon': {
        // Hexagon
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(width, height) / 2 - strokeWidth;
        let pathStr = '';
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          pathStr += `${i === 0 ? 'M' : 'L'} ${px} ${py} `;
        }
        pathStr += 'Z';
        return (
          <path
            d={pathStr}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );
      }

      case 'heart': {
        const d = `
          M ${width * 0.5} ${height * 0.85}
          C ${width * 0.1} ${height * 0.5}, ${width * 0.05} ${height * 0.2}, ${width * 0.3} ${height * 0.15}
          C ${width * 0.45} ${height * 0.15}, ${width * 0.5} ${height * 0.3}, ${width * 0.5} ${height * 0.3}
          C ${width * 0.5} ${height * 0.3}, ${width * 0.55} ${height * 0.15}, ${width * 0.7} ${height * 0.15}
          C ${width * 0.95} ${height * 0.2}, ${width * 0.9} ${height * 0.5}, ${width * 0.5} ${height * 0.85}
          Z
        `;
        return (
          <path
            d={d}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );
      }

      case 'arrow':
        return (
          <path
            d={`
              M 0 ${height * 0.35}
              L ${width * 0.65} ${height * 0.35}
              L ${width * 0.65} 0
              L ${width} ${height / 2}
              L ${width * 0.65} ${height}
              L ${width * 0.65} ${height * 0.65}
              L 0 ${height * 0.65}
              Z
            `}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'line':
        return (
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={fillColor || strokeColor}
            strokeWidth={Math.max(2, strokeWidth || 4)}
            strokeDasharray={strokeDashArray}
          />
        );

      case 'badge-sale':
      case 'badge-new':
      case 'badge-pro': {
        const text = shapeType === 'badge-sale' ? '50% OFF' : shapeType === 'badge-new' ? 'NEW' : 'PRO';
        return (
          <g>
            <rect
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={Math.max(1, width - strokeWidth)}
              height={Math.max(1, height - strokeWidth)}
              rx={height / 2}
              ry={height / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <text
              x={width / 2}
              y={height / 2}
              fill="#ffffff"
              fontSize={Math.round(height * 0.5)}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="sans-serif"
            >
              {text}
            </text>
          </g>
        );
      }

      default:
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
    }
  };

  return (
    <div
      className={`w-full h-full select-none ${
        isSelected ? 'outline outline-1 outline-purple-400' : ''
      }`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {renderShapePath()}
      </svg>
    </div>
  );
};
