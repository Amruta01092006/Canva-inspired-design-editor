import React, { useState, useRef } from 'react';
import { useCanva } from '../context/CanvaContext';
import { TEMPLATES } from '../data/templates';
import { COLOR_PALETTES, GRADIENT_PRESETS, STOCK_PHOTOS, FONT_FAMILIES } from '../data/stockAssets';
import { ShapeType } from '../types/canvas';
import { storageUtils } from '../utils/storageUtils';
import {
  Search,
  Upload,
  Plus,
  Trash2,
  Copy,
  FolderOpen,
  Sparkles,
  ChevronRight,
  Maximize2,
  Star,
  Square,
  Circle,
  Triangle,
  Heart,
  ArrowRight,
  Minus,
  Hexagon,
} from 'lucide-react';

export const SidebarDrawer: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    loadTemplate,
    addTextElement,
    addShapeElement,
    addImageElement,
    setBackground,
    userUploads,
    addUpload,
    openProject,
    setIsNewDesignModalOpen,
  } = useCanva();

  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeTab) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          addUpload(result);
          addImageElement(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-[#18191b] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 shadow-md shrink-0 select-none animate-in slide-in-from-left-2 duration-150">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
          {activeTab === 'templates' ? 'Design Templates' : activeTab}
        </h2>
        <button
          onClick={() => setActiveTab(null)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      {/* Search Bar for searchable tabs */}
      {(activeTab === 'templates' || activeTab === 'elements' || activeTab === 'uploads') && (
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>
      )}

      {/* Drawer Content Views */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* === 1. TEMPLATES TAB === */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500">Pro Ready-to-Use Templates</div>
            <div className="space-y-3">
              {TEMPLATES.filter((t) =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-pointer shadow-sm hover:shadow-md transition bg-slate-50 dark:bg-slate-800"
                >
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-2.5 bg-white dark:bg-slate-900 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition">
                        {tmpl.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tmpl.data.width} × {tmpl.data.height} px • {tmpl.category}
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-semibold">
                      Use
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === 2. ELEMENTS & SHAPES TAB === */}
        {activeTab === 'elements' && (
          <div className="space-y-5">
            {/* Shapes Grid */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Basic Shapes</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'rectangle' as ShapeType, label: 'Box', icon: Square },
                  { type: 'rounded-rectangle' as ShapeType, label: 'Rounded', icon: Square },
                  { type: 'circle' as ShapeType, label: 'Circle', icon: Circle },
                  { type: 'triangle' as ShapeType, label: 'Triangle', icon: Triangle },
                  { type: 'star' as ShapeType, label: 'Star', icon: Star },
                  { type: 'polygon' as ShapeType, label: 'Hexagon', icon: Hexagon },
                  { type: 'heart' as ShapeType, label: 'Heart', icon: Heart },
                  { type: 'arrow' as ShapeType, label: 'Arrow', icon: ArrowRight },
                  { type: 'line' as ShapeType, label: 'Line', icon: Minus },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.type}
                      onClick={() => addShapeElement(s.type)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition group"
                    >
                      <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition" />
                      <span className="text-[10px] text-slate-500 group-hover:text-purple-600">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badges & Ribbons */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Promotional Badges</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addShapeElement('badge-sale', '#e11d48')}
                  className="py-2.5 px-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold text-center shadow-sm transition hover:scale-105"
                >
                  50% OFF
                </button>
                <button
                  onClick={() => addShapeElement('badge-new', '#00c4cc')}
                  className="py-2.5 px-2 bg-[#00c4cc] hover:bg-[#00b0b8] text-white rounded-lg text-xs font-bold text-center shadow-sm transition hover:scale-105"
                >
                  NEW
                </button>
                <button
                  onClick={() => addShapeElement('badge-pro', '#7d2ae8')}
                  className="py-2.5 px-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold text-center shadow-sm transition hover:scale-105 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>PRO</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === 3. TEXT TAB === */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 mb-2">Default Text Styles</div>

            {/* Heading Button */}
            <button
              onClick={() => addTextElement('heading')}
              className="w-full py-3.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700 hover:border-purple-400 rounded-lg text-left transition flex items-center justify-between group"
            >
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-purple-600">
                Add a heading
              </span>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Subheading Button */}
            <button
              onClick={() => addTextElement('subheading')}
              className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700 hover:border-purple-400 rounded-lg text-left transition flex items-center justify-between group"
            >
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-600">
                Add a subheading
              </span>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Body Text Button */}
            <button
              onClick={() => addTextElement('body')}
              className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700 hover:border-purple-400 rounded-lg text-left transition flex items-center justify-between group"
            >
              <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-purple-600">
                Add a little bit of body text
              </span>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Font Style Inspirations */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 mb-2">Curated Typography</div>
              <div className="space-y-2">
                {[
                  { name: 'Luxury Editorial', font: '"Playfair Display", serif', color: '#d4af37' },
                  { name: 'Cyberpunk Bold', font: 'Montserrat, sans-serif', color: '#00f0ff' },
                  { name: 'Warm Handwritten', font: '"Dancing Script", cursive', color: '#ff4081' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => addTextElement('heading')}
                    className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-800 hover:border-purple-500 text-center transition hover:scale-[1.02]"
                    style={{ fontFamily: item.font, color: item.color }}
                  >
                    <div className="text-lg font-bold">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === 4. UPLOADS & STOCK PHOTOS TAB === */}
        {activeTab === 'uploads' && (
          <div className="space-y-5">
            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Local Images</span>
            </button>

            {/* User Uploads */}
            {userUploads.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Your Uploads</div>
                <div className="grid grid-cols-2 gap-2">
                  {userUploads.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => addImageElement(src, `Upload ${i + 1}`)}
                      className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-pointer aspect-video bg-slate-100"
                    >
                      <img src={src} alt="Uploaded" className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-semibold">
                        Add to Design
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Photo Library */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Stock Library (High Quality)</div>
              <div className="grid grid-cols-2 gap-2">
                {STOCK_PHOTOS.filter((p) =>
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => addImageElement(photo.url, photo.title)}
                    className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-pointer aspect-video bg-slate-100"
                  >
                    <img src={photo.thumb} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 p-1.5 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold leading-tight">{photo.title}</span>
                      <span className="text-[8px] text-slate-300">{photo.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === 5. BACKGROUND TAB === */}
        {activeTab === 'background' && (
          <div className="space-y-5">
            {/* Solid Colors */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Solid Colors</div>
              <div className="grid grid-cols-6 gap-2">
                {[
                  '#ffffff', '#000000', '#f8fafc', '#18191b', '#00c4cc', '#7d2ae8',
                  '#ff007f', '#ff5722', '#ffc107', '#4caf50', '#03a9f4', '#3f51b5'
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackground({ type: 'color', value: color })}
                    className="w-10 h-10 rounded-lg border border-slate-300 hover:scale-110 shadow-sm transition"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Vibrant Gradients */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Canva Aura Gradients</div>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((grad) => (
                  <button
                    key={grad.name}
                    onClick={() => setBackground({ type: 'gradient', value: grad.value })}
                    className="h-16 rounded-lg border border-slate-200 hover:border-purple-500 hover:scale-105 shadow-sm transition p-2 text-left flex flex-col justify-end text-white text-[10px] font-bold"
                    style={{ background: grad.value }}
                  >
                    <span className="drop-shadow">{grad.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Backgrounds */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2">Photo Wallpapers</div>
              <div className="grid grid-cols-2 gap-2">
                {STOCK_PHOTOS.slice(0, 4).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setBackground({ type: 'image', value: photo.url })}
                    className="h-20 rounded-lg overflow-hidden border border-slate-200 hover:border-purple-500 hover:scale-105 shadow-sm transition relative"
                  >
                    <img src={photo.thumb} alt={photo.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white drop-shadow">
                      {photo.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === 6. PROJECTS TAB === */}
        {activeTab === 'projects' && (
          <ProjectsList onOpenProject={openProject} onNewDesign={() => setIsNewDesignModalOpen(true)} />
        )}
      </div>
    </div>
  );
};

// Sub-component for listing projects in Projects tab
const ProjectsList: React.FC<{
  onOpenProject: (proj: any) => void;
  onNewDesign: () => void;
}> = ({ onOpenProject, onNewDesign }) => {
  const [projects, setProjects] = useState(storageUtils.listProjects());

  const refreshList = () => {
    setProjects(storageUtils.listProjects());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved project?')) {
      storageUtils.deleteProject(id);
      refreshList();
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    storageUtils.duplicateProject(id);
    refreshList();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onNewDesign}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
      >
        <Plus className="w-4 h-4" />
        <span>Create Blank Design</span>
      </button>

      <div className="text-xs font-semibold text-slate-500">Your Saved Projects ({projects.length})</div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No saved projects yet. Changes to your design are auto-saved automatically!
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                const fullProj = storageUtils.loadProject(p.id);
                if (fullProj) onOpenProject(fullProj);
              }}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-lg cursor-pointer flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt="" className="w-10 h-10 rounded border object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-600">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {p.width} × {p.height} px • {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => handleDuplicate(e, p.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, p.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
