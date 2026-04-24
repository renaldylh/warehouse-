import { useState, useEffect } from 'react';
import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Truck, Search, RefreshCw } from 'lucide-react';
import { shippingService } from '../services/api';

const tableHeaders = ['Shipment ID', 'Destination', 'Courier', 'Weight', 'Status'];

export const ShippingPage = () => {
  const [shippings, setShippings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShippings = async () => {
    try {
      setLoading(true);
      const data = await shippingService.getAll();
      setShippings(data);
    } catch (error) {
      console.error('Failed to fetch shippings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  const tableData = shippings.map(s => [
    s.shipment_id,
    s.destination,
    s.courier,
    s.weight,
    s.status
  ]);

  return (
    <Layout title="Shipping & Logistics">
      <div className="bg-primary-600 rounded-3xl p-6 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-primary-200">
         <div className="relative z-10">
            <h2 className="text-xl lg:text-3xl font-black mb-2">Track Your Shipments</h2>
            <p className="text-primary-100 mb-6 text-sm lg:text-base max-w-md">Monitor all outgoing goods and logistics status in real-time with precise tracking.</p>
            <div className="max-w-md relative flex gap-2">
               <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-white transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter Tracking Number..." 
                    className="w-full bg-primary-700/50 border border-primary-500 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-primary-700 focus:ring-4 focus:ring-white/10 transition-all placeholder:text-primary-300 text-sm lg:text-base font-medium"
                  />
               </div>
               <button 
                 onClick={fetchShippings}
                 className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
               >
                  <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
               </button>
            </div>
         </div>
         <Truck className="absolute right-[-40px] bottom-[-40px] w-48 h-48 lg:w-64 lg:h-64 text-primary-500/20 rotate-[-15deg] hidden sm:block" />
      </div>
      <DataTable headers={tableHeaders} data={tableData} />
    </Layout>
  );
};
