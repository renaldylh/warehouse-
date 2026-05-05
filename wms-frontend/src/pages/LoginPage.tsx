import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Loader2, Warehouse } from 'lucide-react';
import { authService } from '../services/api';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ username, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal. Cek kembali akun Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-[32px] text-white shadow-2xl shadow-primary-200 mb-6 transform hover:rotate-12 transition-transform duration-500">
            <Warehouse size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            WMS<span className="text-primary-600">PRO</span>
          </h1>
          <p className="text-slate-500 font-medium">Masuk untuk mengelola inventaris Anda</p>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={20} />
                </div>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-800 font-semibold"
                  placeholder="admin_wms"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-800 font-semibold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">Lupa sandi?</a>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary-600 font-black hover:underline underline-offset-4">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-10 text-center text-slate-400 text-sm font-medium">
          &copy; 2026 WMS PRO Enterprise. All rights reserved.
        </p>
      </div>
    </div>
  );
};
