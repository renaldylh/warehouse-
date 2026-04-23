import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { SummaryCard } from '../components/SummaryCard';
import { DataTable } from '../components/DataTable';
import { Package, Inbox, ShoppingCart, Truck, RefreshCw, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Dashboard" />
        
        <main className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                Today
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                Sort by
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary-600">
                <RefreshCw size={18} />
              </button>
            </div>
            
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-md shadow-primary-100 transition-all">
              <Download size={18} />
              Export File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard label="Inventory" value="1,280" icon={Package} color="indigo" />
            <SummaryCard label="Receiving" value="45" icon={Inbox} color="emerald" />
            <SummaryCard label="Order" value="12" icon={ShoppingCart} color="amber" />
            <SummaryCard label="Shipping" value="8" icon={Truck} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DataTable title="Today Task" headers={tableHeaders} data={tableData} />
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-800 mb-6">Distribution Overview</h3>
              <div className="flex-1 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
