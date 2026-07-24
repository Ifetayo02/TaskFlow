import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LayoutGrid, Loader2, Eye, EyeOff,ArrowLeft } from 'lucide-react';
import { loginUser } from '../api/auth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = loading || googleLoading;

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      return setError('Email and password are required.');
    }
    try {
      setLoading(true);
      const res = await loginUser(formData);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {}
      {}
      {}
<div className="w-full max-w-[480px] mb-4 relative z-10">
  <button
    onClick={() => navigate('/')}
    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
  >
    <ArrowLeft size={16} />
    Back to home
  </button>
</div>
      {}
      <div
        className="w-full max-w-[440px] rounded-[2rem] p-10 md:p-12 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 text-sm font-medium">Log in to your workspace</p>
        </div>

        {}
        {(error || googleError) && (
          <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-300 font-medium">
            {error || googleError}
          </div>
        )}

        {}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="name@company.com"
                className="w-full pl-12 pr-5 py-4 rounded-xl outline-none font-medium transition-all disabled:opacity-60"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-xl outline-none font-medium transition-all disabled:opacity-60"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500">
            <span className="px-4" style={{ background: 'transparent' }}>Or continue with</span>
          </div>
        </div>

        {}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
          }}
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin text-slate-400" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {}
      <div className="mt-8 flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          All systems operational
        </div>
        <div className="h-4 w-px bg-slate-700"></div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;