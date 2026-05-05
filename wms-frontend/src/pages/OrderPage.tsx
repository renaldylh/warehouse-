import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw, Printer, CheckCircle2, Box, Truck } from 'lucide-react';
import { orderService, productService, masterDataService } from '../services/api';

const tableHeaders = ['Order ID', 'Customer', 'Qty', 'Total', 'Status', 'Aksi'];

export const OrderPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    order_number: '',
    marketplace: 'Offline',
    customer_id: 0,
    product_id: 0,
    quantity: 1,
    total_price: 0,
    status: 'pending'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [o, p, c] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        masterDataService.getCustomers()
      ]);
      setOrders(o);
      setProducts(p);
      setCustomers(c);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    // In a real app, this would be an API call to update status
    alert(`Order #${id} status updated to: ${status}`);
    fetchData();
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await orderService.create(newOrder);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Gagal membuat pesanan');
    }
  };

  const tableData = orders.map((o: any) => [
    <span className="font-bold text-slate-800">{o.order_number}</span>,
    o.customer?.name || 'Guest',
    o.quantity,
    <span className="font-bold text-primary-600">Rp {o.total_price.toLocaleString()}</span>,
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
      o.status === 'pending' ? 'bg-amber-50 text-amber-600' :
      o.status === 'picked' ? 'bg-blue-50 text-blue-600' :
      o.status === 'packed' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
    }`}>
      {o.status}
    </span>,
    <div className="flex items-center gap-2">
      {o.status === 'pending' && <button onClick={() => handleUpdateStatus(o.id, 'picked')} className="p-2 text-slate-400 hover:text-blue-600" title="Mark as Picked"><Box size={16}/></button>}
      {o.status === 'picked' && <button onClick={() => handleUpdateStatus(o.id, 'packed')} className="p-2 text-slate-400 hover:text-indigo-600" title="Mark as Packed"><CheckCircle2 size={16}/></button>}
      {o.status === 'packed' && <button onClick={() => handleUpdateStatus(o.id, 'shipping')} className="p-2 text-slate-400 hover:text-emerald-600" title="Ship Now"><Truck size={16}/></button>}
      <button className="text-slate-400 hover:text-primary-600 p-2"><Printer size={16}/></button>
    </div>
  ]);

  return (
    <Layout title="Order Fulfillment">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari order..."
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
            Pesanan Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <DataTable headers={tableHeaders} data={tableData} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-800">Buat Pesanan Baru</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddOrder} className="p-8 space-y-6">
              <input required placeholder="Nomor Order" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newOrder.order_number} onChange={e => setNewOrder({...newOrder, order_number: e.target.value})} />
              <select required value={newOrder.customer_id} onChange={e => setNewOrder({...newOrder, customer_id: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl">
                <option value={0}>Pilih Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select required value={newOrder.product_id} onChange={e => setNewOrder({...newOrder, product_id: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl">
                <option value={0}>Pilih Produk</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-6">
                <input type="number" placeholder="Qty" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})} />
                <input type="number" placeholder="Total Price" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newOrder.total_price} onChange={e => setNewOrder({...newOrder, total_price: parseFloat(e.target.value)})} />
              </div>
              <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200">Simpan Pesanan</button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
