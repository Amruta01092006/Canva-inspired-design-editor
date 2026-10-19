import React from 'react';
import { CanvaProvider } from './context/CanvaContext';
import { Navbar } from './components/Navbar';
import { SidebarRail } from './components/SidebarRail';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ContextToolbar } from './components/ContextToolbar';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { ZoomBar } from './components/ZoomBar';
import { ExportModal } from './components/modals/ExportModal';
import { ResizeModal } from './components/modals/ResizeModal';
import { NewDesignModal } from './components/modals/NewDesignModal';

interface CanvaAppProps {
  onSwitchToCivicApp?: () => void;
}

const CanvaEditorInner: React.FC<CanvaAppProps> = ({ onSwitchToCivicApp }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 font-sans select-none">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Sidebar Icon Rail */}
        <SidebarRail />

        {/* Expandable Sidebar Drawer (Templates, Elements, Text, Uploads, Background, Projects) */}
        <SidebarDrawer />

        {/* Center Workspace & Contextual Editing Toolbar */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ContextToolbar />
          <CanvasWorkspace />
          <ZoomBar />
        </div>
      </div>

      {/* Global Modals */}
      <ExportModal />
      <ResizeModal />
      <NewDesignModal />

      {/* Subtle Mode Switcher Float in bottom-left */}
      {onSwitchToCivicApp && (
        <button
          onClick={onSwitchToCivicApp}
          className="fixed bottom-12 right-4 z-40 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-semibold border border-slate-700 shadow-xl backdrop-blur transition flex items-center gap-1.5"
          title="Switch to Nagrik Seva Prototype"
        >
          <span>← Back to Nagrik Seva</span>
        </button>
      )}
    </div>
  );
};

export const CanvaApp: React.FC<CanvaAppProps> = (props) => {
  return (
    <CanvaProvider>
      <CanvaEditorInner {...props} />
    </CanvaProvider>
  );
};

export default CanvaApp;
