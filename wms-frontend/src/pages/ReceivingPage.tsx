import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { receivingService, productService } from '../services/api';

const tableHeaders = ['Reception ID', 'Supplier', 'Product SKU', 'Qty', 'Condition', 'Date', 'Aksi'];

export const ReceivingPage = () => {
  const [receivings, setReceivings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRec, setNewRec] = useState({
    reception_id: '',
    supplier: '',
    product_id: 0,
    quantity: 0,
    items_received: '',
    condition: 'Good',
    date: new Date().toISOString()
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recData, prodData] = await Promise.all([
        receivingService.getAll(),
        productService.getAll()
      ]);
      setReceivings(recData);
      setProducts(prodData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRec.product_id) {
      alert('Pilih produk terlebih dahulu');
      return;
    }
    try {
      await receivingService.create(newRec);
      setIsModalOpen(false);
      setNewRec({
        reception_id: '',
        supplier: '',
        product_id: 0,
        quantity: 0,
        items_received: '',
        condition: 'Good',
        date: new Date().toISOString()
      });
      fetchData();
    } catch (error) {
      alert('Gagal menambah record penerimaan');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus record ini?')) {
      try {
        await receivingService.delete(id);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus record');
      }
    }
  };

  const getProductSKU = (id: number) => {
    const prod = products.find(p => p.id === id);
    return prod ? prod.sku : 'Unknown';
  };

  const tableData = receivings.map((r: any) => [
    <span className="font-bold text-slate-800">{r.reception_id}</span>,
    r.supplier,
    <span className="font-medium text-primary-600">{getProductSKU(r.product_id)}</span>,
    <span className="font-bold">{r.quantity} PCS</span>,
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
      r.condition === 'Good' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
    }`}>
      {r.condition}
    </span>,
    new Date(r.date).toLocaleDateString(),
    <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-rose-600 p-2">
      <Trash2 size={16} />
    </button>
  ]);

  return (
    <Layout title="Receiving (Penerimaan Barang)">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID penerimaan atau supplier..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-sm font-black hover:bg-primary-700 flex items-center gap-2 shadow-xl shadow-primary-200 transition-all"
          >
            <Plus size={20} />
            Terima Barang
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable headers={tableHeaders} data={tableData} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-2xl text-slate-800">Record Penerimaan Baru</h3>
                <p className="text-slate-500 text-sm">Update stok gudang dari supplier.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRec} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reception ID</label>
                  <input required placeholder="REC-XXXX" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newRec.reception_id} onChange={e => setNewRec({...newRec, reception_id: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Supplier</label>
                  <input required placeholder="Nama Supplier" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newRec.supplier} onChange={e => setNewRec({...newRec, supplier: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Produk</label>
                <select required value={newRec.product_id} onChange={e => setNewRec({...newRec, product_id: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl">
                  <option value={0}>Pilih Barang</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newRec.quantity} onChange={e => setNewRec({...newRec, quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kondisi</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newRec.condition} onChange={e => setNewRec({...newRec, condition: e.target.value})}>
                    <option>Good</option>
                    <option>Damaged</option>
                    <option>Missing Items</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl">Simpan Penerimaan</button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
