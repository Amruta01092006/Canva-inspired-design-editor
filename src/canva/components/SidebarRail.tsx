import React from 'react';
import { useCanva, SidebarTab } from '../context/CanvaContext';
import {
  LayoutTemplate,
  Shapes,
  Type,
  UploadCloud,
  Palette,
  FolderKanban,
} from 'lucide-react';

interface TabItem {
  id: SidebarTab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'templates', label: 'Design', icon: LayoutTemplate },
  { id: 'elements', label: 'Elements', icon: Shapes },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'uploads', label: 'Uploads', icon: UploadCloud },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
];

export const SidebarRail: React.FC = () => {
  const { activeTab, setActiveTab } = useCanva();

  return (
    <aside className="w-[72px] bg-[#0e1318] text-slate-400 flex flex-col items-center py-3 select-none z-30 shrink-0 border-r border-slate-800">
      <div className="flex flex-col gap-1 w-full px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(isActive ? null : tab.id)}
              className={`w-full py-2.5 px-1 flex flex-col items-center justify-center rounded-lg transition-all text-[11px] font-medium gap-1 relative ${
                isActive
                  ? 'bg-purple-600/20 text-white font-semibold'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple-500 rounded-r" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="truncate w-full text-center tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
