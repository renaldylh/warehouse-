import { Layout } from '../layouts/Layout';
import { DataTable } from '../components/DataTable';
import { Truck, Search } from 'lucide-react';

const tableHeaders = ['Shipment ID', 'Destination', 'Courier', 'Weight', 'Status'];
const tableData = [
  ['SHP-501', 'Jakarta Hub', 'JNE Express', '12.5 KG', 'In Transit'],
  ['SHP-502', 'Bandung Store', 'SiCepat', '5.2 KG', 'Delivered'],
  ['SHP-503', 'Surabaya Distro', 'J&T', '25.0 KG', 'In Transit'],
  ['SHP-504', 'Medan Branch', 'SBC Cargo', '45.0 KG', 'Packing'],
];

export const ShippingPage = () => {
  return (
    <Layout title="Shipping & Logistics">
      <div className="bg-primary-600 rounded-3xl p-6 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-primary-200">
         <div className="relative z-10">
            <h2 className="text-xl lg:text-3xl font-black mb-2">Track Your Shipments</h2>
            <p className="text-primary-100 mb-6 text-sm lg:text-base max-w-md">Monitor all outgoing goods and logistics status in real-time with precise tracking.</p>
            <div className="max-w-md relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-white transition-colors" size={20} />
               <input 
                 type="text" 
                 placeholder="Enter Tracking Number..." 
                 className="w-full bg-primary-700/50 border border-primary-500 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-primary-700 focus:ring-4 focus:ring-white/10 transition-all placeholder:text-primary-300 text-sm lg:text-base font-medium"
               />
            </div>
         </div>
         <Truck className="absolute right-[-40px] bottom-[-40px] w-48 h-48 lg:w-64 lg:h-64 text-primary-500/20 rotate-[-15deg] hidden sm:block" />
      </div>
      <DataTable headers={tableHeaders} data={tableData} />
    </Layout>
  );
};
