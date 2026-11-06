import React from 'react';

export const AuthEditorialHero: React.FC = () => {
  return (
    <div
      id="auth-editorial-hero"
      data-testid="auth-editorial-hero"
      className="flex flex-col items-center text-center mb-space-lg select-none"
    >
      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 mb-space-sm">
        <span className="material-symbols-outlined text-[30px] fill">
          auto_stories
        </span>
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
