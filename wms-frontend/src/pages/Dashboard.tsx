import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const chartData = [
  { name: 'Mon', sales: 4000, inventory: 2400 },
  { name: 'Tue', sales: 3000, inventory: 1398 },
  { name: 'Wed', sales: 2000, inventory: 9800 },
  { name: 'Thu', sales: 2780, inventory: 3908 },
  { name: 'Fri', sales: 1890, inventory: 4800 },
  { name: 'Sat', sales: 2390, inventory: 3800 },
  { name: 'Sun', sales: 3490, inventory: 4300 },
];

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total SKU', 
      value: stats?.total_products || '0', 
      icon: Package, 
      color: 'bg-blue-500', 
      trend: '+12%', 
      isPositive: true 
    },
    { 
      label: 'Pesanan Aktif', 
      value: stats?.total_orders || '0', 
      icon: ShoppingCart, 
      color: 'bg-emerald-500', 
      trend: '+5%', 
      isPositive: true 
    },
    { 
      label: 'Stok Menipis', 
      value: stats?.low_stock_count || '0', 
      icon: AlertCircle, 
      color: 'bg-amber-500', 
      trend: '-2%', 
      isPositive: false 
    },
    { 
      label: 'Total Nilai Aset', 
      value: `Rp ${(stats?.total_value || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-violet-500', 
      trend: '+18%', 
      isPositive: true 
    },
  ];

  return (
    <Layout title="Warehouse Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{loading ? '...' : card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Sales & Inventory Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800">Analisis Pergerakan Stok</h3>
              <p className="text-slate-500 text-sm">Data 7 hari terakhir</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none ring-1 ring-slate-200">
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.movement_data || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="inventory" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Aktivitas Terbaru</h3>
            <Clock className="text-slate-400" size={20} />
          </div>
          <div className="space-y-6 flex-1">
            {stats?.recent_activities?.map((log: any) => (
              <div key={log.id} className="flex gap-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  log.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    {log.type === 'IN' ? 'Masuk' : 'Keluar'}: {log.product?.sku}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {log.quantity} Unit - {log.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
              <p className="text-center text-slate-400 text-sm py-10">Belum ada aktivitas.</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-primary-600 bg-primary-50 rounded-2xl hover:bg-primary-100 transition-colors">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </Layout>
  );
};
