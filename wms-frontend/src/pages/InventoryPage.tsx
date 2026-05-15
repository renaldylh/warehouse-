import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Plus, RefreshCw, ShoppingCart, Printer, Edit, Scan, Download } from 'lucide-react';
import { productService, marketplaceService } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';

const tableHeaders = ['ID SKU', 'Nama Produk', 'Stok', 'Kategori', 'Status', 'Aksi'];

export const InventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    stock: 0,
    base_price: 0
  });

  const fetchProducts = async (search = '') => {
    try {
      setLoading(true);
      const data = await productService.getAll(search);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (marketplace: string) => {
    try {
      setSyncing(marketplace);
      await marketplaceService.sync(marketplace);
      await fetchProducts();
    } catch (error) {
      alert(`Gagal sinkronisasi dengan ${marketplace}`);
    } finally {
      setSyncing(null);
    }
  };

  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        setSearchTerm(decodedText);
        setIsScannerOpen(false);
        scanner.clear();
      }, () => {
        // Suppress error
      });
      return () => {
        scanner.clear();
      };
    }
  }, [isScannerOpen]);

  const handlePrintLabel = (id: number) => {
    productService.printLabel(id);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.create(newProduct);
      setIsModalOpen(false);
      setNewProduct({ sku: '', name: '', category: '', stock: 0, base_price: 0 });
      fetchProducts();
    } catch (error) {
      alert('Gagal menambah produk');
    }
  };

  const tableData = products.map((p: any) => [
    p.sku,
    p.name,
    `${p.stock} PCS`,
    p.category || '-',
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
      p.stock > 50 ? 'bg-emerald-50 text-emerald-600' : 
      p.stock > 10 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
    }`}>
      {p.stock > 50 ? 'Stocked' : p.stock > 10 ? 'Low Stock' : 'Critical'}
    </span>,
    <div className="flex items-center gap-2">
      <button onClick={() => handlePrintLabel(p.id)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Print Label PDF">
        <Printer size={16} />
      </button>
      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
        <Edit size={16} />
      </button>
    </div>
  ]);

  return (
    <Layout title="Inventory Management">
      <div className="flex flex-col space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-lg text-slate-800">Integrasi Marketplace</h3>
            <div className="flex gap-2">
              <button onClick={() => productService.exportCSV()} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['shopee', 'tokopedia', 'tiktok'].map((mp) => (
              <button
                key={mp}
                disabled={!!syncing}
                onClick={() => handleSync(mp)}
                className={`group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${
                  syncing === mp ? 'bg-primary-50 border-primary-200' : 'bg-slate-50/50 border-slate-100 hover:border-primary-300 hover:bg-white hover:shadow-xl hover:shadow-primary-500/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    mp === 'shopee' ? 'bg-orange-100 text-orange-600' : 
                    mp === 'tokopedia' ? 'bg-green-100 text-green-600' : 'bg-slate-900 text-white'
                  }`}>
                    <ShoppingCart size={24} />
                  </div>
                  <span className="font-black text-slate-800 capitalize">{mp}</span>
                </div>
                {syncing === mp ? <RefreshCw size={20} className="animate-spin text-primary-600" /> : <RefreshCw size={14} className="text-slate-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:flex-1 md:max-w-lg relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari SKU atau nama produk..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-800 shadow-sm font-medium"
            />
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
            >
              <Scan size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => fetchProducts(searchTerm)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-sm font-black hover:bg-primary-700 flex items-center gap-2 shadow-xl shadow-primary-200 transition-all">
              <Plus size={20} /> Tambah Produk
            </button>
          </div>
        </div>

        <DataTable headers={tableHeaders} data={tableData} />
      </div>

      {isScannerOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Scan Barcode</h3>
              <button onClick={() => setIsScannerOpen(false)} className="text-slate-400">✕</button>
            </div>
            <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200"></div>
            <p className="mt-4 text-center text-slate-500 text-sm">Arahkan kamera ke barcode produk.</p>
          </div>
        </div>
      )}

      {/* Modal Add Product code (truncated for brevity but same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-800">Tambah Produk Baru</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <input required placeholder="ID SKU" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
              <input required placeholder="Nama Produk" className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg">Simpan Produk</button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
