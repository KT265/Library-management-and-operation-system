import React from 'react';

const systemLogo = new URL('../../Public/Logo.png', import.meta.url).href;

export const AuthEditorialHero: React.FC = () => {
  return (
    <div
      id="auth-editorial-hero"
      data-testid="auth-editorial-hero"
      className="flex flex-col items-center text-center mb-space-lg select-none"
    >
      <div
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 mb-space-sm overflow-hidden"
        data-icon="auto_stories"
      >
        <img
          src={systemLogo}
          alt="BookVerse Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
        BookVerse
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
        Không gian tinh tuyển dành cho người yêu sách &amp; tri thức
      </p>
    </div>
  );
};

export default AuthEditorialHero;
