import React from 'react';
import { useCanva } from '../context/CanvaContext';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

export const ZoomBar: React.FC = () => {
  const { zoom, setZoom, fitToScreen, project, pan, setPan } = useCanva();

  const handleZoomChange = (newZoom: number) => {
    setZoom(parseFloat(Math.min(Math.max(newZoom, 0.1), 3.0).toFixed(2)));
  };

  return (
    <div className="h-9 bg-white dark:bg-[#18191b] border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-xs text-slate-500 z-20 select-none shrink-0 shadow-sm">
      {/* Left: Canvas Information */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {project.width} × {project.height} px
        </span>
        <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-[11px] text-slate-400">
          {project.elements.length} element{project.elements.length === 1 ? '' : 's'}
        </span>
        {(pan.x !== 0 || pan.y !== 0) && (
          <button
            onClick={() => setPan({ x: 0, y: 0 })}
            className="flex items-center gap-1 text-[11px] text-purple-600 hover:underline"
            title="Reset canvas offset"
          >
            <Move className="w-3 h-3" />
            <span>Reset Pan</span>
          </button>
        )}
      </div>

      {/* Right: Zoom controls */}
      <div className="flex items-center gap-2">
        {/* Zoom Out */}
        <button
          onClick={() => handleZoomChange(zoom - 0.1)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Slider */}
        <input
          type="range"
          min="0.15"
          max="2.0"
          step="0.05"
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-24 accent-purple-600 cursor-pointer"
        />

        {/* Zoom In */}
        <button
          onClick={() => handleZoomChange(zoom + 0.1)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Percentage Label */}
        <span className="w-12 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
          {Math.round(zoom * 100)}%
        </span>

        <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Fit to Screen */}
        <button
          onClick={fitToScreen}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
          title="Fit canvas to workspace"
        >
          <Maximize2 className="w-3 h-3 text-purple-600" />
          <span>Fit</span>
        </button>
      </div>
    </div>
  );
};
