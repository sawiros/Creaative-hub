import React from 'react';
import { useApp } from './store';
import { useAuth } from './lib/auth';
import { Shell } from './components/Shell';
import { Toasts } from './components/Toasts';
import { CopilotPanel } from './components/Copilot';
import { AuthScreen } from './pages/auth/AuthScreen';
import { Spinner } from './components/ui';

// Driver
import { Dashboard } from './pages/driver/Dashboard';
import { Find } from './pages/driver/Find';
import { StationDetail } from './pages/driver/StationDetail';
import { Reserve } from './pages/driver/Reserve';
import { Reservations } from './pages/driver/Reservations';
import { Queue } from './pages/driver/Queue';
import { Charging } from './pages/driver/Charging';
import { HistoryPage } from './pages/driver/History';
import { Profile } from './pages/driver/Profile';
import { Settings } from './pages/driver/Settings';
import { MapPage } from './pages/driver/MapPage';
import { Members } from './pages/driver/Members';
// Operator
import { OperatorOverview } from './pages/operator/Overview';
import { OperatorLive } from './pages/operator/Live';
import { OperatorReservations } from './pages/operator/Reservations';
import { OperatorQueue } from './pages/operator/QueueManage';
import { OperatorStations } from './pages/operator/Stations';
import { OperatorAnalytics } from './pages/operator/Analytics';

export default function App() {
  const { route, mode, copilotOpen, dispatch } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3 text-txt-sec">
          <Spinner className="w-6 h-6" />
          <p className="text-sm">Loading ChargeShare…</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  let page: React.ReactNode;
  if (mode === 'operator') {
    switch (route) {
      case 'operator-overview': page = <OperatorOverview />; break;
      case 'operator-live': page = <OperatorLive />; break;
      case 'operator-reservations': page = <OperatorReservations />; break;
      case 'operator-queue': page = <OperatorQueue />; break;
      case 'operator-stations': page = <OperatorStations />; break;
      case 'operator-analytics': page = <OperatorAnalytics />; break;
      case 'operator-settings': page = <Settings operator />; break;
      default: page = <OperatorOverview />;
    }
  } else {
    switch (route) {
      case 'find': page = <Find />; break;
      case 'station': page = <StationDetail />; break;
      case 'reserve': page = <Reserve />; break;
      case 'reservations': page = <Reservations />; break;
      case 'queue': page = <Queue />; break;
      case 'charging': page = <Charging />; break;
      case 'history': page = <HistoryPage />; break;
      case 'profile': page = <Profile />; break;
      case 'settings': page = <Settings />; break;
      case 'map': page = <MapPage />; break;
      case 'members': page = <Members />; break;
      default: page = <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-bg text-txt">
      <Shell>{page}</Shell>
      <Toasts />
      {copilotOpen && (
        <>
          <div className="fixed inset-0 z-[55]" onClick={() => dispatch({ type: 'TOGGLE_COPILOT' })} />
          <CopilotPanel onClose={() => dispatch({ type: 'TOGGLE_COPILOT' })} />
        </>
      )}
    </div>
  );
}
