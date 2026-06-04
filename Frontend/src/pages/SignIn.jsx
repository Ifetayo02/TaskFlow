import { Mail, Lock, LayoutGrid, Layout } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';

const SignIn = () => {
  const navigate = useNavigate();
 
    const { login, user } = useAuth();
    const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();
  
  // if already logged in, skip straight to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // save user and token in AuthContext
      login(res.data, res.data.token);
      // redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 md:p-12">
        {/* Logo and Greeting */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <LayoutGrid className="w-10 h-10 text-black stroke-[2.5px]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm font-medium">Log in to your workspace</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all outline-none text-slate-900 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400">
            <span className="bg-white px-4">Or continue with</span>
          </div>
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-4">
        {/* Google error */}
{googleError && (
  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
    {googleError}
  </div>
)}

<button
  type="button"
  onClick={signInWithGoogle}
  disabled={googleLoading}
  className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-60 transition-all font-semibold text-slate-700"
>
  {googleLoading ? (
    <Loader2 size={18} className="animate-spin text-slate-400" />
  ) : (
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg"
      className="w-5 h-5"
      alt="Google"
    />
  )}
  {googleLoading ? 'Signing in...' : 'Continue with Google'}
</button>
          <button className="flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs text-slate-700">
            <Layout className="w-4 h-4" />
            GITHUB
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Status & Sub-links */}
      <div className="mt-8 flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          All systems operational
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;