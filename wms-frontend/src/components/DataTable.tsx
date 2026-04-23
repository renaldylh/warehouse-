import React from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

interface DataTableProps {
  title?: string;
  headers: string[];
  data: any[][];
}

export const DataTable: React.FC<DataTableProps> = ({ title, headers, data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[600px] lg:min-w-0">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              <th className="px-4 lg:px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
                <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                  <button className="text-slate-400 hover:text-primary-600 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 lg:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs lg:text-sm text-slate-500">Showing {data.length} entries</p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-primary-600 text-white font-medium text-sm flex items-center justify-center">
            1
          </button>
          <button className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
