import React, { useState } from 'react';
import { useCanva } from '../../context/CanvaContext';
import { exportUtils, ExportOptions } from '../../utils/exportUtils';
import confetti from 'canvas-confetti';
import { Download, Check, Sparkles, Image, FileImage, Sliders } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, project } = useCanva();

  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState<number>(2); // Default to 2x for crisp Retina export
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(0.92);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isExportModalOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setSuccess(false);

    try {
      const options: ExportOptions = {
        format,
        scale,
        transparentBackground: format === 'png' ? transparentBg : false,
        quality: format === 'jpeg' ? quality : undefined,
      };

      await exportUtils.downloadProject(project, options);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSuccess(true);
      setTimeout(() => {
        setIsExportModalOpen(false);
        setSuccess(false);
      }, 1400);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Failed to export design. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const finalWidth = project.width * scale;
  const finalHeight = project.height * scale;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Download Design</h3>
              <p className="text-xs text-slate-400">High-resolution export options</p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* File Type */}
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-2">File Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  format === 'png'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Image className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">PNG Image</div>
                  <div className="text-[10px] text-slate-400">Best for complex graphics & web</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('jpeg')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  format === 'jpeg'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <FileImage className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">JPG Image</div>
                  <div className="text-[10px] text-slate-400">Smaller file size for sharing</div>
                </div>
              </button>
            </div>
          </div>

          {/* Resolution Scale */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Resolution Scale</label>
              <span className="font-mono text-purple-600 font-bold">
                {scale}x ({finalWidth} × {finalHeight} px)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { s: 1, label: '1x Standard', desc: `${project.width}×${project.height}` },
                { s: 2, label: '2x High-Res', desc: `${project.width * 2}×${project.height * 2}` },
                { s: 3, label: '3x Ultra HD', desc: `${project.width * 3}×${project.height * 3}` },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setScale(item.s)}
                  className={`py-2 px-1.5 rounded-lg border text-center transition ${
                    scale === item.s
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Specific Options */}
          {format === 'png' ? (
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">Transparent Background</div>
                <div className="text-[10px] text-slate-400">Export without canvas background color</div>
              </div>
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
              />
            </label>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1 text-slate-700 dark:text-slate-300">
                <span className="font-semibold">JPEG Quality</span>
                <span className="font-mono">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isExporting ? (
              <span>Rendering {scale}x...</span>
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
