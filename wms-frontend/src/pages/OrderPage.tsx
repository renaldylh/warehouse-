import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DataTable } from '../components/DataTable';
import { ShoppingCart, Plus, Filter } from 'lucide-react';

const tableHeaders = ['Order ID', 'Customer', 'Product', 'Qty', 'Status'];
const tableData = [
  ['ORD-8821', 'Rizky Mall', 'Kaos Polos White', '100', 'Pending'],
  ['ORD-8822', 'Fashion Store', 'Hoodie Black', '50', 'Processing'],
  ['ORD-8823', 'Distro Bandung', 'Jeans Denim', '200', 'Processing'],
  ['ORD-8824', 'Urban Style', 'T-Shirt Print', '30', 'Completed'],
];

export const OrderPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Order Management" />
        <main className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={24} className="text-primary-600" />
              Active Orders
            </h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
                <Filter size={18} /> Filter
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Plus size={18} /> New Order
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataTable title="Recent Orders" headers={tableHeaders} data={tableData} />
            <DataTable title="Order History" headers={tableHeaders} data={tableData.map(r => [r[0], r[1], r[2], r[3], 'Completed'])} />
          </div>
        </main>
      </div>
    </div>
  );
};
