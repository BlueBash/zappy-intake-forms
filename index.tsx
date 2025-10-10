
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white">
        <div className="w-full px-6 pt-16 lg:px-10 xl:px-12">
          <BrandHeader />
        </div>
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-16 lg:px-10 xl:px-12">
          <header className="text-center">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-600">
              Choose Your Program
            </span>
            <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
              Start the tailored intake that fits your goals
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Select the service that matches your health journey and complete the secure intake in about 10 minutes.
            </p>
          </header>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {primaryPrograms.map((program) => (
              <a
                key={program.path}
                href={program.path}
                className="group relative flex flex-col rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{program.title}</h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Intake
                  </span>
                </div>
                {program.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{program.description}</p>
                )}
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Start intake
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 4.5 12.5 9.5 7.5 14.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <footer className="mt-16 text-center text-xs text-slate-500">
            Need help choosing? Email{' '}
            <a href="mailto:support@zappyhealth.com" className="font-semibold text-emerald-600 underline">
              support@zappyhealth.com
            </a>
            .
          </footer>
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
