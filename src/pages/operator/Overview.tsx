import React from 'react';
import { Zap, Users, CalendarClock, Banknote, PlugZap, AlertTriangle } from 'lucide-react';
import { useApp } from '../../store';
import { Stat, StatusDot, Badge } from '../../components/ui';

const chgColor = (s: string) => (s === 'charging' ? '#6CCBFF' : s === 'available' ? '#C8FF3D' : s === 'reserved' ? '#F2C94C' : '#687177');

export function OperatorOverview() {
  const { stations } = useApp();
  const allChargers = stations.flatMap((s) => s.chargers);
  const charging = allChargers.filter((c) => c.status === 'charging');
  const available = allChargers.filter((c) => c.status === 'available');
  const waiting = allChargers.filter((c) => c.status === 'reserved').length + 8;

  return (
    <div className="space-y-6 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Operator Overview</h1>
        <p className="text-txt-sec text-sm mt-1">Live network status · Bole Demo Network</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Active sessions" value={String(7)} icon={<Zap size={16} />} sub="+2 vs yesterday" accent="#6CCBFF" />
        <Stat label="Waiting vehicles" value={String(12)} icon={<Users size={16} />} sub="Across 3 stations" accent="#F2C94C" />
        <Stat label="Today's reservations" value={String(34)} icon={<CalendarClock size={16} />} sub="+18% this week" />
        <Stat label="Today's revenue" value="4,850" icon={<Banknote size={16} />} sub="ETB · incl. fees" />
      </div>

      <div>
        <h3 className="font-display text-[15px] font-semibold mb-3 flex items-center gap-2"><PlugZap size={16} className="text-primary" /> Charger status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {allChargers.slice(0, 8).map((c, i) => {
            const col = chgColor(c.status);
            const station = stations.find((s) => s.chargers.some((x) => x.id === c.id));
            return (
              <div key={c.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{c.name}</p>
                  <Badge color={col}><StatusDot color={col} pulse={c.status === 'charging'} /> {c.status}</Badge>
                </div>
                <div className="mt-3 text-sm">
                  {c.status === 'charging' && (
                    <div>
                      <p className="text-txt-sec">Vehicle {['EV-102', 'EV-221', 'EV-118'][i % 3]} · {[78, 42, 55][i % 3]}%</p>
                      <div className="h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${[78, 42, 55][i % 3]}%`, background: '#6CCBFF' }} />
                      </div>
                      <p className="text-xs text-txt-mut mt-1">{18 - i} min remaining</p>
                    </div>
                  )}
                  {c.status === 'available' && <p className="text-txt-sec">{c.power} kW · ready to charge</p>}
                  {c.status === 'reserved' && <p className="text-txt-sec">15:00 · EV-304</p>}
                  {c.status === 'offline' && <p className="text-txt-mut flex items-center gap-1.5"><AlertTriangle size={13} className="text-[#FF6B6B]" /> Maintenance</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="font-display text-sm font-semibold mb-3">Live queue — Bole Fast Charge</p>
          {stations.find((s) => s.recommended)?.queue.slice(0, 4).map((q, i) => (
            <div key={q.id} className="flex items-center justify-between py-2 text-sm border-b border-border last:border-0">
              <span className="flex items-center gap-2">
                <span className="font-display text-txt-mut w-6">{i + 1}.</span>
                <span className="text-txt-sec">{q.vehicleId}</span>
              </span>
              <span className="text-xs text-txt-mut">{q.etaMin ? `~${q.etaMin} min` : q.reservedAt}</span>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <p className="font-display text-sm font-semibold mb-3">Network utilization</p>
          <div className="space-y-3">
            <Bar label="Bole Fast Charge" value={72} />
            <Bar label="Mexico EV Hub" value={85} />
            <Bar label="Kazanchis Hub" value={48} />
            <Bar label="Megenagna" value={33} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-txt-mut mb-1"><span>{label}</span><span>{value}%</span></div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full anim-grow transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
