import React from 'react';
import { AlignmentGuide } from '../types/canvas';

interface Props {
  guides: AlignmentGuide[];
  width: number;
  height: number;
}

export const AlignmentGuides: React.FC<Props> = ({ guides, width, height }) => {
  if (!guides || guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {guides.map((g, idx) => {
        if (g.type === 'vertical') {
          return (
            <div
              key={`v-${idx}-${g.position}`}
              className="absolute top-0 bottom-0 w-px bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              style={{
                left: `${g.position}px`,
                height: `${height}px`,
              }}
            />
          );
        }

        return (
          <div
            key={`h-${idx}-${g.position}`}
            className="absolute left-0 right-0 h-px bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            style={{
              top: `${g.position}px`,
              width: `${width}px`,
            }}
          />
        );
      })}
    </div>
  );
};
