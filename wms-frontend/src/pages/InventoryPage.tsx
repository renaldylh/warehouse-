import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { productService } from '../services/api';

const tableHeaders = ['ID SKU', 'Nama Produk', 'Stok', 'Kategori', 'Status'];

export const InventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const tableData = products.map((p: any) => [
    p.sku,
    p.name,
    `${p.stock} PCS`,
    p.category || '-',
    p.stock > 50 ? 'Stocked' : p.stock > 10 ? 'Low Stock' : 'Critical'
  ]);

  return (
    <Layout title="Inventory Management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:flex-1 md:max-w-lg relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Cari SKU atau nama produk..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm lg:text-base text-slate-800 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          <button 
            onClick={fetchProducts}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-1 lg:flex-none px-4 lg:px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs lg:text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex-1 lg:flex-none px-4 lg:px-6 py-3 bg-primary-600 text-white rounded-xl text-xs lg:text-sm font-bold hover:bg-primary-700 flex items-center justify-center gap-2 shadow-lg shadow-primary-200 transition-all active:scale-95">
            <Plus size={18} />
            Produk Baru
          </button>
        </div>
      </div>

      <DataTable headers={tableHeaders} data={tableData} />
    </Layout>
  );
};
