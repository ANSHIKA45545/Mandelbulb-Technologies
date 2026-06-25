import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Moon, Sun, Kanban } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/dashboard"
              className="btn-ghost hidden gap-2 sm:inline-flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <button onClick={toggleTheme} className="btn-ghost rounded-lg p-2" aria-label="Toggle theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">{user?.name}</span>
              <button onClick={handleLogout} className="btn-ghost rounded-lg p-2" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
