import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AuthEditorialHero } from '../components/auth/AuthEditorialHero';
import { AuthSegmentedToggle } from '../components/auth/AuthSegmentedToggle';
import { SignInForm } from '../components/auth/SignInForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { SocialOAuthDivider } from '../components/auth/SocialOAuthDivider';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  lookupUserRoleAndProfile,
  mapFirebaseUserToUser,
  syncUserProfileToFirestore,
} from '../services/firebase';

const systemLogo = new URL('../Public/Logo.png', import.meta.url).href;

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

  // Google OAuth Loading State
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect destination helper
  const getRedirectPath = (isAdmin: boolean) => {
    if (isAdmin) return '/admin';
    const state = location.state as { from?: { pathname?: string } | string } | undefined;
    if (typeof state?.from === 'string') return state.from || '/';
    return state?.from?.pathname || '/';
  };

  // Sign In Handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword) {
      showToast('Vui lòng nhập đầy đủ địa chỉ email và mật khẩu.');
      return;
    }

    const emailClean = signInEmail.trim().toLowerCase();
    const isAdmin = emailClean.includes('admin') || emailClean === 'ops@bookverse.io';

    login({
      email: signInEmail.trim(),
      name: isAdmin ? 'Curator Admin' : (signInEmail.split('@')[0] || 'Patron Reader'),
      role: isAdmin ? 'admin' : 'customer',
    });

    showToast(
      isAdmin
        ? 'Đã đăng nhập vào Bảng điều khiển Quản trị viên.'
        : 'Chào mừng bạn quay trở lại với BookVerse!'
    );
    navigate(getRedirectPath(isAdmin));
  };

  // Register Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.');
      return;
    }
    if (regPassword.length < 8) {
      showToast('Mật khẩu phải chứa ít nhất 8 ký tự.');
      return;
    }
    if (!agreeTerms) {
      showToast('Vui lòng đồng ý với Điều khoản dịch vụ để tiếp tục.');
      return;
    }

    login({
      name: regName.trim(),
      email: regEmail.trim(),
      role: 'customer',
    });

    const safeName = regName.trim();
    showToast('Chào mừng ' + safeName + ' đến với BookVerse! Tài khoản độc giả đã được tạo thành công.');
    navigate(getRedirectPath(false));
  };

  // Google OAuth Handler (lifted from SocialOAuthDivider, replaces handleGoogleAuth)
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const provider = googleProvider || new GoogleAuthProvider();
      const currentAuth = auth || getAuth();
      if (!currentAuth || !provider) {
        throw new Error('Firebase Auth hoặc GoogleAuthProvider chưa được khởi tạo');
      }

      // Execute signInWithPopup(auth, googleProvider)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const fbUser = user;

      // Check if user document exists in Firestore "users" collection
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          avatar: user.photoURL || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
      }

      const idToken = await fbUser.getIdToken();
      const { role, firestoreData } = await lookupUserRoleAndProfile(fbUser.uid, fbUser.email);
      const mappedUser = mapFirebaseUserToUser(fbUser, role, firestoreData);

      // Best-effort Firestore sync
      syncUserProfileToFirestore(fbUser, role).catch((err) => {
        console.warn('[Firestore] Profile sync notice:', err);
      });

      login(mappedUser, idToken);
      showToast('Đăng nhập thành công với tài khoản Google.');
      navigate(getRedirectPath(mappedUser.role === 'admin'));
    } catch (error: any) {
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        showToast('Đăng nhập Google đã bị hủy.');
      } else {
        console.error('[GoogleAuth] Error during popup login:', error);
        showToast(error.message || 'Không thể đăng nhập bằng Google. Vui lòng thử lại.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Forgot Password Stub
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
  };

  // Support / FAQ Stub
  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Bộ phận Hỗ trợ Độc giả BookVerse sẵn sàng phục vụ tại support@bookverse.vn');
  };

  return (
    <div
      id="auth-page"
      data-testid="auth-page"
      className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between"
    >
      {/* Top Fixed Header */}
      <header
        id="auth-header"
        data-testid="auth-header"
        className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      >
        <div className="h-16 w-full px-gutter-lg flex items-center justify-between">
          <Link
            to="/"
            data-path="storefront-home"
            data-testid="auth-header-link-brand"
            className="flex items-center gap-space-sm text-primary group"
          >
            <div
              className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-105 transition-transform overflow-hidden"
              data-icon="menu_book"
            >
              <img
                src={systemLogo}
                alt="BookVerse Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">
              BookVerse
            </span>
          </Link>
          <Link
            to="/"
            data-path="storefront-home"
            data-testid="auth-header-link-back"
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

              {/* Editorial Literary Watermark (Inline SVG) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                <svg className="w-[720px] h-[720px] text-primary" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M50 18c-14 0-26 4-34 9v52c8-5 20-9 34-9s26 4 34 9V27c-8-5-20-9-34-9zm-3 50.8c-10.8-.7-21.4 2.2-28.7 5.9V28.5c7.3-3.6 17.8-6.4 28.7-5.7v46zm34.7 5.9c-7.3-3.7-17.9-6.6-28.7-5.9V22.8c10.8-.7 21.4 2.1 28.7 5.7v51.2z" />
                </svg>
              </div>

              {/* Main Container Card */}
              <div
                id="auth-card"
                data-testid="auth-card"
                className="relative z-10 w-full max-w-[480px] bg-surface-container-lowest rounded-lg shadow-xl shadow-primary/5 p-space-lg sm:p-space-xl flex flex-col transition-all duration-300"
              >
                {/* 1. Card Header: Brand Icon, Identity & Tagline */}
                <AuthEditorialHero />

                {/* 2. Segmented M3 Tabs Control */}
                <AuthSegmentedToggle mode={mode} onModeChange={setMode} />

                {/* 3. Sign In View Form */}
                <SignInForm
                  email={signInEmail}
                  setEmail={setSignInEmail}
                  password={signInPassword}
                  setPassword={setSignInPassword}
                  showPassword={showSignInPassword}
                  setShowPassword={setShowSignInPassword}
                  rememberMe={rememberMe}
                  setRememberMe={setRememberMe}
                  onSubmit={handleSignInSubmit}
                  onForgotPassword={handleForgotPassword}
                  isVisible={mode === 'signin'}
                />

                {/* 4. Register View Form */}
                <RegisterForm
                  name={regName}
                  setName={setRegName}
                  email={regEmail}
                  setEmail={setRegEmail}
                  password={regPassword}
                  setPassword={setRegPassword}
                  confirmPassword={regConfirmPassword}
                  setConfirmPassword={setRegConfirmPassword}
                  showPassword={showRegPassword}
                  setShowPassword={setShowRegPassword}
                  showConfirmPassword={showRegConfirmPassword}
                  setShowConfirmPassword={setShowRegConfirmPassword}
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  onSubmit={handleRegisterSubmit}
                  isVisible={mode === 'register'}
                />

                {/* 5. Social OAuth & Guest Exploration */}
                <SocialOAuthDivider
                  onGoogleAuth={handleGoogleLogin}
                  dividerText={mode === 'signin' ? 'hoặc tiếp tục với' : 'hoặc đăng ký bằng'}
                  isLoading={isGoogleLoading}
                />
              </div>

              {/* Floating Help & Return Nav Below Card */}
              <div className="absolute bottom-6 flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant">
                <Link
                  to="/"
                  data-path="storefront-home"
                  data-testid="auth-footer-link-storefront"
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>Quay lại Cửa hàng / Storefront</span>
                </Link>
                <span className="text-outline-variant select-none">•</span>
                <a
                  href="#support"
                  data-testid="auth-footer-link-support"
                  onClick={handleSupportClick}
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">help_center</span>
                  <span>Hỗ trợ &amp; Trợ giúp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          id="auth-footer"
          data-testid="auth-footer"
          className="w-full py-space-md px-gutter-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant"
        >
          <p>© 2026 BookVerse Publishing &amp; Booksellers Inc. Bản quyền được bảo hộ.</p>
          <div className="flex items-center gap-space-md">
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-on-surface transition-colors">
              Điều khoản dịch vụ
            </a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-on-surface transition-colors">
              Bảo mật &amp; Quyền riêng tư
            </a>
            <a href="#support" onClick={handleSupportClick} className="hover:text-on-surface transition-colors">
              Liên hệ Hỗ trợ
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Auth;
