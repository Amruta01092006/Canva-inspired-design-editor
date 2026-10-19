import React from 'react';
import { ImageElement } from '../../types/canvas';

interface Props {
  element: ImageElement;
  isSelected: boolean;
}

export const ImageElementView: React.FC<Props> = ({ element, isSelected }) => {
  const { src, brightness, contrast, saturation, blur, grayscale, sepia, flipX, flipY } = element;

  const filters = [
    brightness !== 100 ? `brightness(${brightness}%)` : '',
    contrast !== 100 ? `contrast(${contrast}%)` : '',
    saturation !== 100 ? `saturate(${saturation}%)` : '',
    blur > 0 ? `blur(${blur}px)` : '',
    grayscale > 0 ? `grayscale(${grayscale}%)` : '',
    sepia > 0 ? `sepia(${sepia}%)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const transform = [
    flipX ? 'scaleX(-1)' : '',
    flipY ? 'scaleY(-1)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`w-full h-full select-none overflow-hidden relative ${
        isSelected ? 'outline outline-1 outline-purple-400' : ''
      }`}
    >
      <img
        src={src}
        alt={element.name}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
        style={{
          filter: filters || 'none',
          transform: transform || 'none',
        }}
      />
    </div>
  );
};
