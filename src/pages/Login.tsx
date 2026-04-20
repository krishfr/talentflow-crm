import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { loginApi, registerApi } from '../services/auth';
import { PUBLIC_REGISTRATION_ROLES } from '../types/auth';
import type { PublicRegistrationRole } from '../types/auth';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<PublicRegistrationRole>('Recruiter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = isRegisterMode
        ? await registerApi({ username: username.trim(), role, email: email.trim(), password })
        : await loginApi({ email: email.trim(), password });

      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError('');
    setIsRegisterMode(false);
    setEmail('admin@talentflow.io');
    setPassword('demo1234');
    try {
      const response = await loginApi({ email: 'admin@talentflow.io', password: 'demo1234' });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch {
      setError('Demo account not found. Please create it from backend or register first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">TalentFlow CRM</h1>
          <p className="text-blue-300/80 text-sm font-medium">Smart Hiring Pipeline Management</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{isRegisterMode ? 'Create account' : 'Welcome back'}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {isRegisterMode ? 'Register to access your CRM workspace' : 'Sign in to your account to continue'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {isRegisterMode && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required={isRegisterMode}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as PublicRegistrationRole)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    required={isRegisterMode}
                  >
                    {PUBLIC_REGISTRATION_ROLES.map(publicRole => (
                      <option key={publicRole} value={publicRole}>{publicRole}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@talentflow.io"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 shadow-lg shadow-blue-600/25 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isRegisterMode ? 'Register' : 'Sign In'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-medium">OR</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading || isRegisterMode}
            className="w-full flex items-center justify-center gap-2.5 py-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all duration-200 group disabled:opacity-60"
          >
            <Shield className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            Try Demo Account
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setError('');
              setIsRegisterMode(prev => !prev);
            }}
            className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-60"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo credentials: admin@talentflow.io / demo1234
          </p>
        </div>

        <p className="text-center text-blue-300/50 text-xs mt-6">
          &copy; 2026 TalentFlow CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
