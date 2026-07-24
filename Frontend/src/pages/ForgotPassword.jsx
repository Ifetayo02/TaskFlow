import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { forgotPasswordAPI } from '../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) return setError('Please enter your email address.');
    try {
      setLoading(true);
      const res = await forgotPasswordAPI({ email });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

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
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TaskFlow</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
          <p className="text-slate-400 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {success && (
          <div className="mb-6 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-sm text-emerald-300 font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-300 font-medium">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-5 py-4 rounded-xl outline-none font-medium transition-all placeholder:text-slate-600"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/signin"
            className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-indigo-400 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;