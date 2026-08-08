import React from 'react';
import {
  LayoutDashboard, MapPin, CalendarClock, ListOrdered, Zap, History, User, Settings,
  Activity, PlugZap, CalendarRange, ClipboardList, BarChart3, Map, Sparkles, Bell, Car, Users, LogOut,
} from 'lucide-react';
import { useApp } from '../store';
import { useAuth } from '../lib/auth';
import { Route } from '../types';
import { cx, Badge } from './ui';
import { Logo } from './Logo';

const driverNav: { route: Route; label: string; icon: React.ReactNode }[] = [
  { route: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { route: 'find', label: 'Find Chargers', icon: <MapPin size={18} /> },
  { route: 'reservations', label: 'Reservations', icon: <CalendarClock size={18} /> },
  { route: 'queue', label: 'Queue', icon: <ListOrdered size={18} /> },
  { route: 'charging', label: 'Charging', icon: <Zap size={18} /> },
  { route: 'history', label: 'History', icon: <History size={18} /> },
  { route: 'members', label: 'Members', icon: <Users size={18} /> },
];
const driverBottom: { route: Route; label: string; icon: React.ReactNode }[] = [
  { route: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { route: 'find', label: 'Find', icon: <MapPin size={20} /> },
  { route: 'reservations', label: 'Bookings', icon: <CalendarClock size={20} /> },
  { route: 'history', label: 'History', icon: <History size={20} /> },
  { route: 'profile', label: 'Profile', icon: <User size={20} /> },
];

const operatorNav: { route: Route; label: string; icon: React.ReactNode }[] = [
  { route: 'operator-overview', label: 'Overview', icon: <Activity size={18} /> },
  { route: 'operator-live', label: 'Live Chargers', icon: <PlugZap size={18} /> },
  { route: 'operator-reservations', label: 'Reservations', icon: <CalendarRange size={18} /> },
  { route: 'operator-queue', label: 'Queue', icon: <ClipboardList size={18} /> },
  { route: 'operator-stations', label: 'Stations', icon: <Map size={18} /> },
  { route: 'operator-analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { mode, route, nav, dispatch, battery, notifications, copilotOpen } = useApp();
  const { user, profile, signOut } = useAuth();
  const unread = notifications.filter((n) => !n.read).length;
  const navItems = mode === 'driver' ? driverNav : operatorNav;
  const active = (r: Route) => r === route;

  const goSettings = () => nav(mode === 'driver' ? 'settings' : 'operator-settings');

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-surface border-r border-border z-30">
        <div className="px-5 py-5">
          <button onClick={() => nav('dashboard')} className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">ChargeShare</span>
            {mode === 'operator' && <Badge className="ml-1">Operator</Badge>}
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((n) => (
            <button
              key={n.route}
              onClick={() => nav(n.route)}
              className={cx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active(n.route) ? 'bg-primary/12 text-primary' : 'text-txt-sec hover:text-txt hover:bg-card'
              )}
            >
              {n.icon}
              {n.label}
              {n.route === 'charging' && route === 'charging' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary anim-pulse" />}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 pb-1 text-[10px] uppercase tracking-wider text-txt-mut">Account</p>
          </div>
          <button onClick={() => nav(mode === 'driver' ? 'profile' : 'operator-settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-txt-sec hover:text-txt hover:bg-card">
            <User size={18} /> Profile
          </button>
          <button onClick={goSettings} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-txt-sec hover:text-txt hover:bg-card">
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary font-display font-bold text-sm shrink-0">
              {(profile?.full_name || user?.email || 'U')[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{profile?.full_name || 'Account'}</p>
              <p className="text-[11px] text-txt-mut truncate">{mode === 'driver' ? (profile?.vehicle || 'BYD Dolphin') : 'Operator Panel'}</p>
            </div>
            <button onClick={() => signOut()} className="p-1.5 rounded-md hover:bg-card text-txt-mut hover:text-[#FF6B6B]" title="Sign out" aria-label="Sign out">
              <LogOut size={15} />
            </button>
          </div>
          {mode === 'driver' && (
            <div className="h-1.5 bg-card rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${battery}%` }} />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => nav('dashboard')} className="flex items-center gap-2">
          <Logo />
          <span className="font-display font-bold">ChargeShare</span>
          {mode === 'operator' && <Badge className="ml-1">Operator</Badge>}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })}
            className="p-2 rounded-lg bg-primary/12 text-primary"
            aria-label="Open Copilot"
          >
            <Sparkles size={18} />
          </button>
          <button onClick={() => nav(mode === 'driver' ? 'settings' : 'operator-settings')} className="p-2 rounded-lg hover:bg-card text-txt-sec" aria-label="Settings">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className={cx('md:pl-60 transition-opacity', copilotOpen && 'opacity-60')}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-border flex">
        {(mode === 'driver' ? driverBottom : []).map((n) => (
          <button
            key={n.route}
            onClick={() => nav(n.route)}
            className={cx(
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium',
              active(n.route) ? 'text-primary' : 'text-txt-mut'
            )}
          >
            {n.icon}
            {n.label}
          </button>
        ))}
        {mode === 'operator' && (
          <button onClick={() => nav('operator-overview')} className={cx('flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium', active('operator-overview') ? 'text-primary' : 'text-txt-mut')}>
            <Activity size={20} /> Panel
          </button>
        )}
      </nav>
    </div>
  );
}
