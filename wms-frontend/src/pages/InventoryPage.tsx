import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DataTable } from '../components/DataTable';
import { Search, Filter, Plus } from 'lucide-react';

const tableHeaders = ['ID SKU', 'Nama Produk', 'Stok', 'Lokasi Bin', 'Status'];
const tableData = [
  ['PROD-001', 'Kaos Polos Putih M', '150 PCS', 'A-01-01', 'Stocked'],
  ['PROD-002', 'Kaos Polos Putih L', '85 PCS', 'A-01-02', 'Stocked'],
  ['PROD-003', 'Sweater Navy XL', '24 PCS', 'B-12-05', 'Low Stock'],
  ['PROD-004', 'Celana Cargo Army', '60 PCS', 'C-04-12', 'Stocked'],
  ['PROD-005', 'Jaket Bomber Maroon', '12 PCS', 'B-02-01', 'Critical'],
  ['PROD-006', 'Kaos V-Neck Black', '200 PCS', 'A-04-03', 'Stocked'],
  ['PROD-007', 'Jeans Slim Fit 32', '45 PCS', 'C-01-02', 'Stocked'],
  ['PROD-008', 'Kemeja Polka S', '18 PCS', 'B-08-04', 'Low Stock'],
];

export const InventoryPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Inventory Management" />
        
        <main className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-lg relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Cari SKU atau nama produk..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-800 shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                <Filter size={18} />
                Filter
              </button>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-200 transition-all active:scale-95">
                <Plus size={18} />
                Produk Baru
              </button>
            </div>
          </div>

          <DataTable headers={tableHeaders} data={tableData} />
        </main>
      </div>
    </div>
  );
};
