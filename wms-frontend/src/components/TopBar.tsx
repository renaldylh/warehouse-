import React from 'react';
import { Bell, User } from 'lucide-react';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Admin Ganteng</p>
            <p className="text-xs text-slate-500">Warehouse Manager</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
