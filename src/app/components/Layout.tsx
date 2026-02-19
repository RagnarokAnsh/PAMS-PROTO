import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  UserCircle,
  ClipboardList,
  HandshakeIcon,
  FileEdit,
  DollarSign,
  FolderKanban,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agreements', label: 'Agreements', icon: FileText },
  { path: '/partners', label: 'Partners', icon: HandshakeIcon },
  { path: '/my-actions', label: 'My Actions', icon: CheckCircle },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/audit-log', label: 'Audit Log', icon: ClipboardList },
  { path: '/access-request', label: 'Access Request', icon: UserCircle },
  { path: '/amendments', label: 'Amendments', icon: FileEdit },
  { path: '/grants', label: 'Grants', icon: DollarSign },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
];

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useUser } from '../context/UserContext';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

  const getPageTitle = () => {
    // Agreement detail page: show "Agreement : {ID}"
    const agreementMatch = location.pathname.match(/\/agreements\/(.+)/);
    if (agreementMatch) {
      return `Agreement : ${agreementMatch[1]}`;
    }
    const matches = menuItems.filter((item) => {
      if (item.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.path);
    });
    const best = matches.sort((a, b) => b.path.length - a.path.length)[0];
    return best?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm transition-colors ${isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-primary flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl text-white">{getPageTitle()}</h1>

          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2 mr-2 bg-white/10 rounded-md p-1">
              <span className="text-white/80 text-xs px-2">View as:</span>
              <Select value={userRole} onValueChange={(v) => setUserRole(v as 'CPS' | 'FRMS')}>
                <SelectTrigger className="w-[110px] h-8 bg-transparent border-none text-white focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPS">CPS User</SelectItem>
                  <SelectItem value="FRMS">FRMS User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-white hover:bg-primary/90 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm">Ansh Sharma</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}