import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { masterDataService } from '../services/api';

const tableHeaders = ['ID', 'Nama Gudang', 'Lokasi', 'Kapasitas', 'Aksi'];

export const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWh, setNewWh] = useState({
    name: '',
    location: ''
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await masterDataService.getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleAddWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await masterDataService.createWarehouse(newWh);
      setIsModalOpen(false);
      setNewWh({ name: '', location: '' });
      fetchWarehouses();
    } catch (error) {
      alert('Gagal menambah gudang');
    }
  };

  const tableData = warehouses.map((w: any) => [
    w.id,
    <span className="font-bold text-slate-800">{w.name}</span>,
    w.location,
    'Unlimited',
    <button className="text-primary-600 hover:underline">Detail</button>
  ]);

  return (
    <Layout title="Warehouse Network">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari lokasi gudang..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchWarehouses} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 flex items-center gap-2 shadow-xl shadow-indigo-200 transition-all"
          >
            <Plus size={20} />
            Gudang Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable headers={tableHeaders} data={tableData} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-2xl text-slate-800">Tambah Lokasi Gudang</h3>
                <p className="text-slate-500 text-sm">Perluas jaringan logistik Anda.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddWarehouse} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Gudang</label>
                <input required type="text" value={newWh.name} onChange={e => setNewWh({...newWh, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="Gudang Jakarta Utama"/>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Lokasi / Wilayah</label>
                <input required type="text" value={newWh.location} onChange={e => setNewWh({...newWh, location: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="Jakarta Utara, Marunda"/>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                Daftarkan Gudang
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
