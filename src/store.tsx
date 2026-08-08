import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Charger, ChargingState, Notification, QueueEntry, Reservation, Route, SessionRecord, Station, TimeSlot } from './types';
import { currentUser, defaultHistory, defaultNotifications, defaultStations, qrText, timeSlots } from './data/mock';

export type Toast = { id: number; title: string; body?: string; icon?: string };
export type CopilotMsg = { from: 'user' | 'ai'; text: string };

interface AppState {
  mode: 'driver' | 'operator';
  route: Route;
  stationId: string | null; // current station detail
  stations: Station[];
  reservations: Reservation[];
  history: SessionRecord[];
  notifications: Notification[];
  battery: number;
  queueJoined: boolean;
  queuePosition: number;
  charging: ChargingState | null;
  slots: TimeSlot[];
  copilotOpen: boolean;
  copilotMsgs: CopilotMsg[];
}

type Action =
  | { type: 'NAV'; route: Route }
  | { type: 'OPEN_STATION'; id: string }
  | { type: 'SET_MODE'; mode: 'driver' | 'operator' }
  | { type: 'ADD_RESERVATION'; r: Reservation }
  | { type: 'CANCEL_RESERVATION'; id: string }
  | { type: 'JOIN_QUEUE'; position: number }
  | { type: 'LEAVE_QUEUE' }
  | { type: 'QUEUE_SHIFT' }
  | { type: 'START_CHARGING'; s: ChargingState }
  | { type: 'UPDATE_CHARGING'; patch: Partial<ChargingState> }
  | { type: 'END_CHARGING' }
  | { type: 'COMPLETE_SESSION'; rec: SessionRecord }
  | { type: 'MARK_NOTIFS_READ' }
  | { type: 'ADD_NOTIF'; n: Omit<Notification, 'id' | 'time' | 'read'> }
  | { type: 'SET_BATTERY'; v: number }
  | { type: 'SET_CHARGER_STATUS'; stationId: string; chargerId: string; status: Charger['status'] }
  | { type: 'ADD_CHARGER'; stationId: string; c: Charger }
  | { type: 'REMOVE_CHARGER'; stationId: string; chargerId: string }
  | { type: 'UPDATE_CHARGER'; stationId: string; chargerId: string; patch: Partial<Charger> }
  | { type: 'TOGGLE_COPILOT' }
  | { type: 'COPILOT_SEND'; msg: CopilotMsg };

const initial: AppState = {
  mode: 'driver',
  route: 'dashboard',
  stationId: null,
  stations: defaultStations(),
  reservations: [],
  history: defaultHistory(),
  notifications: defaultNotifications(),
  battery: currentUser.battery,
  queueJoined: false,
  queuePosition: 3,
  charging: null,
  slots: timeSlots(),
  copilotOpen: false,
  copilotMsgs: [
    { from: 'ai', text: "Hi Abel. I'm your ChargeShare Copilot. Ask me to find a charger, check availability, or plan your charge." },
  ],
};

function cloneStations(stations: Station[]): Station[] {
  return stations.map((s) => ({ ...s, queue: s.queue.map((q) => ({ ...q })), chargers: s.chargers.map((c) => ({ ...c })) }));
}

function reducer(state: AppState, a: Action): AppState {
  switch (a.type) {
    case 'NAV':
      return { ...state, route: a.route };
    case 'OPEN_STATION':
      return { ...state, stationId: a.id, route: 'station' };
    case 'SET_MODE':
      return { ...state, mode: a.mode, route: a.mode === 'operator' ? 'operator-overview' : 'dashboard' };
    case 'ADD_RESERVATION':
      return { ...state, reservations: [a.r, ...state.reservations] };
    case 'CANCEL_RESERVATION':
      return { ...state, reservations: state.reservations.map((r) => (r.id === a.id ? { ...r, status: 'cancelled' } : r)) };
    case 'JOIN_QUEUE':
      return { ...state, queueJoined: true, queuePosition: a.position };
    case 'LEAVE_QUEUE':
      return { ...state, queueJoined: false, queuePosition: state.reservations.length > 0 ? state.queuePosition : 3 };
    case 'QUEUE_SHIFT': {
      const p = Math.max(1, state.queuePosition - 1);
      return { ...state, queuePosition: p };
    }
    case 'START_CHARGING':
      return { ...state, charging: a.s, queueJoined: false };
    case 'UPDATE_CHARGING':
      return state.charging ? { ...state, charging: { ...state.charging, ...a.patch }, battery: a.patch.batteryNow ?? state.battery } : state;
    case 'END_CHARGING':
      return { ...state, charging: null };
    case 'COMPLETE_SESSION':
      return { ...state, history: [a.rec, ...state.history] };
    case 'MARK_NOTIFS_READ':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'ADD_NOTIF':
      return { ...state, notifications: [{ ...a.n, id: String(Date.now()), time: 'Just now', read: false }, ...state.notifications] };
    case 'SET_BATTERY':
      return { ...state, battery: a.v };
    case 'SET_CHARGER_STATUS':
      return {
        ...state,
        stations: state.stations.map((s) =>
          s.id === a.stationId ? { ...s, chargers: s.chargers.map((c) => (c.id === a.chargerId ? { ...c, status: a.status } : c)) } : s
        ),
      };
    case 'ADD_CHARGER':
      return { ...state, stations: state.stations.map((s) => (s.id === a.stationId ? { ...s, chargers: [...s.chargers, a.c], totalSlots: s.totalSlots + 1 } : s)) };
    case 'REMOVE_CHARGER':
      return {
        ...state,
        stations: state.stations.map((s) =>
          s.id === a.stationId ? { ...s, chargers: s.chargers.filter((c) => c.id !== a.chargerId), totalSlots: Math.max(0, s.totalSlots - 1) } : s
        ),
      };
    case 'UPDATE_CHARGER':
      return {
        ...state,
        stations: state.stations.map((s) =>
          s.id === a.stationId ? { ...s, chargers: s.chargers.map((c) => (c.id === a.chargerId ? { ...c, ...a.patch } : c)) } : s
        ),
      };
    case 'TOGGLE_COPILOT':
      return { ...state, copilotOpen: !state.copilotOpen };
    case 'COPILOT_SEND':
      return { ...state, copilotMsgs: [...state.copilotMsgs, a.msg] };
    default:
      return state;
  }
}

interface Ctx extends AppState {
  dispatch: React.Dispatch<Action>;
  nav: (route: Route) => void;
  openStation: (id: string) => void;
  toast: (title: string, body?: string, icon?: string) => void;
  toasts: Toast[];
}

const AppCtx = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppCtx);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (state.charging) {
      t = setInterval(() => {
        const c = state.charging;
        if (!c) return;
        const batteryNow = Math.min(c.batteryTarget, c.batteryNow + 2);
        const energy = parseFloat((c.energyDelivered + 0.6).toFixed(1));
        const elapsed = c.timeElapsedMin + 1;
        const est = Math.max(0, Math.round((c.batteryTarget - batteryNow) / 3));
        dispatch({ type: 'UPDATE_CHARGING', patch: { batteryNow, energyDelivered: energy, timeElapsedMin: elapsed, estRemainingMin: est } });
        if (batteryNow >= c.batteryTarget) {
          dispatch({ type: 'END_CHARGING' });
          dispatch({
            type: 'COMPLETE_SESSION',
            rec: {
              id: 'h' + Date.now(),
              date: 'Aug 8',
              dateLabel: '2026-08-08',
              station: c.stationName || 'Bole Fast Charge',
              area: 'Bole',
              kWh: energy,
              cost: Math.round(energy * 6),
              durationMin: elapsed,
              startBattery: c.batteryStart,
              endBattery: batteryNow,
            },
          });
          setToasts((p) => [...p, { id: Date.now(), title: 'Session completed', body: 'Charging complete. Review in your history.', icon: 'success' }]);
        }
      }, 2000);
    }
    return () => clearInterval(t);
  }, [state.charging]);

  const nav = (route: Route) => dispatch({ type: 'NAV', route });
  const openStation = (id: string) => dispatch({ type: 'OPEN_STATION', id });
  const toast = (title: string, body?: string, icon?: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, title, body, icon }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4200);
  };

  return (
    <AppCtx.Provider value={{ ...state, dispatch, nav, openStation, toast, toasts } as unknown as Ctx}>
      {children}
    </AppCtx.Provider>
  );
};
