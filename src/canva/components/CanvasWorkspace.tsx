import React, { useRef, useState, useEffect } from 'react';
import { useCanva } from '../context/CanvaContext';
import { Artboard } from './Artboard';

export const CanvasWorkspace: React.FC = () => {
  const { zoom, pan, setPan, setZoom, setSelectedElementId } = useCanva();
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Listen for spacebar to enable pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        const activeTag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          setSpacePressed(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 3.0);
      setZoom(parseFloat(newZoom.toFixed(2)));
    } else {
      // Regular scroll pans
      setPan({
        x: pan.x - e.deltaX * 0.7,
        y: pan.y - e.deltaY * 0.7,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || spacePressed || e.target === containerRef.current) {
      e.preventDefault();
      setIsPanning(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      if (e.target === containerRef.current) {
        setSelectedElementId(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`flex-1 relative overflow-hidden bg-[#e9ebed] dark:bg-[#13171c] flex items-center justify-center select-none ${
        spacePressed ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Zoomable & Pannable Canvas Wrapper */}
      <div
        className="transition-transform duration-75 origin-center will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <Artboard />
      </div>
    </div>
  );
};
