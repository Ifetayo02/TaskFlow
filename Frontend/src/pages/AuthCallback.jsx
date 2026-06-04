// client/src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api/auth';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/signin?error=google_failed');
      return;
    }

    // save token and fetch user
    localStorage.setItem('token', token);
    getMe()
      .then((res) => {
        login(res.data, token);
        navigate('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/signin');
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={24} />
        <span className="font-medium">Signing you in...</span>
      </div>
    </div>
  );
};

export default AuthCallback;