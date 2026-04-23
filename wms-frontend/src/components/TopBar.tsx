import { Bell, User, Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onMenuClick }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 truncate max-w-[100px] lg:max-w-none">Admin Ganteng</p>
            <p className="text-xs text-slate-500">Warehouse Manager</p>
          </div>
          <div className="w-9 h-9 lg:w-10 lg:h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm flex-shrink-0">
            <User size={18} className="lg:hidden" />
            <User size={20} className="hidden lg:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
