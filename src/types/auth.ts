export type UserRole = 'Admin' | 'Recruiter' | 'Hiring Manager' | 'Viewer';
export type PublicRegistrationRole = Exclude<UserRole, 'Admin'>;

export const PUBLIC_REGISTRATION_ROLES: PublicRegistrationRole[] = [
  'Recruiter',
  'Hiring Manager',
  'Viewer',
];

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthSuccessResponse {
  token: string;
  user: AuthUser;
}
