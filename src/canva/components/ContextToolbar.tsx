import React, { useState } from 'react';
import { useCanva } from '../context/CanvaContext';
import { FONT_FAMILIES, COLOR_PALETTES } from '../data/stockAssets';
import { TextElement, ShapeElement, ImageElement } from '../types/canvas';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Trash2,
  ChevronDown,
  Layers,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export const ContextToolbar: React.FC = () => {
  const {
    selectedElement,
    updateElement,
    duplicateElement,
    deleteElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    alignElement,
    project,
    setBackground,
    setIsResizeModalOpen,
  } = useCanva();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<'text' | 'fill' | 'stroke' | 'bg'>('text');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // If nothing is selected, display Canvas Background controls
  if (!selectedElement) {
    return (
      <div className="h-12 bg-white dark:bg-[#18191b] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20 select-none shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Canvas</span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Background color button */}
          <div className="relative">
            <button
              onClick={() => {
                setColorPickerTarget('bg');
                setIsColorPickerOpen(!isColorPickerOpen);
              }}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <div
                className="w-4 h-4 rounded border border-slate-300 shadow-sm"
                style={{
                  background:
                    project.background.type === 'gradient'
                      ? project.background.value
                      : project.background.value || '#ffffff',
                }}
              />
              <span>Background</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isColorPickerOpen && colorPickerTarget === 'bg' && (
              <ColorPickerDropdown
                currentColor={project.background.value}
                onSelect={(val) => {
                  setBackground({ type: 'color', value: val });
                  setIsColorPickerOpen(false);
                }}
                onClose={() => setIsColorPickerOpen(false)}
              />
            )}
          </div>

          <div className="text-xs text-slate-400">
            {project.width} × {project.height} px
          </div>
        </div>

        <button
          onClick={() => setIsResizeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 rounded-md text-xs font-medium border border-purple-200 dark:border-purple-800 transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Magic Resize</span>
        </button>
      </div>
    );
  }

  // --- 1. TEXT ELEMENT CONTROLS ---
  if (selectedElement.type === 'text') {
    const textEl = selectedElement as TextElement;

    return (
      <div className="h-12 bg-white dark:bg-[#18191b] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20 select-none shadow-sm overflow-x-auto text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          {/* Font Family */}
          <select
            value={textEl.fontFamily}
            onChange={(e) => updateElement(textEl.id, { fontFamily: e.target.value }, true)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none hover:border-purple-500 transition cursor-pointer max-w-[140px]"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.name} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Font Size */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            <button
              onClick={() => updateElement(textEl.id, { fontSize: Math.max(8, textEl.fontSize - 2) }, true)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={textEl.fontSize}
              onChange={(e) => updateElement(textEl.id, { fontSize: parseInt(e.target.value) || 12 }, true)}
              className="w-12 text-center text-xs py-1 bg-white dark:bg-slate-900 outline-none"
            />
            <button
              onClick={() => updateElement(textEl.id, { fontSize: textEl.fontSize + 2 }, true)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold"
            >
              +
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Text Color */}
          <div className="relative">
            <button
              onClick={() => {
                setColorPickerTarget('text');
                setIsColorPickerOpen(!isColorPickerOpen);
              }}
              className="w-7 h-7 rounded flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              title="Text Color"
            >
              <div className="w-4 h-4 rounded shadow-sm border border-slate-300" style={{ backgroundColor: textEl.color }} />
            </button>

            {isColorPickerOpen && colorPickerTarget === 'text' && (
              <ColorPickerDropdown
                currentColor={textEl.color}
                onSelect={(val) => {
                  updateElement(textEl.id, { color: val }, true);
                  setIsColorPickerOpen(false);
                }}
                onClose={() => setIsColorPickerOpen(false)}
              />
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Bold, Italic, Underline */}
          <button
            onClick={() => updateElement(textEl.id, { fontWeight: textEl.fontWeight === 'bold' ? 'normal' : 'bold' }, true)}
            className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${textEl.fontWeight === 'bold' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50' : ''}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(textEl.id, { fontStyle: textEl.fontStyle === 'italic' ? 'normal' : 'italic' }, true)}
            className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${textEl.fontStyle === 'italic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50' : ''}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(textEl.id, { textDecoration: textEl.textDecoration === 'underline' ? 'none' : 'underline' }, true)}
            className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${textEl.textDecoration === 'underline' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50' : ''}`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          {/* Alignment */}
          <button
            onClick={() => {
              const order: Array<TextElement['textAlign']> = ['left', 'center', 'right'];
              const next = order[(order.indexOf(textEl.textAlign) + 1) % 3];
              updateElement(textEl.id, { textAlign: next }, true);
            }}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            title={`Align: ${textEl.textAlign}`}
          >
            {textEl.textAlign === 'center' ? <AlignCenter className="w-4 h-4" /> : textEl.textAlign === 'right' ? <AlignRight className="w-4 h-4" /> : <AlignLeft className="w-4 h-4" />}
          </button>

          {/* Uppercase toggle */}
          <button
            onClick={() => updateElement(textEl.id, { textTransform: textEl.textTransform === 'uppercase' ? 'none' : 'uppercase' }, true)}
            className={`px-2 py-1 text-xs font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${textEl.textTransform === 'uppercase' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50' : ''}`}
            title="Uppercase"
          >
            aA
          </button>
        </div>

        {/* Global actions: Position, Duplicate, Delete */}
        <ElementActionButtons
          elementId={selectedElement.id}
          opacity={selectedElement.opacity}
          onOpacityChange={(val) => updateElement(selectedElement.id, { opacity: val }, true)}
          onDuplicate={() => duplicateElement(selectedElement.id)}
          onDelete={() => deleteElement(selectedElement.id)}
          onBringForward={() => bringForward(selectedElement.id)}
          onSendBackward={() => sendBackward(selectedElement.id)}
          onBringToFront={() => bringToFront(selectedElement.id)}
          onSendToBack={() => sendToBack(selectedElement.id)}
          onAlign={(alignment) => alignElement(selectedElement.id, alignment)}
          isLayerMenuOpen={isLayerMenuOpen}
          setIsLayerMenuOpen={setIsLayerMenuOpen}
        />
      </div>
    );
  }

  // --- 2. SHAPE ELEMENT CONTROLS ---
  if (selectedElement.type === 'shape') {
    const shapeEl = selectedElement as ShapeElement;

    return (
      <div className="h-12 bg-white dark:bg-[#18191b] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20 select-none shadow-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          {/* Fill Color */}
          <div className="relative flex items-center gap-1.5">
            <span className="text-xs font-medium">Color:</span>
            <button
              onClick={() => {
                setColorPickerTarget('fill');
                setIsColorPickerOpen(!isColorPickerOpen);
              }}
              className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100"
              title="Fill Color"
            >
              <div className="w-4 h-4 rounded shadow-sm border border-slate-300" style={{ backgroundColor: shapeEl.fillColor }} />
            </button>

            {isColorPickerOpen && colorPickerTarget === 'fill' && (
              <ColorPickerDropdown
                currentColor={shapeEl.fillColor}
                onSelect={(val) => {
                  updateElement(shapeEl.id, { fillColor: val }, true);
                  setIsColorPickerOpen(false);
                }}
                onClose={() => setIsColorPickerOpen(false)}
              />
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Stroke / Border Color */}
          <div className="relative flex items-center gap-1.5">
            <span className="text-xs font-medium">Border:</span>
            <button
              onClick={() => {
                setColorPickerTarget('stroke');
                setIsColorPickerOpen(!isColorPickerOpen);
              }}
              className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100"
              title="Border Color"
            >
              <div className="w-4 h-4 rounded shadow-sm border border-slate-300" style={{ backgroundColor: shapeEl.strokeColor || '#ffffff' }} />
            </button>

            {isColorPickerOpen && colorPickerTarget === 'stroke' && (
              <ColorPickerDropdown
                currentColor={shapeEl.strokeColor || '#ffffff'}
                onSelect={(val) => {
                  updateElement(shapeEl.id, { strokeColor: val, strokeWidth: shapeEl.strokeWidth || 2 }, true);
                  setIsColorPickerOpen(false);
                }}
                onClose={() => setIsColorPickerOpen(false)}
              />
            )}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1.5 text-xs">
            <span>Width:</span>
            <input
              type="range"
              min="0"
              max="20"
              value={shapeEl.strokeWidth || 0}
              onChange={(e) => updateElement(shapeEl.id, { strokeWidth: parseInt(e.target.value) }, true)}
              className="w-20 accent-purple-600"
            />
            <span className="w-5 font-mono">{shapeEl.strokeWidth || 0}px</span>
          </div>
        </div>

        {/* Global actions: Position, Duplicate, Delete */}
        <ElementActionButtons
          elementId={selectedElement.id}
          opacity={selectedElement.opacity}
          onOpacityChange={(val) => updateElement(selectedElement.id, { opacity: val }, true)}
          onDuplicate={() => duplicateElement(selectedElement.id)}
          onDelete={() => deleteElement(selectedElement.id)}
          onBringForward={() => bringForward(selectedElement.id)}
          onSendBackward={() => sendBackward(selectedElement.id)}
          onBringToFront={() => bringToFront(selectedElement.id)}
          onSendToBack={() => sendToBack(selectedElement.id)}
          onAlign={(alignment) => alignElement(selectedElement.id, alignment)}
          isLayerMenuOpen={isLayerMenuOpen}
          setIsLayerMenuOpen={setIsLayerMenuOpen}
        />
      </div>
    );
  }

  // --- 3. IMAGE ELEMENT CONTROLS ---
  if (selectedElement.type === 'image') {
    const imgEl = selectedElement as ImageElement;

    return (
      <div className="h-12 bg-white dark:bg-[#18191b] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20 select-none shadow-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          {/* Filters / Adjust Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>Adjust Filters</span>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4 z-40 text-xs space-y-3">
                <div className="flex items-center justify-between font-bold border-b pb-2">
                  <span>Photo Effects</span>
                  <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Brightness</span>
                    <span>{imgEl.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={imgEl.brightness}
                    onChange={(e) => updateElement(imgEl.id, { brightness: parseInt(e.target.value) }, true)}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Contrast</span>
                    <span>{imgEl.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={imgEl.contrast}
                    onChange={(e) => updateElement(imgEl.id, { contrast: parseInt(e.target.value) }, true)}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Saturation</span>
                    <span>{imgEl.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imgEl.saturation}
                    onChange={(e) => updateElement(imgEl.id, { saturation: parseInt(e.target.value) }, true)}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Blur</span>
                    <span>{imgEl.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={imgEl.blur}
                    onChange={(e) => updateElement(imgEl.id, { blur: parseInt(e.target.value) }, true)}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Grayscale</span>
                    <span>{imgEl.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imgEl.grayscale}
                    onChange={(e) => updateElement(imgEl.id, { grayscale: parseInt(e.target.value) }, true)}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Flip Buttons */}
          <button
            onClick={() => updateElement(imgEl.id, { flipX: !imgEl.flipX }, true)}
            className={`p-1.5 rounded hover:bg-slate-100 ${imgEl.flipX ? 'bg-purple-100 text-purple-700' : ''}`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(imgEl.id, { flipY: !imgEl.flipY }, true)}
            className={`p-1.5 rounded hover:bg-slate-100 ${imgEl.flipY ? 'bg-purple-100 text-purple-700' : ''}`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Global actions: Position, Duplicate, Delete */}
        <ElementActionButtons
          elementId={selectedElement.id}
          opacity={selectedElement.opacity}
          onOpacityChange={(val) => updateElement(selectedElement.id, { opacity: val }, true)}
          onDuplicate={() => duplicateElement(selectedElement.id)}
          onDelete={() => deleteElement(selectedElement.id)}
          onBringForward={() => bringForward(selectedElement.id)}
          onSendBackward={() => sendBackward(selectedElement.id)}
          onBringToFront={() => bringToFront(selectedElement.id)}
          onSendToBack={() => sendToBack(selectedElement.id)}
          onAlign={(alignment) => alignElement(selectedElement.id, alignment)}
          isLayerMenuOpen={isLayerMenuOpen}
          setIsLayerMenuOpen={setIsLayerMenuOpen}
        />
      </div>
    );
  }

  return null;
};

// Reusable Color Picker dropdown
const ColorPickerDropdown: React.FC<{
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}> = ({ currentColor, onSelect, onClose }) => {
  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3 z-40">
      <div className="flex items-center justify-between pb-2 border-b mb-2">
        <span className="text-xs font-bold">Pick Color</span>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="color"
          value={currentColor.startsWith('#') ? currentColor : '#7d2ae8'}
          onChange={(e) => onSelect(e.target.value)}
          className="w-8 h-8 rounded border-none cursor-pointer"
        />
        <input
          type="text"
          value={currentColor}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 text-xs border rounded px-2 py-1 font-mono uppercase"
        />
      </div>

      {/* Preset Swatches */}
      <div className="space-y-2">
        {COLOR_PALETTES.slice(0, 3).map((pal) => (
          <div key={pal.name}>
            <div className="text-[10px] text-slate-400 font-semibold mb-1">{pal.name}</div>
            <div className="grid grid-cols-7 gap-1">
              {pal.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => onSelect(c)}
                  className="w-5 h-5 rounded border border-slate-200 hover:scale-110 transition shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Element Action Buttons (Opacity, Layering, Align, Duplicate, Delete)
const ElementActionButtons: React.FC<{
  elementId: string;
  opacity: number;
  onOpacityChange: (val: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  isLayerMenuOpen: boolean;
  setIsLayerMenuOpen: (open: boolean) => void;
}> = ({
  opacity,
  onOpacityChange,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onAlign,
  isLayerMenuOpen,
  setIsLayerMenuOpen,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Opacity Slider */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span>Transparency:</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={opacity ?? 1}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-16 accent-purple-600"
        />
        <span className="w-8 font-mono">{Math.round((opacity ?? 1) * 100)}%</span>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Position / Layer Menu */}
      <div className="relative">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          title="Position and Layering"
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Position</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isLayerMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-2 z-40 text-xs">
            <div className="font-semibold text-slate-400 px-2 py-1 text-[10px] uppercase">Layer Order</div>
            <button
              onClick={() => {
                onBringForward();
                setIsLayerMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>Bring Forward</span>
              <ArrowUp className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onBringToFront();
                setIsLayerMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-semibold text-purple-600"
            >
              Bring to Front
            </button>
            <button
              onClick={() => {
                onSendBackward();
                setIsLayerMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center justify-between"
            >
              <span>Send Backward</span>
              <ArrowDown className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                onSendToBack();
                setIsLayerMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              Send to Back
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

            <div className="font-semibold text-slate-400 px-2 py-1 text-[10px] uppercase">Align to Canvas</div>
            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => {
                  onAlign('left');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Left
              </button>
              <button
                onClick={() => {
                  onAlign('center');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Center
              </button>
              <button
                onClick={() => {
                  onAlign('right');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Right
              </button>
              <button
                onClick={() => {
                  onAlign('top');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Top
              </button>
              <button
                onClick={() => {
                  onAlign('middle');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Middle
              </button>
              <button
                onClick={() => {
                  onAlign('bottom');
                  setIsLayerMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 rounded text-center"
              >
                Bottom
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition"
        title="Delete (Delete / Backspace)"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
