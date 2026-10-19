import React, { useState } from 'react';
import { useCanva } from '../context/CanvaContext';
import {
  Undo2,
  Redo2,
  Cloud,
  CloudCheck,
  Download,
  Share2,
  Sparkles,
  Maximize2,
  Crown,
  FilePlus,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    project,
    setProjectTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    setIsExportModalOpen,
    setIsResizeModalOpen,
    setIsNewDesignModalOpen,
  } = useCanva();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="h-14 bg-gradient-to-r from-[#0e1318] via-[#141920] to-[#0e1318] text-white px-4 flex items-center justify-between border-b border-slate-800 z-30 select-none shadow-md shrink-0">
      {/* Left: Logo & File Controls */}
      <div className="flex items-center gap-4">
        {/* Canva Pro Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00c4cc] to-[#7d2ae8] flex items-center justify-center shadow-lg shadow-purple-900/30">
            <span className="font-extrabold text-white text-base tracking-tighter">C</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Canva
            </span>
            <span className="flex items-center gap-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow-sm">
              <Crown className="w-2.5 h-2.5 fill-current" />
              <span>PRO</span>
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-700/60" />

        {/* Editable Title */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProjectTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-slate-800 border border-purple-500 rounded px-2 py-1 text-xs text-white outline-none w-56 font-medium"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-slate-200 hover:bg-slate-800/80 px-2 py-1 rounded cursor-pointer transition max-w-[200px] truncate border border-transparent hover:border-slate-700"
              title="Click to rename design"
            >
              {project.title || 'Untitled Design'}
            </div>
          )}

          {/* New Design button */}
          <button
            onClick={() => setIsNewDesignModalOpen(true)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition text-xs"
            title="Create New Blank Design"
          >
            <FilePlus className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-700/60" />

        {/* Magic Resize Button */}
        <button
          onClick={() => setIsResizeModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 transition shadow-sm"
        >
          <Crown className="w-3 h-3 text-amber-400 fill-current" />
          <span>Resize</span>
          <span className="text-[10px] text-slate-400">({project.width}×{project.height})</span>
        </button>
      </div>

      {/* Middle: Undo / Redo & Cloud Save Status */}
      <div className="flex items-center gap-3">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1.5 rounded transition ${
            canUndo
              ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1.5 rounded transition ${
            canRedo
              ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-700/60" />

        {/* Cloud Auto-save Status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          {saveStatus === 'saving' ? (
            <>
              <Cloud className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span className="text-[11px] text-amber-300">Saving...</span>
            </>
          ) : (
            <>
              <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-300">All changes saved</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Share & Download Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-300" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>

        {/* Download / Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </header>
  );
};
