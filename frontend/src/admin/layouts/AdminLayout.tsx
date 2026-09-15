import { useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  X,
} from 'lucide-react';

import { ADMIN_NAV } from './adminNav';
import { useAuth } from '../hooks/useAuth';
import { useUnreadNotificationsCount } from '../hooks/useUnreadNotificationsCount';
import ToastViewport from '../components/ToastViewport';
import ScrollVideo from '../../components/ScrollVideo';
import logo from '../../assets/logo.png';

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { hasPermission } = useAuth();

  return (
    <nav className="sidebar-scroll flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      {ADMIN_NAV.map((section) => {
        const visibleItems = section.items.filter(
          (item) =>
            !item.permission ||
            hasPermission(item.permission)
        );

        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <div
            key={section.title || 'top'}
            className="shrink-0"
          >
            {section.title && (
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">
                {section.title}
              </p>
            )}

            <div className="flex flex-col gap-0.5">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-150 ${
                      isActive
                        ? 'bg-brand/15 text-brand'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function Brand({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/admin/dashboard"
      onClick={onClick}
      className={`flex shrink-0 items-center ${
        mobile ? 'gap-2.5' : 'gap-2.5'
      }`}
    >
      <img
        src={logo}
        alt="DigixDubai Logo"
        className="h-9 w-9 shrink-0 object-contain"
      />

      <span
        className={`font-medium tracking-tight text-white ${
          mobile ? 'text-sm' : 'text-base'
        }`}
      >
        digixdubai
      </span>
    </Link>
  );
}

function pageTitleFromPath(pathname: string) {
  const segment =
    pathname
      .replace('/admin/', '')
      .split('/')[0] || 'dashboard';

  return segment
    .split('-')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const unreadCount = useUnreadNotificationsCount();

  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  const pathSegments = location.pathname
    .replace('/admin/', '')
    .split('/')
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background */}
      <ScrollVideo />

      {/* Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-black/50" />

      <div className="relative z-10 flex min-h-screen">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-transparent lg:flex">
          {/* Desktop Brand - ONLY ONCE */}
          <div className="flex h-[73px] shrink-0 items-center border-b border-white/10 px-6">
            <Brand />
          </div>

          {/* Desktop Navigation */}
          <div className="min-h-0 flex-1">
            <SidebarContent />
          </div>
        </aside>

        {/* ================= MOBILE SIDEBAR ================= */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[100] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 h-full w-full bg-black/30 backdrop-blur-[2px]"
            />

            {/* Drawer */}
            <aside className="absolute inset-y-0 left-0 flex h-screen w-[280px] max-w-[85vw] flex-col border-r border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl">
              {/* Mobile Brand - ONLY ONCE */}
              <div className="flex h-[73px] shrink-0 items-center justify-between border-b border-white/10 px-5">
                <Brand
                  mobile
                  onClick={() => setMobileOpen(false)}
                />

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="min-h-0 flex-1">
                <SidebarContent
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
            </aside>
          </div>
        )}

        {/* ================= MAIN ================= */}
        <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
          {/* Navbar */}
          <header className="flex min-h-[61px] shrink-0 items-center justify-between border-b border-white/10 bg-transparent px-4 py-3 sm:px-6">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">
              {/* Mobile Menu */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              {/* Page Heading */}
              <div className="min-w-0">
                <p className="truncate text-[11px] text-white/40">
                  Admin

                  {pathSegments.map((segment, index) => (
                    <span key={index}>
                      {' '}
                      /{' '}
                      {segment.replace(/-/g, ' ')}
                    </span>
                  ))}
                </p>

                <h1 className="truncate text-lg font-medium">
                  {pageTitleFromPath(location.pathname)}
                </h1>
              </div>
            </div>

            {/* Right */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <Link
                to="/admin/notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-black">
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen((value) => !value)
                  }
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white/85 transition-colors hover:bg-white/5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/20 text-xs font-medium text-brand">
                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() ?? '?'}
                  </span>

                  <span className="hidden sm:inline">
                    {user?.name}
                  </span>

                  <ChevronDown
                    size={14}
                    className="text-white/40"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-[60] mt-1 w-44 rounded-md border border-white/15 bg-black/20 py-1 shadow-xl backdrop-blur-xl">
                    <p className="truncate border-b border-white/10 px-3 py-2 text-xs text-white/50">
                      {user?.email}
                    </p>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="min-w-0 flex-1 overflow-x-hidden bg-transparent p-4 sm:p-6">
            <Outlet />
          </main>
        </div>

        {/* Toasts */}
        <ToastViewport />
      </div>

      {/* Hide Sidebar Scrollbar */}
      <style>
        {`
          .sidebar-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .sidebar-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
    </div>
  );
}