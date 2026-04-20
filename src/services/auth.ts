import type { AuthSuccessResponse } from '../types/auth';
import type { PublicRegistrationRole } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

interface Credentials {
  email: string;
  password: string;
}

interface RegisterPayload extends Credentials {
  username: string;
  role: PublicRegistrationRole;
}

async function request<T>(path: string, payload: object): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({} as { message?: string }));

  if (!response.ok) {
    const message = (body as { message?: string }).message ?? 'Authentication failed';
    throw new Error(message);
  }

  return body as T;
}

export function loginApi(payload: Credentials) {
  return request<AuthSuccessResponse>('/api/auth/login', payload);
}

export function registerApi(payload: RegisterPayload) {
  return request<AuthSuccessResponse>('/api/auth/register', payload);
}
