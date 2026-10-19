import React, { useState } from 'react';
import { useCanva } from '../../context/CanvaContext';
import { CANVAS_PRESETS } from '../../data/stockAssets';
import { Crown, Maximize2, Lock, Unlock, Check } from 'lucide-react';

export const ResizeModal: React.FC = () => {
  const { isResizeModalOpen, setIsResizeModalOpen, project, resizeCanvas } = useCanva();

  const [width, setWidth] = useState<number>(project.width);
  const [height, setHeight] = useState<number>(project.height);
  const [lockRatio, setLockRatio] = useState<boolean>(false);
  const [aspectRatio] = useState<number>(project.width / project.height);

  if (!isResizeModalOpen) return null;

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && val > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && val > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleApplyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    resizeCanvas(w, h);
  };

  const handleApplyCustom = () => {
    if (width > 50 && height > 50) {
      resizeCanvas(width, height);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base leading-tight">Magic Resize</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 font-black rounded">PRO</span>
              </div>
              <p className="text-xs text-slate-400">Instantly reformat to popular social media sizes</p>
            </div>
          </div>
          <button
            onClick={() => setIsResizeModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Custom Size Form */}
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-2">Custom Dimensions</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Width (px)</span>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setLockRatio(!lockRatio)}
                className={`p-2 rounded-lg border mt-4 transition ${
                  lockRatio
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title={lockRatio ? 'Unlock ratio' : 'Lock ratio'}
              >
                {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Height (px)</span>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyCustom}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Preset Sizing Cards */}
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-2">Preset Formats</label>
            <div className="grid grid-cols-2 gap-2">
              {CANVAS_PRESETS.map((preset) => {
                const isCurrent = project.width === preset.width && project.height === preset.height;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.width, preset.height)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between group ${
                      isCurrent
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold group-hover:text-purple-600 transition">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {preset.width} × {preset.height} px
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
