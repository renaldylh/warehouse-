import { Mail, Lock, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="bg-white w-full max-w-[400px] sm:max-w-md rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative z-10">
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 sm:mb-6 shadow-xl shadow-primary-200">
            <span className="text-2xl sm:text-3xl font-black">W</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2 font-medium text-xs sm:text-sm">Bergabung dengan WMS Disro Baju</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
           <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm sm:text-base text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="admin@disro.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm sm:text-base text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm sm:text-base text-slate-800 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 text-white py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-[0.98] transition-all shadow-lg shadow-primary-200 mt-2 group text-sm sm:text-base"
          >
            Daftar Sekarang
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="px-6 sm:px-8 pb-8 text-center border-t border-slate-50 pt-6">
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Sudah punya akun? {' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
