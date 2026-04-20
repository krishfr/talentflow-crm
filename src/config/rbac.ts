import type { UserRole } from '../types/auth';

export type AppRoute =
  | '/dashboard'
  | '/candidates'
  | '/clients'
  | '/pipeline'
  | '/tasks'
  | '/reports';

export const ROLE_ROUTE_ACCESS: Record<UserRole, AppRoute[]> = {
  Admin: ['/dashboard', '/candidates', '/clients', '/pipeline', '/tasks', '/reports'],
  Recruiter: ['/dashboard', '/candidates', '/clients', '/pipeline', '/tasks'],
  'Hiring Manager': ['/dashboard', '/candidates', '/pipeline', '/reports'],
  Viewer: ['/dashboard', '/candidates', '/pipeline'],
};

export function canAccessRoute(role: UserRole | null | undefined, route: AppRoute): boolean {
  if (!role) return false;
  return ROLE_ROUTE_ACCESS[role].includes(route);
}

export function canManageCandidates(role: UserRole | null | undefined): boolean {
  return role === 'Admin' || role === 'Recruiter';
}

export function canManageClients(role: UserRole | null | undefined): boolean {
  return role === 'Admin' || role === 'Recruiter';
}

export function canManageTasks(role: UserRole | null | undefined): boolean {
  return role === 'Admin' || role === 'Recruiter';
}
