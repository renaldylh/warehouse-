import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { ShoppingCart, Plus, Filter, RefreshCw } from 'lucide-react';
import { orderService } from '../services/api';

const tableHeaders = ['Order ID', 'Customer', 'Product ID', 'Qty', 'Status'];

export const OrderPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const recentOrders = orders
    .filter(o => o.status !== 'completed' && o.status !== 'cancelled')
    .map(o => [o.order_number, o.customer_name, o.product_id?.toString() || '-', o.quantity?.toString() || '0', o.status]);

  const orderHistory = orders
    .filter(o => o.status === 'completed' || o.status === 'cancelled')
    .map(o => [o.order_number, o.customer_name, o.product_id?.toString() || '-', o.quantity?.toString() || '0', o.status]);

  return (
    <Layout title="Order Management">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingCart size={24} className="text-primary-600" />
          Active Orders
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchOrders}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 transition-all active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs lg:text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
            <Filter size={18} /> Filter
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-xl text-xs lg:text-sm font-bold flex items-center justify-center gap-2">
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <DataTable title="Recent Orders" headers={tableHeaders} data={recentOrders} />
        <DataTable title="Order History" headers={tableHeaders} data={orderHistory} />
      </div>
    </Layout>
  );
};
