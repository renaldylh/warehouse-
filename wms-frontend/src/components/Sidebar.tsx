import { LayoutDashboard, Package, Inbox, ShoppingCart, Truck, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Inbox, label: 'Receiving', path: '/receiving' },
  { icon: ShoppingCart, label: 'Order', path: '/order' },
  { icon: Truck, label: 'Shipping', path: '/shipping' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-200">
          W
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">WMS Disro</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                  ? 'bg-primary-50 text-primary-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
