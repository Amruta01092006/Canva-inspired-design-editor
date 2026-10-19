import React, { useState, useRef, useEffect } from 'react';
import { TextElement } from '../../types/canvas';

interface Props {
  element: TextElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<TextElement>) => void;
}

export const TextElementView: React.FC<Props> = ({ element, isSelected, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      textRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <textarea
        ref={textRef}
        value={element.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        onBlur={handleBlur}
        className="w-full h-full bg-transparent border-2 border-purple-500 rounded outline-none resize-none overflow-hidden p-0 m-0"
        style={{
          fontFamily: element.fontFamily || 'Inter, sans-serif',
          fontSize: `${element.fontSize}px`,
          fontWeight: element.fontWeight || 'normal',
          fontStyle: element.fontStyle || 'normal',
          textDecoration: element.textDecoration || 'none',
          textAlign: element.textAlign || 'left',
          color: element.color || '#000000',
          letterSpacing: `${element.letterSpacing || 0}px`,
          lineHeight: element.lineHeight || 1.25,
          textTransform: element.textTransform || 'none',
        }}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`w-full h-full flex flex-col justify-center select-none cursor-move ${
        isSelected ? 'outline outline-1 outline-purple-400' : ''
      }`}
      style={{
        fontFamily: element.fontFamily || 'Inter, sans-serif',
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight || 'normal',
        fontStyle: element.fontStyle || 'normal',
        textDecoration: element.textDecoration || 'none',
        textAlign: element.textAlign || 'left',
        color: element.color || '#000000',
        letterSpacing: `${element.letterSpacing || 0}px`,
        lineHeight: element.lineHeight || 1.25,
        textTransform: element.textTransform || 'none',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {element.text}
    </div>
  );
};
