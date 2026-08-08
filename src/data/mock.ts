import { Charger, Station, TimeSlot, SessionRecord, Notification, QueueEntry } from '../types';

// ----- Driver / user -----
export const currentUser = {
  name: 'Abel',
  fullName: 'Abel Tesfaye',
  vehicle: 'BYD Dolphin',
  vehicleType: 'Compact Hatchback',
  battery: 23,
  phone: '09 11 48 26 04',
  savedPayment: 'Telebirr •••• 2604',
  membership: 'Standard',
};

export const ethiopianPhone = '09 11 48 26 04';

// ----- Chargers factory -----
function mkCharger(id: string, name: string, power: number, status: Charger['status'], reservationFee = 50, pricePerKwh = 6): Charger {
  return { id, name, type: 'DC Fast', power, connector: 'CCS2', status, reservationFee, pricePerKwh };
}

export function defaultChargers(): Charger[] {
  return [
    mkCharger('c1', 'Charger 01', 120, 'charging'),
    mkCharger('c2', 'Charger 02', 120, 'charging'),
    mkCharger('c3', 'Charger 03', 120, 'available'),
    mkCharger('c4', 'Charger 04', 120, 'reserved'),
    mkCharger('c5', 'Charger 05', 150, 'available'),
    mkCharger('c6', 'Charger 06', 150, 'available'),
  ];
}

const queue = (): QueueEntry[] => [
  { id: 'q1', vehicleId: 'EV-102', plate: '3F 88021', status: 'charging', etaMin: 12 },
  { id: 'q2', vehicleId: 'EV-221', plate: '8E 44192', status: 'waiting', etaMin: 25 },
  { id: 'q3', vehicleId: 'EV-304', plate: '2C 70013', status: 'reserved', reservedAt: '15:00' },
  { id: 'q4', vehicleId: 'EV-501', plate: '9A 12034', status: 'waiting', etaMin: 48 },
];

// ----- Stations -----
export function defaultStations(): Station[] {
  return [
    {
      id: 'st1',
      name: 'Bole Fast Charge',
      operator: 'Demo Operator — Bole Hub',
      area: 'Bole',
      address: 'Bole Road, near Edna Mall, Addis Ababa',
      distanceKm: 2.1,
      lat: 9.0056,
      lng: 38.7908,
      availableSlots: 2,
      totalSlots: 6,
      queue: queue(),
      openingHours: 'Open 24 hours',
      amenities: ['Coffee lounge', 'WiFi', 'Restroom', '24/7 Security'],
      pricePerKwh: 6,
      reservationFee: 50,
      maxPower: 150,
      chargers: defaultChargers(),
      recommended: true,
    },
    {
      id: 'st2',
      name: 'Mexico EV Hub',
      operator: 'Demo Operator — Mexico',
      area: 'Mexico',
      address: 'Mexico Square, Addis Ababa',
      distanceKm: 3.7,
      lat: 9.0172,
      lng: 38.7478,
      availableSlots: 0,
      totalSlots: 4,
      queue: [
        { id: 'q1', vehicleId: 'EV-118', plate: '1A 55201', status: 'charging', etaMin: 8 },
        { id: 'q2', vehicleId: 'EV-902', plate: '4B 99110', status: 'waiting', etaMin: 22 },
        { id: 'q3', vehicleId: 'EV-337', plate: '7D 21044', status: 'waiting', etaMin: 38 },
        { id: 'q4', vehicleId: 'EV-650', plate: '2E 88175', status: 'waiting', etaMin: 51 },
      ],
      openingHours: 'Open 24 hours',
      amenities: ['Restroom', 'Coffee'],
      pricePerKwh: 5.5,
      reservationFee: 40,
      maxPower: 60,
      chargers: [
        mkCharger('m1', 'Charger 01', 60, 'charging', 40, 5.5),
        mkCharger('m2', 'Charger 02', 60, 'charging', 40, 5.5),
        mkCharger('m3', 'Charger 03', 60, 'available', 40, 5.5),
        mkCharger('m4', 'Charger 04', 60, 'offline', 40, 5.5),
      ],
    },
    {
      id: 'st3',
      name: 'Kazanchis Charging Hub',
      operator: 'Demo Operator — Kazanchis',
      area: 'Kazanchis',
      address: 'Kazanchis, UNECA area, Addis Ababa',
      distanceKm: 5.2,
      lat: 9.0179,
      lng: 38.7752,
      availableSlots: 3,
      totalSlots: 6,
      queue: [
        { id: 'q1', vehicleId: 'EV-410', plate: '5C 66202', status: 'charging', etaMin: 20 },
        { id: 'q2', vehicleId: 'EV-711', plate: '3A 11056', status: 'waiting', etaMin: 35 },
      ],
      openingHours: '06:00 – 22:00',
      amenities: ['Cafe', 'WiFi', 'Restroom'],
      pricePerKwh: 6.5,
      reservationFee: 60,
      maxPower: 150,
      chargers: [
        mkCharger('k1', 'Charger 01', 150, 'charging', 60, 6.5),
        mkCharger('k2', 'Charger 02', 150, 'available', 60, 6.5),
        mkCharger('k3', 'Charger 03', 150, 'available', 60, 6.5),
        mkCharger('k4', 'Charger 04', 120, 'reserved', 60, 6.5),
        mkCharger('k5', 'Charger 05', 120, 'available', 60, 6.5),
        mkCharger('k6', 'Charger 06', 120, 'available', 60, 6.5),
      ],
    },
    {
      id: 'st4',
      name: 'Megenagna ChargePoint',
      operator: 'Demo Operator — Megenagna',
      area: 'Megenagna',
      address: 'Megenagna, Addis Ababa',
      distanceKm: 6.8,
      lat: 9.03,
      lng: 38.7951,
      availableSlots: 1,
      totalSlots: 4,
      queue: [
        { id: 'q1', vehicleId: 'EV-220', plate: '6B 44510', status: 'waiting', etaMin: 18 },
        { id: 'q2', vehicleId: 'EV-863', plate: '9F 32011', status: 'waiting', etaMin: 33 },
      ],
      openingHours: '07:00 – 21:00',
      amenities: ['Restroom', 'Security'],
      pricePerKwh: 5,
      reservationFee: 30,
      maxPower: 60,
      chargers: [
        mkCharger('g1', 'Charger 01', 60, 'available', 30, 5),
        mkCharger('g2', 'Charger 02', 60, 'reserved', 30, 5),
        mkCharger('g3', 'Charger 03', 60, 'offline', 30, 5),
        mkCharger('g4', 'Charger 04', 60, 'offline', 30, 5),
      ],
    },
    {
      id: 'st5',
      name: 'Piassa City Charger',
      operator: 'Demo Operator — Piassa',
      area: 'Piassa',
      address: 'Piassa, Addis Ababa',
      distanceKm: 8.4,
      lat: 9.0459,
      lng: 38.7517,
      availableSlots: 0,
      totalSlots: 2,
      queue: [{ id: 'q1', vehicleId: 'EV-541', plate: '7C 20901', status: 'waiting', etaMin: 14 }],
      openingHours: '08:00 – 20:00',
      amenities: ['Coffee'],
      pricePerKwh: 5.5,
      reservationFee: 35,
      maxPower: 50,
      chargers: [
        mkCharger('p1', 'Charger 01', 50, 'charging', 35, 5.5),
        mkCharger('p2', 'Charger 02', 50, 'offline', 35, 5.5),
      ],
    },
    {
      id: 'st6',
      name: 'Saris Green Energy',
      operator: 'Demo Operator — Saris',
      area: 'Saris',
      address: 'Saris Addis Sefer, Addis Ababa',
      distanceKm: 9.1,
      lat: 9.0055,
      lng: 38.7203,
      availableSlots: 4,
      totalSlots: 6,
      queue: [],
      openingHours: '06:30 – 22:30',
      amenities: ['Cafe', 'WiFi', 'Restroom', 'Car wash'],
      pricePerKwh: 6,
      reservationFee: 50,
      maxPower: 150,
      chargers: [
        mkCharger('s1', 'Charger 01', 150, 'available', 50, 6),
        mkCharger('s2', 'Charger 02', 150, 'available', 50, 6),
        mkCharger('s3', 'Charger 03', 120, 'available', 50, 6),
        mkCharger('s4', 'Charger 04', 120, 'available', 50, 6),
      ],
    },
  ];
}

// ----- Time slots -----
export function timeSlots(): TimeSlot[] {
  return [
    { time: '14:00', status: 'available' },
    { time: '14:30', status: 'available' },
    { time: '15:00', status: 'limited' },
    { time: '15:30', status: 'full' },
    { time: '16:00', status: 'available' },
    { time: '16:30', status: 'available' },
    { time: '17:00', status: 'limited' },
    { time: '17:30', status: 'full' },
  ];
}

export const qrText = 'CS-DEMO-1048|BLE-FAST|2026-08-08|15:00-15:30';

// ----- Session history -----
export function defaultHistory(): SessionRecord[] {
  return [
    { id: 'h1', date: 'Aug 8', dateLabel: '2026-08-08', station: 'Bole Fast Charge', area: 'Bole', kWh: 32.5, cost: 185, durationMin: 34, startBattery: 18, endBattery: 88 },
    { id: 'h2', date: 'Aug 6', dateLabel: '2026-08-06', station: 'Mexico EV Hub', area: 'Mexico', kWh: 27.8, cost: 160, durationMin: 42, startBattery: 22, endBattery: 82 },
    { id: 'h3', date: 'Aug 4', dateLabel: '2026-08-04', station: 'Kazanchis Hub', area: 'Kazanchis', kWh: 41.2, cost: 230, durationMin: 38, startBattery: 12, endBattery: 90 },
  ];
}

export function defaultNotifications(): Notification[] {
  return [
    { id: 'n1', title: 'Payment successful', body: 'Your 50 ETB reservation fee was processed.', time: '2 min ago', read: false, icon: 'success' },
    { id: 'n2', title: 'Reservation confirmed', body: 'Bole Fast Charge · 15:00 – 15:30 · #CS-1048', time: '2 min ago', read: false, icon: 'success' },
    { id: 'n3', title: 'Queue position updated', body: 'Your queue position changed from #4 → #3.', time: '12 min ago', read: true, icon: 'info' },
    { id: 'n4', title: 'Slot starts in 20 min', body: 'Bole Fast Charge · 120 kW charger #3.', time: '40 min ago', read: true, icon: 'charging' },
  ];
}
