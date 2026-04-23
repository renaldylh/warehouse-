import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DataTable } from '../components/DataTable';
import { Truck, Search } from 'lucide-react';

const tableHeaders = ['Shipment ID', 'Destination', 'Courier', 'Weight', 'Status'];
const tableData = [
  ['SHP-501', 'Jakarta Hub', 'JNE Express', '12.5 KG', 'In Transit'],
  ['SHP-502', 'Bandung Store', 'SiCepat', '5.2 KG', 'Delivered'],
  ['SHP-503', 'Surabaya Distro', 'J&T', '25.0 KG', 'In Transit'],
  ['SHP-504', 'Medan Branch', 'SBC Cargo', '45.0 KG', 'Packing'],
];

export const ShippingPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Shipping & Logistics" />
        <main className="p-8 space-y-6">
          <div className="bg-primary-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-200">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Track Your Shipments</h2>
                <p className="text-primary-100 mb-6">Monitor all outgoing goods and logistics status in real-time.</p>
                <div className="max-w-md relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" size={20} />
                   <input 
                     type="text" 
                     placeholder="Enter Tracking Number..." 
                     className="w-full bg-primary-700/50 border border-primary-500 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-primary-700 transition-all placeholder:text-primary-300"
                   />
                </div>
             </div>
             <Truck className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-primary-500/20 rotate-[-15deg]" />
          </div>
          <DataTable headers={tableHeaders} data={tableData} />
        </main>
      </div>
    </div>
  );
};
