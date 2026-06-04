import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();
// if already logged in, skip straight to dashboard
useEffect(() => {
  if (user) navigate('/dashboard');
}, [user]);

  const [formData, setFormData] = useState({
    name: '',
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

    // basic frontend validation
    if (!formData.name || !formData.email || !formData.password) {
      return setError('All fields are required.');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);
      // save user and token in AuthContext
      login(res.data, res.data.token);
      // redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 md:p-14">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">TaskFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Precision engineering for high-velocity teams.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 placeholder:text-slate-400"
            />
            <p className="mt-2 text-[11px] text-slate-400 px-1">
              Minimum 8 characters with a mix of letters and numbers.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-indigo-200"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
            {!loading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-400">
            <span className="bg-white px-4">or continue with Google</span>
          </div>
        </div>

        {/* Google Auth */}
  <button
  type="button"
  onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
  className="w-full flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg"
    className="w-5 h-5"
    alt="Google"
  />
  Continue with Google
</button>

        <p className="mt-10 text-center text-sm text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to="/signin" className="text-indigo-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Secure AES-256
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" /> GDPR Compliant
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-slate-400">
        <p className="mb-4">© 2026 TaskFlow Inc. Precision engineering for high-velocity teams.</p>
        <div className="flex justify-center gap-6 font-semibold">
          <a href="#" className="hover:text-slate-600">Privacy</a>
          <a href="#" className="hover:text-slate-600">Terms</a>
          <a href="#" className="hover:text-slate-600">Contact</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;