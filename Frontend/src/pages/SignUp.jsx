import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, ShieldCheck, Loader2, Eye, EyeOff,ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      return setError('All fields are required.');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    try {
      setLoading(true);
      const res = await registerUser(formData);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
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
        className="w-full max-w-[480px] rounded-[2rem] p-10 md:p-14 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TaskFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Precision engineering for high-velocity teams.</p>
        </div>

        {}
        {(error || googleError) && (
          <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-300 font-medium">
            {error || googleError}
          </div>
        )}

        {}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 px-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-5 py-4 rounded-xl outline-none transition-all placeholder:text-slate-600"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 px-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full px-5 py-4 rounded-xl outline-none transition-all placeholder:text-slate-600"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 px-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-4 pr-12 rounded-xl outline-none transition-all placeholder:text-slate-600"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 px-1">
              Minimum 8 characters with a mix of letters and numbers.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-900/50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
            ) : (
              <>Sign Up<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        {}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-500">
            <span className="px-4">or continue with</span>
          </div>
        </div>

        {}
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all disabled:opacity-60"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
          }}
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          )}
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Already have an account?{' '}
          <Link to="/signin" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {}
      <div className="mt-8 flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Secure AES-256
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" /> GDPR Compliant
        </div>
      </div>
    </div>
  );
};

export default SignUp;