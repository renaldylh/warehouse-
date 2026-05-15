import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { masterDataService } from '../services/api';

const tableHeaders = ['ID', 'Nama Customer', 'Email', 'Telepon', 'Alamat'];

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await masterDataService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await masterDataService.createCustomer(newCust);
      setIsModalOpen(false);
      setNewCust({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (error) {
      alert('Gagal menambah customer');
    }
  };

  const tableData = customers.map((c: any) => [
    c.id,
    <span className="font-bold text-slate-800">{c.name}</span>,
    c.email,
    c.phone,
    c.address
  ]);

  return (
    <Layout title="Customer Database">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama customer..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchCustomers} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 flex items-center gap-2 shadow-xl shadow-emerald-200 transition-all"
          >
            <Plus size={20} />
            Tambah Customer
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
                <h3 className="font-black text-2xl text-slate-800">Data Customer Baru</h3>
                <p className="text-slate-500 text-sm">Input profil pembeli atau klien.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                <input required type="text" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="John Doe"/>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <input required type="email" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="john@example.com"/>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">No. Telepon</label>
                  <input required type="text" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="0812..."/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Alamat Pengiriman</label>
                <textarea required value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" placeholder="Alamat lengkap rumah atau kantor"/>
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]">
                Simpan Customer
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
