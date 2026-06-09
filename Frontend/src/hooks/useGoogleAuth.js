import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { googleAuthAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useGoogleAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');

      // step 1 — open Google popup via Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // step 2 — send user info to your backend
      const res = await googleAuthAPI({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
      });

      // step 3 — save your JWT and update AuthContext
      login(res.data, res.data.token);

      // step 4 — redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        // user closed the popup — not an error
        return;
      }
      setError('Google sign-in failed. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error };
};

export default useGoogleAuth;