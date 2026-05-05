import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { shippingService, productService } from '../services/api';

const tableHeaders = ['Shipment ID', 'Destination', 'Product SKU', 'Qty', 'Courier', 'Status', 'Date', 'Aksi'];

export const ShippingPage = () => {
  const [shippings, setShippings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShip, setNewShip] = useState({
    shipment_id: '',
    destination: '',
    product_id: 0,
    quantity: 0,
    courier: 'JNE',
    weight: '1kg',
    status: 'Processing',
    date: new Date().toISOString()
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shipData, prodData] = await Promise.all([
        shippingService.getAll(),
        productService.getAll()
      ]);
      setShippings(shipData);
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

  const handleAddShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShip.product_id) {
      alert('Pilih produk terlebih dahulu');
      return;
    }
    try {
      await shippingService.create(newShip);
      setIsModalOpen(false);
      setNewShip({
        shipment_id: '',
        destination: '',
        product_id: 0,
        quantity: 0,
        courier: 'JNE',
        weight: '1kg',
        status: 'Processing',
        date: new Date().toISOString()
      });
      fetchData();
    } catch (error) {
      alert('Gagal menambah record pengiriman');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus record ini?')) {
      try {
        await shippingService.delete(id);
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

  const tableData = shippings.map((s: any) => [
    <span className="font-bold text-slate-800">{s.shipment_id}</span>,
    s.destination,
    <span className="font-medium text-primary-600">{getProductSKU(s.product_id)}</span>,
    <span className="font-bold">{s.quantity} PCS</span>,
    s.courier,
    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase">{s.status}</span>,
    new Date(s.date).toLocaleDateString(),
    <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-rose-600 p-2">
      <Trash2 size={16} />
    </button>
  ]);

  return (
    <Layout title="Shipping (Pengiriman Barang)">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID pengiriman atau tujuan..."
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
            Kirim Barang
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
                <h3 className="font-black text-2xl text-slate-800">Record Pengiriman Baru</h3>
                <p className="text-slate-500 text-sm">Input data pengeluaran barang ke kurir.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddShip} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Shipment ID</label>
                  <input required placeholder="SHIP-XXXX" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newShip.shipment_id} onChange={e => setNewShip({...newShip, shipment_id: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
                  <input required placeholder="Kota Tujuan" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newShip.destination} onChange={e => setNewShip({...newShip, destination: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pilih Produk</label>
                <select required value={newShip.product_id} onChange={e => setNewShip({...newShip, product_id: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl">
                  <option value={0}>Pilih Barang</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newShip.quantity} onChange={e => setNewShip({...newShip, quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kurir</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newShip.courier} onChange={e => setNewShip({...newShip, courier: e.target.value})}>
                    <option>JNE</option>
                    <option>J&T</option>
                    <option>SiCepat</option>
                    <option>Grab/Gojek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Berat</label>
                  <input placeholder="1kg" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newShip.weight} onChange={e => setNewShip({...newShip, weight: e.target.value})} />
                </div>
              </div>
              <button className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl">Simpan Pengiriman</button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
