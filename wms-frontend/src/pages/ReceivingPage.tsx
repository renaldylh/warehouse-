import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Inbox, Download, RefreshCw } from 'lucide-react';
import { receivingService } from '../services/api';

const tableHeaders = ['Reception ID', 'Supplier', 'Items Received', 'Condition', 'Date'];

export const ReceivingPage = () => {
  const [receivings, setReceivings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceivings = async () => {
    try {
      setLoading(true);
      const data = await receivingService.getAll();
      setReceivings(data);
    } catch (error) {
      console.error('Failed to fetch receivings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivings();
  }, []);

  const tableData = receivings.map(r => [
    r.reception_id,
    r.supplier,
    r.items_received,
    r.condition,
    new Date(r.date).toLocaleDateString()
  ]);

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
          <button 
            onClick={fetchReceivings}
            className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
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
