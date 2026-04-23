import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Inbox, Download } from 'lucide-react';

const tableHeaders = ['Reception ID', 'Supplier', 'Items Received', 'Condition', 'Date'];
const tableData = [
  ['REC-101', 'Cotton Direct', '500 Rolls Fabric', 'Good', '2026-04-23'],
  ['REC-102', 'Indigo Dye Co.', '20 Barrels', 'Good', '2026-04-22'],
  ['REC-103', 'Thread Master', '1000 Units', 'Good', '2026-04-22'],
  ['REC-104', 'Button & Co.', '5000 Units', 'Box Damaged', '2026-04-21'],
];

export const ReceivingPage = () => {
  return (
    <Layout title="Receiving Inventory">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Inbox size={20} />
          </div>
          <span className="font-bold text-slate-700 text-sm lg:text-base">Incoming Shipments</span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Reports</button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-100 transition-all">
            <Download size={18} /> Export
          </button>
        </div>
      </div>
      <DataTable headers={tableHeaders} data={tableData} />
    </Layout>
  );
};
