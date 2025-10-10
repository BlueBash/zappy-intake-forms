import type { FormConfig } from '../types';
import weightLossConfig from './weight-loss/data';
import strengthRecoveryConfig from './strength-recovery/data';
import antiAgingConfig from './anti-aging/data';

export interface FormRouteEntry {
  path: string;
  slug: string;
  config: FormConfig;
  condition: string;
  title: string;
  description?: string;
}

const defaultDescription = (config: FormConfig, fallback: string) =>
  (config.meta?.form_name && `${config.meta.form_name}`) || fallback;

export const primaryPrograms: FormRouteEntry[] = [
  {
    path: '/ic/weight-loss',
    slug: 'weight-loss',
    config: weightLossConfig,
    condition: weightLossConfig.default_condition ?? 'Weight Loss',
    title: weightLossConfig.meta.product,
    description: defaultDescription(weightLossConfig, 'Physician-guided weight management with GLP-1 support.'),
  },
  {
    path: '/ic/strength-recovery',
    slug: 'strength-recovery',
    config: strengthRecoveryConfig,
    condition: strengthRecoveryConfig.default_condition ?? 'Strength Recovery',
    title: strengthRecoveryConfig.meta.product,
    description: defaultDescription(strengthRecoveryConfig, 'Clinician-led recovery support to rebuild strength.'),
  },
  {
    path: '/ic/anti-aging',
    slug: 'anti-aging',
    config: antiAgingConfig,
    condition: antiAgingConfig.default_condition ?? 'Anti-Aging',
    title: antiAgingConfig.meta.product,
    description: defaultDescription(antiAgingConfig, 'Longevity-focused therapies to support graceful aging.'),
  },
];

const aliasEntries: Array<[string, FormRouteEntry]> = [
  [
    '/ic/weigh-loss',
    {
      ...primaryPrograms[0],
      path: '/ic/weigh-loss',
    },
  ],
];

const routes: Record<string, FormRouteEntry> = {
  ...Object.fromEntries(primaryPrograms.map((entry) => [entry.path, entry])),
  ...Object.fromEntries(aliasEntries),
};

const normalizePath = (path: string): string => {
  if (!path) return '/';
  const trimmed = path.trim();
  if (trimmed === '') return '/';

  const lower = trimmed.toLowerCase();
  const withoutTrailingSlash = lower.endsWith('/') && lower !== '/' ? lower.slice(0, -1) : lower;
  return withoutTrailingSlash === '' ? '/' : withoutTrailingSlash;
};

export const resolveFormRoute = (path: string): FormRouteEntry | null => {
  const normalized = normalizePath(path);
  if (routes[normalized]) {
    return routes[normalized];
  }
  return null;
};

export const formRoutes = routes;
