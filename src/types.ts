export type ChargerType = 'DC Fast' | 'AC';
export type Status = 'available' | 'reserved' | 'charging' | 'offline';

export interface Charger {
  id: string;
  name: string;
  type: ChargerType;
  power: number; // kW
  connector: string; // e.g. CCS2
  status: Status;
  pricePerKwh: number; // ETB
  reservationFee: number; // ETB
}

export interface QueueEntry {
  id: string;
  vehicleId: string;
  plate?: string;
  status: 'charging' | 'waiting' | 'reserved' | 'completed' | 'skipped';
  etaMin?: number;
  reservedAt?: string;
  isUser?: boolean;
}

export interface Station {
  id: string;
  name: string;
  operator: string;
  area: string;
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
  availableSlots: number;
  totalSlots: number;
  queue: QueueEntry[];
  openingHours: string;
  amenities: string[];
  pricePerKwh: number;
  reservationFee: number;
  maxPower: number;
  chargers: Charger[];
  recommended?: boolean;
}

export interface TimeSlot {
  time: string; // "15:00"
  status: 'available' | 'limited' | 'full';
}

export interface Reservation {
  id: string;
  ref: string;
  stationId: string;
  stationName: string;
  area: string;
  chargerName: string;
  power: number;
  time: string; // "15:00 – 15:30"
  fee: number;
  status: 'confirmed' | 'queued' | 'active' | 'completed' | 'cancelled';
  qr: string;
  txn: string;
  dateLabel: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  dateLabel: string;
  station: string;
  area: string;
  kWh: number;
  cost: number;
  durationMin: number;
  startBattery: number;
  endBattery: number;
}

export interface ChargingState {
  active: boolean;
  stationId?: string;
  stationName?: string;
  power?: number;
  batteryStart: number;
  batteryNow: number;
  batteryTarget: number;
  energyDelivered: number;
  timeElapsedMin: number;
  estRemainingMin: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: 'info' | 'success' | 'warning' | 'charging';
}

export type Route =
  | 'dashboard'
  | 'find'
  | 'station'
  | 'reserve'
  | 'reservations'
  | 'queue'
  | 'charging'
  | 'history'
  | 'profile'
  | 'settings'
  | 'map'
  | 'members'
  | 'operator-overview'
  | 'operator-live'
  | 'operator-reservations'
  | 'operator-queue'
  | 'operator-stations'
  | 'operator-analytics'
  | 'operator-settings';
