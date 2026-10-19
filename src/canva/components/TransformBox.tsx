import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement } from '../types/canvas';
import { useCanva } from '../context/CanvaContext';

interface Props {
  element: CanvasElement;
  zoom: number;
}

type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const TransformBox: React.FC<Props> = ({ element, zoom }) => {
  const { updateElement, project, setAlignmentGuides } = useCanva();
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<HandleType | 'rotate' | null>(null);
  const [rotationAngle, setRotationAngle] = useState(element.rotation || 0);

  const startRef = useRef({
    mouseX: 0,
    mouseY: 0,
    elementX: element.x,
    elementY: element.y,
    elementW: element.width,
    elementH: element.height,
    elementRot: element.rotation || 0,
  });

  useEffect(() => {
    setRotationAngle(element.rotation || 0);
  }, [element.rotation]);

  // Handle Dragging / Moving
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    setIsDragging(true);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: element.x,
      elementY: element.y,
      elementW: element.width,
      elementH: element.height,
      elementRot: element.rotation || 0,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startRef.current.mouseX) / zoom;
      const deltaY = (moveEvent.clientY - startRef.current.mouseY) / zoom;

      let newX = Math.round(startRef.current.elementX + deltaX);
      let newY = Math.round(startRef.current.elementY + deltaY);

      // Smart Snapping Guides
      const guides: Array<{ type: 'horizontal' | 'vertical'; position: number }> = [];
      const threshold = 6;

      // Snap to canvas center horizontal
      const canvasCenterX = project.width / 2;
      const elCenterX = newX + element.width / 2;
      if (Math.abs(elCenterX - canvasCenterX) < threshold) {
        newX = canvasCenterX - element.width / 2;
        guides.push({ type: 'vertical', position: canvasCenterX });
      }

      // Snap to canvas center vertical
      const canvasCenterY = project.height / 2;
      const elCenterY = newY + element.height / 2;
      if (Math.abs(elCenterY - canvasCenterY) < threshold) {
        newY = canvasCenterY - element.height / 2;
        guides.push({ type: 'horizontal', position: canvasCenterY });
      }

      // Snap to canvas edges
      if (Math.abs(newX) < threshold) {
        newX = 0;
        guides.push({ type: 'vertical', position: 0 });
      }
      if (Math.abs(newY) < threshold) {
        newY = 0;
        guides.push({ type: 'horizontal', position: 0 });
      }

      setAlignmentGuides(guides);
      updateElement(element.id, { x: newX, y: newY }, false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setAlignmentGuides([]);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(element.id, {}, true); // Commit to history
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resizing
  const handleResizeStart = (e: React.MouseEvent, handle: HandleType) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveHandle(handle);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elementX: element.x,
      elementY: element.y,
      elementW: element.width,
      elementH: element.height,
      elementRot: element.rotation || 0,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startRef.current.mouseX) / zoom;
      const deltaY = (moveEvent.clientY - startRef.current.mouseY) / zoom;

      let newX = startRef.current.elementX;
      let newY = startRef.current.elementY;
      let newW = startRef.current.elementW;
      let newH = startRef.current.elementH;

      if (handle.includes('e')) {
        newW = Math.max(20, Math.round(startRef.current.elementW + deltaX));
      }
      if (handle.includes('s')) {
        newH = Math.max(20, Math.round(startRef.current.elementH + deltaY));
      }
      if (handle.includes('w')) {
        const potentialW = Math.round(startRef.current.elementW - deltaX);
        if (potentialW >= 20) {
          newW = potentialW;
          newX = Math.round(startRef.current.elementX + deltaX);
        }
      }
      if (handle.includes('n')) {
        const potentialH = Math.round(startRef.current.elementH - deltaY);
        if (potentialH >= 20) {
          newH = potentialH;
          newY = Math.round(startRef.current.elementY + deltaY);
        }
      }

      updateElement(element.id, { x: newX, y: newY, width: newW, height: newH }, false);
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(element.id, {}, true); // Commit history
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Rotation
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveHandle('rotate');
    const elCenter = {
      x: element.x + element.width / 2,
      y: element.y + element.height / 2,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const canvasEl = document.getElementById('canva-artboard');
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();

      const mouseCanvasX = (moveEvent.clientX - rect.left) / zoom;
      const mouseCanvasY = (moveEvent.clientY - rect.top) / zoom;

      const angleRad = Math.atan2(mouseCanvasY - elCenter.y, mouseCanvasX - elCenter.x);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) - 90; // offset because rotation handle is at bottom
      if (angleDeg < 0) angleDeg += 360;

      // Snap to 45 degree multiples if Shift is pressed
      if (moveEvent.shiftKey) {
        angleDeg = Math.round(angleDeg / 15) * 15;
      }

      setRotationAngle(angleDeg);
      updateElement(element.id, { rotation: angleDeg }, false);
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateElement(element.id, {}, true); // Commit history
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleClasses: Record<HandleType, string> = {
    nw: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
    n: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
    ne: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
    e: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
    se: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
    s: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
    sw: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
    w: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute inset-0 pointer-events-auto border-2 border-purple-600 rounded-sm ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.4), 0 0 12px rgba(125, 42, 232, 0.3)',
      }}
    >
      {/* 8 Resize Handles */}
      {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as HandleType[]).map((h) => (
        <div
          key={h}
          onMouseDown={(e) => handleResizeStart(e, h)}
          className={`absolute w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full shadow-md z-30 transition-transform hover:scale-125 ${handleClasses[h]}`}
        />
      ))}

      {/* Rotation Knob & Stalk */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
        <div className="w-0.5 h-3 bg-purple-600" />
        <div
          onMouseDown={handleRotateStart}
          title="Drag to rotate (Hold Shift for 15° steps)"
          className="w-5 h-5 bg-white border-2 border-purple-600 rounded-full shadow-md flex items-center justify-center cursor-crosshair hover:scale-125 hover:bg-purple-50 transition-transform"
        >
          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
        </div>
      </div>

      {/* Rotation Angle Tooltip during rotate */}
      {activeHandle === 'rotate' && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap">
          {rotationAngle}°
        </div>
      )}

      {/* Dimension Tooltip during resize or drag */}
      {(isDragging || activeHandle) && activeHandle !== 'rotate' && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-mono px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap">
          {element.width} × {element.height} px
        </div>
      )}
    </div>
  );
};
