import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { SummaryCard } from '../components/SummaryCard';
import { DataTable } from '../components/DataTable';
import { Package, Inbox, ShoppingCart, Truck, RefreshCw, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../services/api';

const chartData = [
  { name: 'Inventory', value: 400 },
  { name: 'Receiving', value: 300 },
  { name: 'Order', value: 300 },
  { name: 'Shipping', value: 200 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#3b82f6'];

const tableHeaders = ['ID', 'Nama Barang', 'Kategori', 'Status', 'Tanggal'];
const tableData = [
  ['#001', 'Kaos Polos Cotton Combed', 'Baju', 'Ready', '2026-04-23'],
  ['#002', 'Hoodie Oversized Black', 'Jaket', 'Process', '2026-04-23'],
  ['#003', 'Kemeja Flanel Slim Fit', 'Kemeja', 'Ready', '2026-04-22'],
  ['#004', 'Jeans Denim Blue', 'Celana', 'Ready', '2026-04-22'],
  ['#005', 'T-Shirt Printing Anime', 'Baju', 'Process', '2026-04-22'],
];

export const Dashboard = () => {
  const [stats, setStats] = useState({
    inventory_count: 0,
    receiving_count: 0,
    order_count: 0,
    shipping_count: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          <button 
            onClick={fetchStats}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary-600 flex-shrink-0"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <button className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 flex items-center justify-center gap-2 shadow-md shadow-primary-100 transition-all">
          <Download size={18} />
          Export File
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <SummaryCard label="Inventory" value={stats.inventory_count.toLocaleString()} icon={Package} color="indigo" />
        <SummaryCard label="Receiving" value={stats.receiving_count.toLocaleString()} icon={Inbox} color="emerald" />
        <SummaryCard label="Order" value={stats.order_count.toLocaleString()} icon={ShoppingCart} color="amber" />
        <SummaryCard label="Shipping" value={stats.shipping_count.toLocaleString()} icon={Truck} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 overflow-hidden">
          <DataTable title="Today Task" headers={tableHeaders} data={tableData} />
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 lg:mb-6 text-sm lg:text-base">Distribution Overview</h3>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Inventory', value: stats.inventory_count },
                    { name: 'Receiving', value: stats.receiving_count },
                    { name: 'Order', value: stats.order_count },
                    { name: 'Shipping', value: stats.shipping_count },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};
