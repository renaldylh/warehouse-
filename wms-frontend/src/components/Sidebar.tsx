import { 
  LayoutDashboard, 
  Package, 
  Inbox, 
  ShoppingCart, 
  Truck, 
  LogOut, 
  X, 
  Users, 
  Building2, 
  Truck as SupplierIcon 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Inbox, label: 'Receiving', path: '/receiving' },
  { icon: ShoppingCart, label: 'Order', path: '/order' },
  { icon: Truck, label: 'Shipping', path: '/shipping' },
];

const masterDataItems = [
  { icon: SupplierIcon, label: 'Suppliers', path: '/suppliers' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Building2, label: 'Warehouses', path: '/warehouses' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`
        fixed lg:sticky top-0 left-0 w-64 bg-white border-r border-slate-200 h-screen flex flex-col z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-200">
              W
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800">WMS<span className="text-primary-600">PRO</span></span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        </div>
      
        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Management</p>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active 
                        ? 'bg-primary-50 text-primary-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Data</p>
            <div className="space-y-1">
              {masterDataItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active 
                        ? 'bg-primary-50 text-primary-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} className={active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 font-bold">
            <LogOut size={20} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};
