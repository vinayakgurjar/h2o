import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { store, INITIAL_USERS } from '../../services/store';
import { signInWithGoogle, sendResetPassword } from '../../services/firebaseAuth';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('VIEWER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUser = store.getState().currentUser;
  const isGuest = currentUser.id === 'guest' || !currentUser.active;

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success && result.user) {
        store.switchUser(result.user);
        setSuccessMessage(`Signed in with Google as ${result.user.name}`);
        setTimeout(() => {
          onAuthSuccess?.(result.user!);
          onClose();
        }, 600);
      } else {
        setError(result.error || 'Google sign-in was cancelled or failed.');
      }
    } catch {
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await store.logIn(email, password);
      if (result.success && result.user) {
        setSuccessMessage(`Welcome back, ${result.user.name}!`);
        setTimeout(() => {
          onAuthSuccess?.(result.user!);
          onClose();
        }, 600);
      } else {
        setError(result.error || 'Failed to authenticate');
      }
    } catch {
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid business email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await store.signUp({
        name,
        email,
        password,
        role,
        phone,
        companyName,
      });

      if (result.success && result.user) {
        setSuccessMessage(`Account created! Logged in as ${result.user.name}`);
        setTimeout(() => {
          onAuthSuccess?.(result.user!);
          onClose();
        }, 700);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered email address');
      return;
    }

    setLoading(true);
    try {
      const res = await sendResetPassword(email);
      if (res.success) {
        setSuccessMessage(res.message || 'Password reset link sent to your email.');
      } else {
        setError(res.error || 'Failed to dispatch reset email.');
      }
    } catch {
      setError('Could not process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser: UserProfile) => {
    store.switchUser(demoUser);
    setSuccessMessage(`Switched session to ${demoUser.name} (${demoUser.role})`);
    setTimeout(() => {
      onAuthSuccess?.(demoUser);
      onClose();
    }, 500);
  };

  const handleLogout = () => {
    store.logOut();
    setSuccessMessage('Logged out successfully');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="auth-modal-panel"
        className="bg-[#FAF7F2] w-full max-w-md rounded-2xl border border-[#E5DDD0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="bg-[#1A1817] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs font-sans font-bold text-lg">
              M
            </div>
            <div>
              <h2 className="font-sans font-bold text-base leading-tight">
                MLUE Enterprise Portal
              </h2>
              <p className="text-[11px] text-stone-400">
                Secure Account Access & B2B Operations
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Status */}
        <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E5DDD0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                !isGuest ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
              }`}
            />
            <span className="text-stone-600">Active User:</span>
            <strong className="text-[#1A1817] font-semibold">
              {currentUser.name}
            </strong>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-mono">
              {currentUser.role}
            </span>
          </div>
          {!isGuest && (
            <button
              id="auth-logout-btn"
              onClick={handleLogout}
              className="text-stone-500 hover:text-[#D92365] flex items-center gap-1 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#EFE9DD] p-1 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              id="tab-login"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#1A1817] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#1A1817] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign-In with Firebase Auth */}
          <button
            type="button"
            id="google-signin-btn"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-[#D5CCC0] text-sm font-semibold text-[#1A1817] shadow-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50 hover:border-[#D92365]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5DDD0]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#FAF7F2] px-2 text-stone-500 font-medium">Or continue with email credentials</span>
            </div>
          </div>

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1.5">
                  Business Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gm@theresort.com"
                    className="w-full bg-white pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-[#D92365] focus:ring-1 focus:ring-[#D92365]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1A1817]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-[#D92365] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-[#D92365] focus:ring-1 focus:ring-[#D92365]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-login-btn"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#D92365] hover:bg-[#B81D53] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast 1-Click Role Switcher for Testing */}
              <div className="pt-4 border-t border-[#E5DDD0]">
                <p className="text-[11px] font-semibold text-stone-500 mb-2 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#D92365]" />
                  Or 1-Click Sign In as Demo Role:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {INITIAL_USERS.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="text-left p-2 rounded-lg bg-white border border-[#E5DDD0] hover:border-[#D92365] hover:bg-[#FAF7F2] transition-colors"
                    >
                      <span className="block text-xs font-bold text-[#1A1817] truncate">
                        {u.name}
                      </span>
                      <span className="block text-[10px] text-stone-500 truncate">
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vinayak Pratap"
                    className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                  Business Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@sayajihotels.com"
                    className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                    Hotel / Brand
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="signup-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Raj Mahal Palace"
                      className="w-full bg-white pl-8 pr-2 py-2 rounded-xl border border-[#D5CCC0] text-xs text-[#1A1817] focus:outline-hidden focus:border-[#D92365]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 88272..."
                      className="w-full bg-white pl-8 pr-2 py-2 rounded-xl border border-[#D5CCC0] text-xs text-[#1A1817] focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                  Create Password (min. 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white pl-9 pr-3 py-2 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-[#D92365]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1">
                  Account Type / Role
                </label>
                <select
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-[#D5CCC0] text-xs text-[#1A1817] focus:outline-hidden focus:border-[#D92365]"
                >
                  <option value="VIEWER">Hospitality Client / Guest View</option>
                  <option value="SALES_EXECUTIVE">Sales Executive & Quotes</option>
                  <option value="PRODUCTION_MANAGER">Cleanroom & Production Plant</option>
                  <option value="ADMIN">Corporate Administration</option>
                  <option value="SUPER_ADMIN">Executive Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                id="submit-signup-btn"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#D92365] hover:bg-[#B81D53] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Register & Log In'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Forgot Password View */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-stone-700 text-xs">
                <p className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#D92365]" />
                  Firebase Password Recovery
                </p>
                <p>
                  Enter your registered email address below. Firebase Authentication will dispatch a secure password reset link to your inbox.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1817] mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@company.com"
                    className="w-full bg-white pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CCC0] text-sm text-[#1A1817] focus:outline-hidden focus:border-[#D92365] focus:ring-1 focus:ring-[#D92365]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-forgot-btn"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#D92365] hover:bg-[#B81D53] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Dispatching link...' : 'Send Password Reset Email'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-stone-600 hover:text-[#1A1817] font-semibold underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Statutory Security Disclaimer */}
          <div className="mt-5 pt-3 border-t border-[#E5DDD0] flex items-center justify-between text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SHA-256 Encrypted & Session Protected
            </span>
            <span className="font-mono">BIS IS 14543</span>
          </div>
        </div>
      </div>
    </div>
  );
};
