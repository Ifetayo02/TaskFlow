import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Camera, Loader2, CheckCircle2,
  User, Mail, Lock, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  updateProfile,
  changePassword,
  uploadAvatar,
} from '../api/auth';
import Sidebar from '../components/layout/Sidebar';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
    <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
      <Icon size={18} className="text-indigo-600" />
      {title}
    </h2>
    {children}
  </div>
);

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // avatar
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const isGoogleUser = user?.passwordHash === 'GOOGLE_AUTH';

  // ── update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim() || !email.trim()) {
      return setProfileError('Name and email are required.');
    }

    try {
      setProfileLoading(true);
      const res = await updateProfile({ name, email });
      updateUser(res.data);
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(
        err.response?.data?.message || 'Failed to update profile.'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ── change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPasswordError('All password fields are required.');
    }
    if (newPassword.length < 8) {
      return setPasswordError('New password must be at least 8 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setPasswordError('New passwords do not match.');
    }

    try {
      setPasswordLoading(true);
      const res = await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Failed to change password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setAvatarLoading(true);
      setAvatarError('');
      const res = await uploadAvatar(formData);
      updateUser({ ...user, avatar: res.data.avatar });
      setAvatarPreview(res.data.avatar);
    } catch (err) {
      setAvatarError('Failed to upload avatar. Try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Profile & Settings
            </h1>
            <p className="text-xs text-slate-400">
              Manage your account details
            </p>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-2xl w-full mx-auto">

          {/* ── Avatar Section ── */}
          <Section title="Profile Picture" icon={Camera}>
            <div className="flex items-center gap-6">
              {/* Avatar display */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Upload a photo. JPG, PNG or WebP. Max 5MB.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <Camera size={15} />
                  {avatarLoading ? 'Uploading...' : 'Upload Photo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {avatarError && (
                  <p className="text-xs text-red-500 mt-2">{avatarError}</p>
                )}
              </div>
            </div>
          </Section>

          {/* ── Profile Info Section ── */}
          <Section title="Personal Information" icon={User}>
            {profileSuccess && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                <CheckCircle2 size={16} />
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-5 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isGoogleUser}
                    className="w-full pl-11 pr-5 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                {isGoogleUser && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    Email cannot be changed for Google accounts.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm transition-all"
              >
                {profileLoading && <Loader2 size={15} className="animate-spin" />}
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </Section>

          {/* ── Change Password Section ── */}
          <Section title="Change Password" icon={Lock}>
            {isGoogleUser ? (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Shield size={18} className="text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-500">
                  Your account uses Google sign-in. Password management is handled by Google.
                </p>
              </div>
            ) : (
              <>
                {passwordSuccess && (
                  <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                    <CheckCircle2 size={16} />
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Minimum 8 characters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm transition-all"
                  >
                    {passwordLoading && <Loader2 size={15} className="animate-spin" />}
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;