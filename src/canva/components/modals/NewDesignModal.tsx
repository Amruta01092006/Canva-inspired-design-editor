import React, { useState } from 'react';
import { useCanva } from '../../context/CanvaContext';
import { CANVAS_PRESETS } from '../../data/stockAssets';
import { Plus, Sparkles, FileText, Smartphone, Camera, Video, Presentation, Image } from 'lucide-react';

export const NewDesignModal: React.FC = () => {
  const { isNewDesignModalOpen, setIsNewDesignModalOpen, newDesign } = useCanva();

  const [title, setTitle] = useState('My Awesome Design');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);

  if (!isNewDesignModalOpen) return null;

  const handleSelectPreset = (w: number, h: number, name: string) => {
    newDesign(w, h, `${name} - ${title}`);
  };

  const handleCreateCustom = () => {
    if (customWidth > 50 && customHeight > 50) {
      newDesign(customWidth, customHeight, title);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Instagram':
        return Camera;
      case 'Smartphone':
        return Smartphone;
      case 'Youtube':
        return Video;
      case 'Presentation':
        return Presentation;
      case 'FileText':
        return FileText;
      default:
        return Image;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Create a New Design</h3>
              <p className="text-xs text-slate-400">Choose a canvas size or specify custom dimensions</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewDesignModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Design Title"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-2">Preset Canvases</label>
            <div className="grid grid-cols-2 gap-2">
              {CANVAS_PRESETS.map((p) => {
                const Icon = getIcon(p.iconName);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.width, p.height, p.name)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-left transition flex items-center gap-2.5 group"
                  >
                    <Icon className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.width} × {p.height} px
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Custom Size */}
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-2">Custom Canvas Size</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Width (px)</span>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Height (px)</span>
                <input
                  type="number"
                  min="50"
                  max="8000"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateCustom}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
