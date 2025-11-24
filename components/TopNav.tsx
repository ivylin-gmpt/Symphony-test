import React from 'react';
import { Bell, Globe, Menu, ChevronDown, ArrowLeft } from 'lucide-react';

interface TopNavProps {
  onMenuClick?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, showBackButton, onBack }) => {
  return (
    <header className="h-[60px] bg-[#121212] text-white flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <button 
            className="p-1 hover:bg-gray-800 rounded text-gray-300 transition-colors"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <button 
            className="p-1 hover:bg-gray-800 rounded text-gray-300 transition-colors"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div 
          className={`flex items-center gap-2 ${showBackButton ? 'cursor-pointer group' : ''}`}
          onClick={showBackButton ? onBack : undefined}
        >
          {/* Logo / Title Area - Text removed as per request */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 text-sm transition-colors">
          <Globe size={14} />
          <span>English</span>
        </button>

        <button className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 transition-colors">
          <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">S</div>
          <span className="text-sm">Samantha</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
};