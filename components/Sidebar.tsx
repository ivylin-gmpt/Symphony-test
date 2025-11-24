import React from 'react';
import { NAV_ITEMS, PRODUCTION_ITEMS, POST_PRODUCTION_ITEMS, LIBRARY_ITEMS } from '../constants';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const SidebarSection = ({ title, items, isOpen }: { title?: string, items: any[], isOpen: boolean }) => (
  <div className="mb-6">
    {title && isOpen && <h3 className="px-4 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>}
    <ul>
      {items.map((item, idx) => (
        <li key={idx} className="mb-1">
          <a
            href="#"
            className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors group
              ${item.active 
                ? 'bg-cyan-50 text-cyan-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
              }
              ${isOpen ? 'justify-between' : 'justify-center px-2'}
            `}
            title={!isOpen ? item.label : undefined}
          >
            <div className={`flex items-center ${isOpen ? 'gap-3' : ''}`}>
              <item.icon size={18} className={item.active ? 'text-cyan-600' : 'text-gray-500'} />
              {isOpen && <span>{item.label}</span>}
            </div>
            {isOpen && item.hasSubmenu && <ChevronDown size={14} className="text-gray-400" />}
          </a>
          {/* Mock submenu for scene generator to match screenshot */}
          {isOpen && item.label === 'Scene generator' && (
            <ul className="ml-9 mt-1 space-y-1 border-l border-gray-200 pl-3">
              <li><a href="#" className="block py-1.5 text-sm text-gray-500 hover:text-gray-900">Image to video</a></li>
              <li><a href="#" className="block py-1.5 text-sm text-gray-500 hover:text-gray-900">Text to video</a></li>
              <li><a href="#" className="block py-1.5 text-sm text-gray-500 hover:text-gray-900">Showcase product</a></li>
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  // Assign to capitalized variable to use as JSX tag
  const activeNavItem = NAV_ITEMS[0];
  const ActiveIcon = activeNavItem.icon;

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 h-[calc(100vh-60px)] overflow-y-auto sticky top-[60px] hidden md:block transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="mb-2">
           {/* Main button styled like the active state in screenshot */}
           <a href="#" className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-0'} py-2.5 bg-[#E0F7FA] text-[#00838F] rounded-lg text-sm font-medium transition-all`}>
             <ActiveIcon size={18} />
             {isOpen && activeNavItem.label}
           </a>
        </div>
        
        <div className="mt-6">
          <SidebarSection title="Production" items={PRODUCTION_ITEMS} isOpen={isOpen} />
          <SidebarSection title="Post-production" items={POST_PRODUCTION_ITEMS} isOpen={isOpen} />
          <SidebarSection title="Library" items={LIBRARY_ITEMS} isOpen={isOpen} />
        </div>
      </div>
    </aside>
  );
};