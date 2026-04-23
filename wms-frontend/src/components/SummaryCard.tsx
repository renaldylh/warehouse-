import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'blue';
}

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
      </div>
    </div>
  );
};
