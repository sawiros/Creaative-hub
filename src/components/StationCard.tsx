import React from 'react';
import { MapPin, Zap, Clock, Users, ChevronRight } from 'lucide-react';
import { Station } from '../types';
import { Badge, Button, StatusDot, cx } from './ui';

function stationStatus(s: Station) {
  if (s.availableSlots > 0) return { label: `${s.availableSlots} slots available`, color: '#C8FF3D', busy: false };
  if (s.queue.length > 0) return { label: 'Busy', color: '#F2C94C', busy: true };
  return { label: 'Offline', color: '#FF6B6B', busy: false };
}

export function StationCard({ station, onOpen }: { station: Station; onOpen: (id: string) => void }) {
  const st = stationStatus(station);
  return (
    <button
      onClick={() => onOpen(station.id)}
      className={cx('card p-5 text-left w-full hover:border-[#2d3338] hover:shadow-lg transition-all group')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-[17px] font-semibold truncate">{station.name}</h4>
            {station.recommended && <Badge>Recommended</Badge>}
          </div>
          <p className="text-sm text-txt-sec mt-0.5">{station.maxPower} kW DC Fast Charger</p>
        </div>
        <ChevronRight size={18} className="text-txt-mut group-hover:text-primary transition-colors mt-1 shrink-0" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-txt-mut">
        <span className="inline-flex items-center gap-1"><MapPin size={13} /> {station.distanceKm.toFixed(1)} km</span>
        <span className="inline-flex items-center gap-1"><Zap size={13} /> {station.pricePerKwh} ETB/kWh</span>
        <span className="inline-flex items-center gap-1"><Clock size={13} /> Fee {station.reservationFee} ETB</span>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: st.color }}>
          <StatusDot color={st.color} pulse={st.busy} />
          {st.label}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {station.queue.length > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-txt-sec">
            <Users size={14} />
            {station.queue.length} in queue · ~{Math.max(12, station.queue.length * 14)} min wait
          </span>
        ) : (
          <span className="text-xs text-primary inline-flex items-center gap-1.5">
            <StatusDot color="#C8FF3D" pulse />
            Next available: Now
          </span>
        )}
        <Button size="sm" onClick={(e) => { e.stopPropagation(); onOpen(station.id); }}>
          {station.availableSlots > 0 ? 'Reserve' : 'Join Queue'}
        </Button>
      </div>
    </button>
  );
}
