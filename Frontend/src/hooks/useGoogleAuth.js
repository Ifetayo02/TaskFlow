// client/src/hooks/useGoogleAuth.js
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth'; // 💡 Changed
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
      
      // 💡 1. Trigger the popup directly
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Popup result:', result);

      const firebaseUser = result.user;
      if (!firebaseUser?.email) {
        setError('Could not get email from Google. Please try again.');
        return;
      }

      // 💡 2. Send straight to your backend right here
      const res = await googleAuthAPI({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
      });

      console.log('Backend response:', res.data);

      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') return;

      setError(
        err.response?.data?.message ||
        err.message ||
        'Google sign-in failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error }; // No more useEffect needed!
};

export default useGoogleAuth;