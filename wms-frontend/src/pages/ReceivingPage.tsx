import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DataTable } from '../components/DataTable';
import { Inbox, Filter, Download } from 'lucide-react';

const tableHeaders = ['Reception ID', 'Supplier', 'Items Received', 'Condition', 'Date'];
const tableData = [
  ['REC-101', 'Cotton Direct', '500 Rolls Fabric', 'Good', '2026-04-23'],
  ['REC-102', 'Indigo Dye Co.', '20 Barrels', 'Good', '2026-04-22'],
  ['REC-103', 'Thread Master', '1000 Units', 'Good', '2026-04-22'],
  ['REC-104', 'Button & Co.', '5000 Units', 'Box Damaged', '2026-04-21'],
];

export const ReceivingPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Receiving Inventory" />
        <main className="p-8 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Inbox size={20} />
              </div>
              <span className="font-bold text-slate-700">Incoming Shipments</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium">Monthly Report</button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Download size={18} /> Export
              </button>
            </div>
          </div>
          <DataTable headers={tableHeaders} data={tableData} />
        </main>
      </div>
    </div>
  );
};
