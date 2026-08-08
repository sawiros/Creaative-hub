import React from 'react';
import { ArrowLeft, MapPin, Clock, Zap, Users, Wifi, Coffee, ShieldCheck, Bath, Sparkles, Car } from 'lucide-react';
import { useApp } from '../../store';
import { Button, StatusDot, Badge } from '../../components/ui';
import { MapView } from '../../components/MapView';

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={14} />,
  'Coffee lounge': <Coffee size={14} />,
  Restroom: <Bath size={14} />,
  '24/7 Security': <ShieldCheck size={14} />,
  Cafe: <Coffee size={14} />,
  Coffee: <Coffee size={14} />,
  'Car wash': <Sparkles size={14} />,
};

export function StationDetail() {
  const { stations, stationId, nav, openStation } = useApp();
  const station = stations.find((s) => s.id === stationId);
  if (!station) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-lg font-semibold">Station not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => nav('find')}>Back to find</Button>
      </div>
    );
  }
  const available = station.chargers.filter((c) => c.status === 'available').length;
  const waitMin = Math.max(10, station.queue.length * 13);

  return (
    <div className="space-y-6 anim-fade">
      <button onClick={() => nav('find')} className="inline-flex items-center gap-1.5 text-sm text-txt-sec hover:text-txt">
        <ArrowLeft size={16} /> Back to chargers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold">{station.name}</h1>
              {station.recommended && <Badge>Recommended</Badge>}
            </div>
            <p className="text-txt-sec text-sm mt-1">{station.operator}</p>
            <p className="text-sm text-txt-mut mt-0.5 inline-flex items-center gap-1"><MapPin size={13} /> {station.address} · {station.distanceKm.toFixed(1)} km away</p>
          </div>

          <MapView stations={[station]} selectedId={station.id} />

          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card p-4">
              <p className="text-xs text-txt-mut">Available</p>
              <p className="font-display text-xl font-bold text-primary">{available} / {station.totalSlots}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-txt-mut">Queue</p>
              <p className="font-display text-xl font-bold">{station.queue.length} vehicles</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-txt-mut">Est. wait</p>
              <p className="font-display text-xl font-bold text-[#F2C94C]">{waitMin} min</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-txt-mut">Reservation fee</p>
              <p className="font-display text-xl font-bold">{station.reservationFee} ETB</p>
            </div>
          </div>

          {/* chargers */}
          <div>
            <h3 className="font-display text-[15px] font-semibold mb-3">Chargers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {station.chargers.map((c) => (
                <div key={c.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2"><Zap size={14} className="text-primary" />{c.name}</p>
                    <p className="text-xs text-txt-mut mt-0.5">{c.power} kW · {c.type} · {c.connector}</p>
                    <p className="text-xs text-txt-mut">{c.pricePerKwh} ETB/kWh</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: c.status === 'available' ? '#C8FF3D' : c.status === 'charging' ? '#6CCBFF' : c.status === 'reserved' ? '#F2C94C' : '#687177' }}>
                    <StatusDot color={c.status === 'available' ? '#C8FF3D' : c.status === 'charging' ? '#6CCBFF' : c.status === 'reserved' ? '#F2C94C' : '#687177'} pulse={c.status === 'charging'} />
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-xs text-txt-mut mb-2">Opening hours</p>
            <p className="text-sm font-medium inline-flex items-center gap-2"><Clock size={15} className="text-primary" /> {station.openingHours}</p>
            <div className="h-px bg-border my-4" />
            <p className="text-xs text-txt-mut mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {station.amenities.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-txt-sec">
                  {amenityIcons[a] || <ShieldCheck size={14} />} {a}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-xs text-txt-mut mb-2">Pricing</p>
            <div className="flex justify-between text-sm mb-1"><span className="text-txt-sec">Energy</span><span className="font-medium">{station.pricePerKwh} ETB/kWh</span></div>
            <div className="flex justify-between text-sm"><span className="text-txt-sec">Reservation fee</span><span className="font-medium">{station.reservationFee} ETB</span></div>
            <div className="h-px bg-border my-3" />
            <p className="text-xs text-txt-mut mb-2 inline-flex items-center gap-1.5"><Users size={13} /> Live queue</p>
            {station.queue.length > 0 ? (
              <div className="space-y-1.5 mb-3">
                {station.queue.map((q, i) => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    <span className={i === 0 ? 'text-[#6CCBFF]' : 'text-txt-mut'}>{i + 1}.</span>
                    <span className="text-txt-sec">{q.vehicleId}</span>
                    <span className="ml-auto text-xs text-txt-mut">{q.etaMin ? `~${q.etaMin} min` : q.reservedAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-primary mb-3">No queue right now.</p>
            )}
            <Button full size="lg" onClick={() => nav('reserve')}>
              <Zap size={16} /> Reserve a Slot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
