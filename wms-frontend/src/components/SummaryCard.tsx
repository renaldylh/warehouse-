import type { LucideIcon } from 'lucide-react';

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
    <div className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className={`p-2 lg:p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={20} className="lg:hidden" />
          <Icon size={24} className="hidden lg:block" />
        </div>
        <div>
          <p className="text-xs lg:text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900">{value}</h3>
        </div>
      </div>
    </div>
  );
};
