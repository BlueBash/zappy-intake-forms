
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import App from './App';
import { formRoutes, primaryPrograms, resolveFormRoute } from './forms/routes';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const BrandHeader: React.FC = () => (
  <header className="mb-10 flex justify-center sm:justify-start">
    <a href="https://zappyhealth.com" className="inline-flex items-center" aria-label="ZappyHealth home">
      <img
        src="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp"
        srcSet="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp 352w, https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2-300x109.webp 300w"
        sizes="(max-width: 352px) 100vw, 352px"
        width={352}
        height={128}
        alt="ZappyHealth"
        loading="lazy"
        className="h-12 w-auto sm:h-16"
      />
    </a>
  </header>
);

const FormRouter: React.FC = () => {
  const [path, setPath] = useState<string>(() => window.location.pathname);

  const normalizePath = (input: string): string => {
    if (!input) return '/';
    const trimmed = input.trim();
    if (trimmed === '') return '/';
    const lower = trimmed.toLowerCase();
    const withoutTrailingSlash = lower.endsWith('/') && lower !== '/' ? lower.slice(0, -1) : lower;
    return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const normalizedPath = useMemo(() => normalizePath(path), [path]);
  const route = useMemo(() => resolveFormRoute(normalizedPath), [normalizedPath]);

  useEffect(() => {
    document.title = route ? `${route.title} | Intake` : 'Choose Your Program | Intake';
  }, [route]);

  if (!route && normalizedPath === '/') {
    const programs = [
      { path: '/ic/weight-loss', label: 'Lose Weight' },
      { path: '/ic/strength-recovery', label: 'Build Strength and Longevity' },
      { path: '/ic/anti-aging', label: 'Reverse Aging' }
    ];

    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: 'linear-gradient(to bottom right, #FDFBF7, #FEF9F3, #FDF6EF)' }}>
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-700 leading-tight mb-8">
              Every journey starts with one step
            </h1>
            <h2 className="text-2xl font-medium text-neutral-700 mb-6">
              What's your goal today?
            </h2>
          </div>
          <div className="space-y-3 mb-8">
            {programs.map((program, index) => (
              <motion.a
                key={program.path}
                href={program.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1,
                  borderColor: '#e5e5e5',
                  backgroundColor: '#ffffff',
                  color: '#525252'
                }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: 'rgba(13, 148, 136, 0.4)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                  transition: { 
                    delay: 0.12,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }
                }}
                whileTap={{ 
                  scale: 0.96,
                  transition: { 
                    type: 'spring',
                    stiffness: 500,
                    damping: 15
                  }
                }}
                transition={{ 
                  opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  x: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }
                }}
                className="w-full flex items-center justify-between p-5 border-2 rounded-xl text-base focus:outline-none block"
              >
                <span className="text-left flex-1 font-medium">{program.label}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-gray-300">
                  <svg 
                    className="w-4 h-4 text-gray-400" 
                    fill="none" 
                    strokeWidth="2" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!route) {
    const fallbackLinks = Object.keys(formRoutes)
      .filter((key) => key.startsWith('/ic/'))
      .map((key) => (
        <a key={key} className="text-emerald-600 underline" href={key}>
          {formRoutes[key].title}
        </a>
      ));

    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <div className="w-full">
          <BrandHeader />
        </div>
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center text-center space-y-6">
          <h1 className="text-2xl font-semibold text-slate-900">Form not found</h1>
          <p className="text-sm text-slate-600">
            We couldn&apos;t find a form for <code>{path}</code>. Choose one of the available programs below.
          </p>
          <div className="flex flex-col gap-2 text-sm text-slate-700">{fallbackLinks}</div>
        </div>
      </div>
    );
  }

  return <App formConfig={route.config} defaultCondition={route.condition} />;
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FormRouter />
  </React.StrictMode>
);
