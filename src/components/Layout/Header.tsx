import { Menu, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Admin' },
  '/candidates': { title: 'Candidates', subtitle: 'Manage your talent pool' },
  '/clients': { title: 'Clients', subtitle: 'Manage your client accounts' },
  '/pipeline': { title: 'Pipeline', subtitle: 'Track hiring progress' },
  '/tasks': { title: 'Tasks', subtitle: 'Your follow-up actions' },
  '/reports': { title: 'Reports', subtitle: 'Hiring performance insights' },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const { user } = useApp();
  const page = pageTitles[location.pathname] ?? { title: 'TalentFlow', subtitle: '' };
  const subtitle = location.pathname === '/dashboard'
    ? `Welcome back, ${user?.username ?? 'User'} (${user?.role ?? 'Viewer'})`
    : page.subtitle;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{page.title}</h1>
          <p className="text-xs text-gray-400 leading-tight">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none flex-1"
          />
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}
