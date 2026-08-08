import React from 'react';
import { Car, BatteryCharging, Zap, MapPin, ArrowRight, CalendarClock, ListOrdered, Sparkles } from 'lucide-react';
import { useApp } from '../../store';
import { useAuth } from '../../lib/auth';
import { Button, ProgressRing, StatusDot, Badge } from '../../components/ui';
import { StationCard } from '../../components/StationCard';

export function Dashboard() {
  const { stations, reservations, dispatch, nav, openStation, battery, queueJoined, queuePosition } = useApp();
  const { profile, user } = useAuth();
  const vehicle = profile?.vehicle || 'BYD Dolphin';
  const displayBattery = profile?.battery ?? battery;
  const upcoming = reservations.find((r) => r.status === 'confirmed' || r.status === 'queued');
  const nearby = [...stations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 anim-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-txt-sec">{greet}.</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Find your charging slot.<br />Reserve before you arrive.
          </h1>
          <p className="text-txt-sec mt-2 max-w-md">Find available fast chargers, reserve your time, and skip the physical queue.</p>
        </div>
        <Button size="lg" onClick={() => nav('find')}>
          <Zap size={18} /> Find a charger
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EV card */}
        <div className="card p-5 flex items-center gap-4">
          <ProgressRing value={displayBattery} size={92} label={`${displayBattery}%`} sub="battery" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-txt-mut">Your EV</p>
            <p className="font-display text-lg font-semibold flex items-center gap-2"><Car size={16} className="text-primary" />{vehicle}</p>
            <p className="text-xs text-txt-sec mt-0.5">Electric Vehicle</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-txt-mut">
              <StatusDot color={displayBattery < 30 ? '#FF6B6B' : displayBattery < 60 ? '#F2C94C' : '#C8FF3D'} pulse={displayBattery < 30} />
              {displayBattery < 30 ? 'Low — needs charging' : displayBattery < 60 ? 'Moderate range' : 'Good range'}
            </div>
          </div>
        </div>

        {/* Upcoming reservation */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-txt-mut flex items-center gap-1.5"><CalendarClock size={14} /> Upcoming reservation</p>
            {upcoming && <Badge color="#C8FF3D">{upcoming.status === 'queued' ? 'Queued' : 'Confirmed'}</Badge>}
          </div>
          {upcoming ? (
            <div className="mt-3">
              <p className="font-display text-lg font-semibold">{upcoming.stationName}</p>
              <p className="text-sm text-txt-sec">{upcoming.time}</p>
              <p className="text-sm text-txt-mut">{upcoming.power} kW · Fee {upcoming.fee} ETB</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => nav(upcoming.status === 'queued' ? 'queue' : 'reservations')}>
                View details <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <div className="mt-3 text-sm text-txt-mut">
              No upcoming reservation yet.
              <Button size="sm" variant="dark" className="mt-3" onClick={() => nav('find')}>Book a slot</Button>
            </div>
          )}
        </div>

        {/* Queue status */}
        <div className="card p-5">
          <p className="text-xs text-txt-mut flex items-center gap-1.5"><ListOrdered size={14} /> Current queue</p>
          {queueJoined ? (
            <div className="mt-3 flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-primary">#{queuePosition}</span>
              <div>
                <p className="text-sm font-medium">Bole Fast Charge</p>
                <p className="text-xs text-txt-mut">~{Math.max(10, queuePosition * 12)} min wait</p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto" onClick={() => nav('queue')}>Track</Button>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-txt-mut">Not in a queue.</p>
              <p className="text-xs text-txt-mut mt-1">Join the smart queue when a station is busy.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Zap size={18} />, label: 'Find charger', onClick: () => nav('find') },
          { icon: <CalendarClock size={18} />, label: 'Reservations', onClick: () => nav('reservations') },
          { icon: <ListOrdered size={18} />, label: 'Queue', onClick: () => nav('queue') },
          { icon: <BatteryCharging size={18} />, label: 'Charging', onClick: () => nav('charging') },
        ].map((a, i) => (
          <button key={i} onClick={a.onClick} className="card p-4 flex items-center gap-3 hover:border-[#2d3338] transition-colors text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary shrink-0">{a.icon}</span>
            <span className="font-medium text-sm">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Nearby */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-[15px] font-semibold flex items-center gap-2"><MapPin size={16} className="text-primary" /> Nearby charging stations</h3>
          <button onClick={() => nav('find')} className="text-sm text-primary inline-flex items-center gap-1">View all <ArrowRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {nearby.map((s) => <StationCard key={s.id} station={s} onOpen={openStation} />)}
        </div>
      </div>
    </div>
  );
}
