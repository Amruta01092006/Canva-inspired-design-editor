import { ProjectData, ProjectMetadata } from '../types/canvas';

const PROJECTS_INDEX_KEY = 'canva_pro_projects_index';
const PROJECT_PREFIX = 'canva_pro_project_';
const AUTOSAVE_KEY = 'canva_pro_autosave_latest';

export const storageUtils = {
  listProjects(): ProjectMetadata[] {
    try {
      const raw = localStorage.getItem(PROJECTS_INDEX_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveProject(project: ProjectData): void {
    try {
      const now = Date.now();
      const updatedProject: ProjectData = {
        ...project,
        updatedAt: now,
      };

      // Save project payload
      localStorage.setItem(PROJECT_PREFIX + project.id, JSON.stringify(updatedProject));

      // Update index
      const projects = this.listProjects();
      const meta: ProjectMetadata = {
        id: updatedProject.id,
        title: updatedProject.title,
        width: updatedProject.width,
        height: updatedProject.height,
        createdAt: updatedProject.createdAt || now,
        updatedAt: now,
        thumbnail: updatedProject.thumbnail,
      };

      const existingIndex = projects.findIndex((p) => p.id === project.id);
      let updatedList: ProjectMetadata[];
      if (existingIndex >= 0) {
        updatedList = [...projects];
        updatedList[existingIndex] = meta;
      } else {
        updatedList = [meta, ...projects];
      }

      localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(updatedList));
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(updatedProject));
    } catch (e) {
      console.warn('Failed to save project to localStorage:', e);
    }
  },

  loadProject(id: string): ProjectData | null {
    try {
      const raw = localStorage.getItem(PROJECT_PREFIX + id);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  deleteProject(id: string): void {
    try {
      localStorage.removeItem(PROJECT_PREFIX + id);
      const projects = this.listProjects().filter((p) => p.id !== id);
      localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to delete project:', e);
    }
  },

  duplicateProject(id: string): ProjectData | null {
    const original = this.loadProject(id);
    if (!original) return null;

    const newId = 'proj_' + Math.random().toString(36).substring(2, 9);
    const duplicated: ProjectData = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      elements: original.elements.map((el) => ({
        ...el,
        id: 'el_' + Math.random().toString(36).substring(2, 9),
      })),
    };

    this.saveProject(duplicated);
    return duplicated;
  },

  getAutoSavedProject(): ProjectData | null {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
