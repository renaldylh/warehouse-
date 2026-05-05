import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { masterDataService } from '../services/api';

const tableHeaders = ['ID', 'Nama Supplier', 'Kontak', 'Alamat', 'Tanggal Terdaftar'];

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupp, setNewSupp] = useState({
    name: '',
    contact: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await masterDataService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await masterDataService.createSupplier(newSupp);
      setIsModalOpen(false);
      setNewSupp({ name: '', contact: '', address: '' });
      fetchSuppliers();
    } catch (error) {
      alert('Gagal menambah supplier');
    }
  };

  const tableData = suppliers.map((s: any) => [
    s.id,
    <span className="font-bold text-slate-800">{s.name}</span>,
    s.contact,
    s.address,
    new Date(s.created_at).toLocaleDateString()
  ]);

  return (
    <Layout title="Supplier Management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama supplier..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchSuppliers} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-sm font-black hover:bg-primary-700 flex items-center gap-2 shadow-xl shadow-primary-200 transition-all"
          >
            <Plus size={20} />
            Tambah Supplier
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
                <h3 className="font-black text-2xl text-slate-800">Tambah Supplier</h3>
                <p className="text-slate-500 text-sm">Input data mitra pemasok baru.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSupplier} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Perusahaan</label>
                <input required type="text" value={newSupp.name} onChange={e => setNewSupp({...newSupp, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="PT. Logistik Jaya"/>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kontak / No. HP</label>
                <input required type="text" value={newSupp.contact} onChange={e => setNewSupp({...newSupp, contact: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="0812-XXXX-XXXX"/>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Alamat</label>
                <textarea required value={newSupp.address} onChange={e => setNewSupp({...newSupp, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="Alamat lengkap kantor"/>
              </div>
              <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-[0.98]">
                Simpan Supplier
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
