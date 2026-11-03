import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export interface AuthProps {
  initialMode?: 'signin' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ initialMode = 'signin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, showToast } = useStore();

  // Active Tab Mode
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);

  // Sync mode when initialMode prop changes (e.g. navigation between /login and /register)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Redirect destination helper
  const getRedirectPath = (isAdmin: boolean) => {
    if (isAdmin) return '/admin';
    const state = location.state as { from?: { pathname?: string } } | undefined;
    return state?.from?.pathname || '/';
  };

  // Sign In Handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword) {
      showToast('Please enter your email and password.');
      return;
    }

    const emailClean = signInEmail.trim().toLowerCase();
    const isAdmin = emailClean.includes('admin') || emailClean === 'ops@bookverse.io';

    login({
      email: signInEmail.trim(),
      name: isAdmin ? 'Curator Admin' : (signInEmail.split('@')[0] || 'Patron Reader'),
      role: isAdmin ? 'admin' : 'customer',
    });

    showToast(isAdmin ? 'Signed in to Curator Console.' : 'Welcome back to BookVerse!');
    navigate(getRedirectPath(isAdmin));
  };

  // Register Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match. Please verify.');
      return;
    }
    if (regPassword.length < 8) {
      showToast('Password must contain at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      showToast('Please accept the Terms of Service to continue.');
      return;
    }

    login({
      name: regName.trim(),
      email: regEmail.trim(),
      role: 'customer',
    });

    showToast(`Welcome to BookVerse, ${regName.trim()}! Patron account created.`);
    navigate('/');
  };

  // Google OAuth Stub
  const handleGoogleAuth = () => {
    login({
      name: 'Google Patron',
      email: 'patron.google@bookverse.com',
      role: 'customer',
    });
    showToast('Signed in successfully with Google.');
    navigate('/');
  };

  // Forgot Password Stub
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Password reset link has been dispatched to your email address.');
  };

  // Support / FAQ Stub
  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Patron Support & FAQ desk is available 24/7 at support@bookverse.io');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Top Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-gutter-lg flex items-center justify-between">
          <Link
            to="/"
            data-path="storefront-home"
            className="flex items-center gap-space-sm text-primary group"
          >
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">
              BookVerse
            </span>
          </Link>
          <Link
            to="/"
            data-path="storefront-home"
            className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Store
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div>
          <div className="flex flex-col w-full">
            <div className="relative w-full py-space-xl px-gutter-sm sm:px-gutter flex items-center justify-center min-h-[calc(100vh-8rem)] overflow-hidden">
              {/* Background Atmospheric Shapes & Brand Watermark */}
              <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-36 -right-24 w-[30rem] h-[30rem] rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />

              {/* Subtle Editorial Literary Graphic Watermark (Inline SVG) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                <svg className="w-[720px] h-[720px] text-primary" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M50 18c-14 0-26 4-34 9v52c8-5 20-9 34-9s26 4 34 9V27c-8-5-20-9-34-9zm-3 50.8c-10.8-.7-21.4 2.2-28.7 5.9V28.5c7.3-3.6 17.8-6.4 28.7-5.7v46zm34.7 5.9c-7.3-3.7-17.9-6.6-28.7-5.9V22.8c10.8-.7 21.4 2.1 28.7 5.7v51.2z" />
                </svg>
              </div>

              {/* Main Container Card (Material 3 Paper Elevated Tier) */}
              <div className="relative z-10 w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-xl shadow-primary/5 p-space-lg sm:p-space-xl flex flex-col transition-all duration-300">
                {/* Card Header: Brand Icon, Identity & Tagline */}
                <div className="flex flex-col items-center text-center mb-space-lg">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 mb-space-sm">
                    <span
                      className="material-symbols-outlined text-[30px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      auto_stories
                    </span>
                  </div>
                  <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
                    BookVerse
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                    Your sanctuary for literature &amp; knowledge
                  </p>
                </div>

                {/* Segmented M3 Tabs Control */}
                <div className="relative flex p-1 bg-surface-container-low rounded-full mb-space-lg select-none">
                  <div
                    id="tab-slider"
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none"
                    style={{ transform: mode === 'signin' ? 'translateX(0%)' : 'translateX(100%)' }}
                  />
                  <button
                    id="tab-btn-signin"
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors cursor-pointer ${
                      mode === 'signin'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant font-medium hover:text-on-surface'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="tab-btn-register"
                    type="button"
                    onClick={() => setMode('register')}
                    className={`relative z-10 flex-1 py-2 text-center font-label-lg text-label-lg transition-colors cursor-pointer ${
                      mode === 'register'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant font-medium hover:text-on-surface'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* TAB 1: SIGN IN VIEW */}
                <div
                  id="view-signin"
                  className={`flex flex-col transition-opacity duration-200 ${mode === 'signin' ? '' : 'hidden'}`}
                >
                  <form className="flex flex-col space-y-space-md" onSubmit={handleSignInSubmit}>
                    {/* Email Input Field */}
                    <div className="flex flex-col space-y-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="signin-email"
                      >
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          mail
                        </span>
                        <input
                          id="signin-email"
                          type="email"
                          required
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="reader@bookverse.com"
                          className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input Field */}
                    <div className="flex flex-col space-y-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="signin-password"
                      >
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          lock
                        </span>
                        <input
                          id="signin-password"
                          type={showSignInPassword ? 'text' : 'password'}
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-12 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showSignInPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="flex items-center justify-between pt-1 pb-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-primary bg-surface-container-low accent-primary focus:ring-0 cursor-pointer"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#"
                        onClick={handleForgotPassword}
                        className="font-label-md text-label-md text-on-tertiary-container hover:text-tertiary font-semibold transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Action */}
                    <button
                      type="submit"
                      className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <span>Sign In to BookVerse</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-space-lg flex items-center justify-center">
                    <div className="w-full h-[1px] bg-surface-container-high" />
                    <span className="absolute px-3 bg-surface-container-lowest font-label-sm text-label-sm uppercase tracking-wider text-outline">
                      or continue with
                    </span>
                  </div>

                  {/* Google OAuth Provider Integration Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full font-label-lg text-label-lg flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Guest Exploration Prompt */}
                  <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-space-md">
                    Browsing the catalogue?{' '}
                    <Link
                      to="/"
                      data-path="storefront-home"
                      className="text-primary font-semibold hover:underline"
                    >
                      Explore as Guest
                    </Link>
                  </p>
                </div>

                {/* TAB 2: REGISTER VIEW */}
                <div
                  id="view-register"
                  className={`flex flex-col transition-opacity duration-200 ${mode === 'register' ? '' : 'hidden'}`}
                >
                  <form className="flex flex-col space-y-space-sm" onSubmit={handleRegisterSubmit}>
                    {/* Full Name */}
                    <div className="flex flex-col space-y-1">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="reg-name"
                      >
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          person
                        </span>
                        <input
                          id="reg-name"
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Virginia Woolf"
                          className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-1">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="reg-email"
                      >
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          mail
                        </span>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="virginia@hogarthpress.org"
                          className="w-full h-11 pl-12 pr-4 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col space-y-1">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="reg-password"
                      >
                        Create Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          lock
                        </span>
                        <input
                          id="reg-password"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full h-11 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showRegPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col space-y-1">
                      <label
                        className="font-label-md text-label-md text-on-surface-variant font-semibold"
                        htmlFor="reg-confirm-password"
                      >
                        Confirm Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-[20px] text-outline pointer-events-none">
                          lock_reset
                        </span>
                        <input
                          id="reg-confirm-password"
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full h-11 pl-12 pr-12 bg-surface-container-lowest rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-4 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showRegConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          required
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-primary bg-surface-container-low accent-primary focus:ring-0 cursor-pointer"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                          I agree to the{' '}
                          <a
                            className="text-primary font-semibold hover:underline"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Terms of Service
                          </a>
                          ,{' '}
                          <a
                            className="text-primary font-semibold hover:underline"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Privacy Policy
                          </a>
                          , and BookVerse Patron guidelines.
                        </span>
                      </label>
                    </div>

                    {/* Submit Registration */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-primary-container transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <span>Create Patron Account</span>
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </button>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="relative my-space-md flex items-center justify-center">
                    <div className="w-full h-[1px] bg-surface-container-high" />
                    <span className="absolute px-3 bg-surface-container-lowest font-label-sm text-label-sm uppercase tracking-wider text-outline">
                      or sign up with
                    </span>
                  </div>

                  {/* Google OAuth for Sign Up */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full font-label-lg text-label-lg flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              </div>

              {/* Floating Help & Return Nav Below Card */}
              <div className="absolute bottom-6 flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant">
                <Link
                  to="/"
                  data-path="storefront-home"
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>Return to Storefront</span>
                </Link>
                <span className="text-outline-variant select-none">•</span>
                <a
                  href="#support"
                  onClick={handleSupportClick}
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">help_center</span>
                  <span>Patron Support &amp; FAQ</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-space-md px-gutter-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
          <p>© 2025 BookVerse Publishing &amp; Booksellers Inc.</p>
          <div className="flex items-center gap-space-md">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-on-surface transition-colors">
              Terms of Service
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-on-surface transition-colors">
              Privacy &amp; Security
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-on-surface transition-colors">
              Contact Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Auth;
