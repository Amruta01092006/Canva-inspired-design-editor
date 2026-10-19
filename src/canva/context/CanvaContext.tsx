import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  CanvasBackground,
  CanvasElement,
  ProjectData,
  AlignmentGuide,
  ShapeType,
} from '../types/canvas';
import { TEMPLATES, TemplateDefinition } from '../data/templates';
import { storageUtils } from '../utils/storageUtils';
import { exportUtils } from '../utils/exportUtils';

export type SidebarTab = 'templates' | 'elements' | 'text' | 'uploads' | 'background' | 'projects' | null;

interface CanvaContextType {
  project: ProjectData;
  selectedElementId: string | null;
  selectedElement: CanvasElement | null;
  activeTab: SidebarTab;
  zoom: number;
  pan: { x: number; y: number };
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isExportModalOpen: boolean;
  isResizeModalOpen: boolean;
  isNewDesignModalOpen: boolean;
  alignmentGuides: AlignmentGuide[];
  userUploads: string[];
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setActiveTab: (tab: SidebarTab) => void;
  setSelectedElementId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>, recordHistory?: boolean) => void;
  addTextElement: (preset?: 'heading' | 'subheading' | 'body') => void;
  addShapeElement: (shapeType: ShapeType, color?: string) => void;
  addImageElement: (src: string, name?: string) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  copyElement: (id: string) => void;
  pasteElement: () => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  alignElement: (id: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  setBackground: (bg: Partial<CanvasBackground>) => void;
  setProjectTitle: (title: string) => void;
  resizeCanvas: (width: number, height: number) => void;
  loadTemplate: (template: TemplateDefinition) => void;
  newDesign: (width: number, height: number, title?: string) => void;
  openProject: (project: ProjectData) => void;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  fitToScreen: () => void;
  setPan: (pan: { x: number; y: number }) => void;
  addUpload: (dataUrl: string) => void;
  setIsExportModalOpen: (open: boolean) => void;
  setIsResizeModalOpen: (open: boolean) => void;
  setIsNewDesignModalOpen: (open: boolean) => void;
  setAlignmentGuides: (guides: AlignmentGuide[]) => void;
}

const CanvaContext = createContext<CanvaContextType | undefined>(undefined);

const INITIAL_PROJECT: ProjectData = TEMPLATES[0].data;

export const CanvaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectData>(() => {
    const saved = storageUtils.getAutoSavedProject();
    return saved || INITIAL_PROJECT;
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>('templates');
  const [zoom, setZoom] = useState<number>(0.55);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [isNewDesignModalOpen, setIsNewDesignModalOpen] = useState(false);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [copiedElement, setCopiedElement] = useState<CanvasElement | null>(null);

  const [userUploads, setUserUploads] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('canva_pro_user_uploads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Undo / Redo Stacks
  const [undoStack, setUndoStack] = useState<ProjectData[]>([]);
  const [redoStack, setRedoStack] = useState<ProjectData[]>([]);

  const autoSaveTimerRef = useRef<any>(null);

  const selectedElement = project.elements.find((el) => el.id === selectedElementId) || null;

  // Record history snapshot helper
  const recordHistory = useCallback(
    (currentProject: ProjectData) => {
      setUndoStack((prev) => [...prev.slice(-30), currentProject]);
      setRedoStack([]);
      setSaveStatus('unsaved');
    },
    []
  );

  // Auto-save debounced
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    setSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const thumb = await exportUtils.generateThumbnail(project);
        const projectWithThumb: ProjectData = { ...project, thumbnail: thumb };
        storageUtils.saveProject(projectWithThumb);
        setSaveStatus('saved');
      } catch {
        storageUtils.saveProject(project);
        setSaveStatus('saved');
      }
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [project]);

  // Fit to screen calculation
  const fitToScreen = useCallback(() => {
    const workspaceWidth = window.innerWidth - 380; // minus sidebar and padding
    const workspaceHeight = window.innerHeight - 150; // minus navbar and zoom bar
    const scaleX = workspaceWidth / (project.width + 100);
    const scaleY = workspaceHeight / (project.height + 100);
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.15), 1.2);
    setZoom(parseFloat(fitScale.toFixed(2)));
    setPan({ x: 0, y: 0 });
  }, [project.width, project.height]);

  useEffect(() => {
    fitToScreen();
  }, [project.id, project.width, project.height, fitToScreen]);

  // Keyboard Shortcuts (Delete, Undo, Redo, Copy, Paste, Duplicate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTagName = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      const isInput = activeTagName === 'input' || activeTagName === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        } else if (e.key === 'c' && selectedElementId) {
          e.preventDefault();
          copyElement(selectedElementId);
        } else if (e.key === 'v') {
          e.preventDefault();
          pasteElement();
        } else if (e.key === 'd' && selectedElementId) {
          e.preventDefault();
          duplicateElement(selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Action Implementations
  const updateElement = (id: string, updates: Partial<CanvasElement>, shouldRecordHistory = false) => {
    setProject((prev) => {
      if (shouldRecordHistory) recordHistory(prev);
      const newElements = prev.elements.map((el) => {
        if (el.id === id) {
          return { ...el, ...updates } as CanvasElement;
        }
        return el;
      });
      return { ...prev, elements: newElements };
    });
  };

  const addTextElement = (preset: 'heading' | 'subheading' | 'body' = 'heading') => {
    recordHistory(project);
    const newId = 'txt_' + Math.random().toString(36).substring(2, 9);
    const maxZ = project.elements.reduce((acc, el) => Math.max(acc, el.zIndex), 0);

    let defaultText = 'Add a heading';
    let fontSize = 64;
    let fontWeight: 'normal' | 'bold' | '500' | '600' | '700' | '800' = '800';
    let width = 600;
    let height = 90;

    if (preset === 'subheading') {
      defaultText = 'Add a subheading';
      fontSize = 36;
      fontWeight = '600';
      width = 500;
      height = 60;
    } else if (preset === 'body') {
      defaultText = 'Add a little bit of body text. Click here to customize the content and typography.';
      fontSize = 24;
      fontWeight = 'normal';
      width = 500;
      height = 80;
    }

    const newEl: CanvasElement = {
      id: newId,
      type: 'text',
      name: `${preset.charAt(0).toUpperCase() + preset.slice(1)} Text`,
      text: defaultText,
      fontFamily: 'Inter, sans-serif',
      fontSize,
      color: '#ffffff',
      fontWeight,
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.25,
      x: Math.round((project.width - width) / 2),
      y: Math.round((project.height - height) / 2),
      width,
      height,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
    };

    setProject((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
    setSelectedElementId(newId);
  };

  const addShapeElement = (shapeType: ShapeType, color = '#7d2ae8') => {
    recordHistory(project);
    const newId = 'shape_' + Math.random().toString(36).substring(2, 9);
    const maxZ = project.elements.reduce((acc, el) => Math.max(acc, el.zIndex), 0);

    const width = shapeType === 'line' ? 300 : shapeType.startsWith('badge') ? 220 : 200;
    const height = shapeType === 'line' ? 10 : shapeType.startsWith('badge') ? 60 : 200;

    const newEl: CanvasElement = {
      id: newId,
      type: 'shape',
      name: `${shapeType} Shape`,
      shapeType,
      fillColor: shapeType === 'line' ? '#ffffff' : color,
      strokeColor: '#ffffff',
      strokeWidth: shapeType === 'line' ? 4 : 0,
      cornerRadius: shapeType === 'rounded-rectangle' ? 24 : 0,
      x: Math.round((project.width - width) / 2),
      y: Math.round((project.height - height) / 2),
      width,
      height,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
    };

    setProject((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
    setSelectedElementId(newId);
  };

  const addImageElement = (src: string, name = 'Image') => {
    recordHistory(project);
    const newId = 'img_' + Math.random().toString(36).substring(2, 9);
    const maxZ = project.elements.reduce((acc, el) => Math.max(acc, el.zIndex), 0);

    const width = Math.min(500, Math.round(project.width * 0.7));
    const height = Math.min(400, Math.round(project.height * 0.6));

    const newEl: CanvasElement = {
      id: newId,
      type: 'image',
      name,
      src,
      x: Math.round((project.width - width) / 2),
      y: Math.round((project.height - height) / 2),
      width,
      height,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      flipX: false,
      flipY: false,
    };

    setProject((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
    setSelectedElementId(newId);
  };

  const deleteElement = (id: string) => {
    recordHistory(project);
    setProject((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const duplicateElement = (id: string) => {
    const el = project.elements.find((e) => e.id === id);
    if (!el) return;

    recordHistory(project);
    const newId = 'dup_' + Math.random().toString(36).substring(2, 9);
    const maxZ = project.elements.reduce((acc, e) => Math.max(acc, e.zIndex), 0);

    const duplicated: CanvasElement = {
      ...el,
      id: newId,
      name: `${el.name} (Copy)`,
      x: el.x + 30,
      y: el.y + 30,
      zIndex: maxZ + 1,
    };

    setProject((prev) => ({ ...prev, elements: [...prev.elements, duplicated] }));
    setSelectedElementId(newId);
  };

  const copyElement = (id: string) => {
    const el = project.elements.find((e) => e.id === id);
    if (el) setCopiedElement(el);
  };

  const pasteElement = () => {
    if (!copiedElement) return;
    recordHistory(project);
    const newId = 'pasted_' + Math.random().toString(36).substring(2, 9);
    const maxZ = project.elements.reduce((acc, e) => Math.max(acc, e.zIndex), 0);

    const pasted: CanvasElement = {
      ...copiedElement,
      id: newId,
      name: `${copiedElement.name} (Pasted)`,
      x: copiedElement.x + 40,
      y: copiedElement.y + 40,
      zIndex: maxZ + 1,
    };

    setProject((prev) => ({ ...prev, elements: [...prev.elements, pasted] }));
    setSelectedElementId(newId);
  };

  const bringForward = (id: string) => {
    const el = project.elements.find((e) => e.id === id);
    if (!el) return;
    recordHistory(project);
    setProject((prev) => {
      const sorted = [...prev.elements].sort((a, b) => a.zIndex - b.zIndex);
      const index = sorted.findIndex((e) => e.id === id);
      if (index < sorted.length - 1) {
        const temp = sorted[index].zIndex;
        sorted[index].zIndex = sorted[index + 1].zIndex;
        sorted[index + 1].zIndex = temp;
      }
      return { ...prev, elements: sorted };
    });
  };

  const sendBackward = (id: string) => {
    const el = project.elements.find((e) => e.id === id);
    if (!el) return;
    recordHistory(project);
    setProject((prev) => {
      const sorted = [...prev.elements].sort((a, b) => a.zIndex - b.zIndex);
      const index = sorted.findIndex((e) => e.id === id);
      if (index > 0) {
        const temp = sorted[index].zIndex;
        sorted[index].zIndex = sorted[index - 1].zIndex;
        sorted[index - 1].zIndex = temp;
      }
      return { ...prev, elements: sorted };
    });
  };

  const bringToFront = (id: string) => {
    recordHistory(project);
    setProject((prev) => {
      const maxZ = prev.elements.reduce((acc, el) => Math.max(acc, el.zIndex), 0);
      return {
        ...prev,
        elements: prev.elements.map((el) => (el.id === id ? { ...el, zIndex: maxZ + 1 } : el)),
      };
    });
  };

  const sendToBack = (id: string) => {
    recordHistory(project);
    setProject((prev) => {
      const minZ = prev.elements.reduce((acc, el) => Math.min(acc, el.zIndex), 0);
      return {
        ...prev,
        elements: prev.elements.map((el) => (el.id === id ? { ...el, zIndex: minZ - 1 } : el)),
      };
    });
  };

  const alignElement = (
    id: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => {
    const el = project.elements.find((e) => e.id === id);
    if (!el) return;
    recordHistory(project);

    let newX = el.x;
    let newY = el.y;

    if (alignment === 'left') newX = 40;
    else if (alignment === 'center') newX = Math.round((project.width - el.width) / 2);
    else if (alignment === 'right') newX = project.width - el.width - 40;
    else if (alignment === 'top') newY = 40;
    else if (alignment === 'middle') newY = Math.round((project.height - el.height) / 2);
    else if (alignment === 'bottom') newY = project.height - el.height - 40;

    updateElement(id, { x: newX, y: newY });
  };

  const setBackground = (bg: Partial<CanvasBackground>) => {
    recordHistory(project);
    setProject((prev) => ({
      ...prev,
      background: { ...prev.background, ...bg },
    }));
  };

  const setProjectTitle = (title: string) => {
    setProject((prev) => ({ ...prev, title }));
  };

  const resizeCanvas = (width: number, height: number) => {
    recordHistory(project);
    setProject((prev) => ({ ...prev, width, height }));
    setIsResizeModalOpen(false);
  };

  const loadTemplate = (template: TemplateDefinition) => {
    recordHistory(project);
    const newProject: ProjectData = {
      ...template.data,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProject(newProject);
    setSelectedElementId(null);
  };

  const newDesign = (width: number, height: number, title = 'Untitled Design') => {
    recordHistory(project);
    const emptyProj: ProjectData = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      title,
      width,
      height,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      background: {
        type: 'color',
        value: '#ffffff',
      },
      elements: [],
    };
    setProject(emptyProj);
    setSelectedElementId(null);
    setIsNewDesignModalOpen(false);
  };

  const openProject = (proj: ProjectData) => {
    recordHistory(project);
    setProject(proj);
    setSelectedElementId(null);
    setActiveTab(null);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, project]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setProject(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, project]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setProject(next);
  };

  const addUpload = (dataUrl: string) => {
    setUserUploads((prev) => {
      const updated = [dataUrl, ...prev];
      localStorage.setItem('canva_pro_user_uploads', JSON.stringify(updated.slice(0, 30)));
      return updated;
    });
  };

  return (
    <CanvaContext.Provider
      value={{
        project,
        selectedElementId,
        selectedElement,
        activeTab,
        zoom,
        pan,
        saveStatus,
        isExportModalOpen,
        isResizeModalOpen,
        isNewDesignModalOpen,
        alignmentGuides,
        userUploads,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        setActiveTab,
        setSelectedElementId,
        updateElement,
        addTextElement,
        addShapeElement,
        addImageElement,
        deleteElement,
        duplicateElement,
        copyElement,
        pasteElement,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        alignElement,
        setBackground,
        setProjectTitle,
        resizeCanvas,
        loadTemplate,
        newDesign,
        openProject,
        undo,
        redo,
        setZoom,
        fitToScreen,
        setPan,
        addUpload,
        setIsExportModalOpen,
        setIsResizeModalOpen,
        setIsNewDesignModalOpen,
        setAlignmentGuides,
      }}
    >
      {children}
    </CanvaContext.Provider>
  );
};

export const useCanva = () => {
  const context = useContext(CanvaContext);
  if (!context) throw new Error('useCanva must be used within CanvaProvider');
  return context;
};
