import React from 'react';
import { useCanva } from '../context/CanvaContext';
import { TextElementView } from './elements/TextElementView';
import { ShapeElementView } from './elements/ShapeElementView';
import { ImageElementView } from './elements/ImageElementView';
import { TransformBox } from './TransformBox';
import { AlignmentGuides } from './AlignmentGuides';
import { CanvasElement, TextElement, ShapeElement, ImageElement as ImageElementType } from '../types/canvas';

export const Artboard: React.FC = () => {
  const {
    project,
    selectedElementId,
    setSelectedElementId,
    updateElement,
    zoom,
    alignmentGuides,
  } = useCanva();

  const handleArtboardClick = (e: React.MouseEvent) => {
    // Only deselect if clicked directly on the artboard background
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = project;
    if (background.type === 'gradient') {
      return { background: background.value };
    }
    if (background.type === 'image') {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: background.value || '#ffffff' };
  };

  const sortedElements = [...project.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      id="canva-artboard"
      onClick={handleArtboardClick}
      className="relative transition-all select-none shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-sm overflow-hidden"
      style={{
        width: `${project.width}px`,
        height: `${project.height}px`,
        ...getBackgroundStyle(),
      }}
    >
      {/* Elements layer */}
      {sortedElements.map((el: CanvasElement) => {
        const isSelected = el.id === selectedElementId;

        return (
          <div
            key={el.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElementId(el.id);
            }}
            className="absolute transition-shadow duration-75"
            style={{
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity ?? 1,
              zIndex: el.zIndex,
            }}
          >
            {el.type === 'text' && (
              <TextElementView
                element={el as TextElement}
                isSelected={isSelected}
                onUpdate={(updates) => updateElement(el.id, updates, true)}
              />
            )}
            {el.type === 'shape' && (
              <ShapeElementView element={el as ShapeElement} isSelected={isSelected} />
            )}
            {el.type === 'image' && (
              <ImageElementView element={el as ImageElementType} isSelected={isSelected} />
            )}

            {/* Transform Box for the selected element */}
            {isSelected && <TransformBox element={el} zoom={zoom} />}
          </div>
        );
      })}

      {/* Real-time Magnetic Alignment Guides */}
      <AlignmentGuides guides={alignmentGuides} width={project.width} height={project.height} />
    </div>
  );
};
