import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  CheckSquare,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { canAccessRoute } from '../../config/rbac';
import type { AppRoute } from '../../config/rbac';
import BrandMark from '../UI/BrandMark';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/candidates', icon: Users, label: 'Candidates' },
  { path: '/clients', icon: Building2, label: 'Clients' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useApp();
  const visibleNavItems = navItems.filter(item => canAccessRoute(user?.role, item.path as AppRoute));
  const initials = (user?.username ?? 'User')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">TalentFlow CRM</p>
              <p className="text-xs text-gray-400 leading-tight">Smart Hiring Pipeline Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {visibleNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.username ?? 'User'} ({user?.role ?? 'Viewer'})</p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? 'No email'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
