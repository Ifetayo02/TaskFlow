// client/src/hooks/useGoogleAuth.js
import { useState } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { googleAuthAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useGoogleAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // handle redirect result when user comes back from Google
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);

        if (result?.user) {
          const firebaseUser = result.user;
          const res = await googleAuthAPI({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
          });
          login(res.data, res.data.token);
          navigate('/dashboard');
        }
      } catch (err) {
        if (err.code !== 'auth/no-current-user') {
          setError('Google sign-in failed. Please try again.');
          console.error('Google redirect error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');
      // use redirect instead of popup — avoids COOP browser issues
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google auth error:', err);
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error };
};

export default useGoogleAuth;