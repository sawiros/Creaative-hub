import React from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
import { Station } from '../types';

// Stylized CSS map placeholder. No external map API.
export function MapView({ stations, onSelect, selectedId }: { stations: Station[]; onSelect?: (id: string) => void; selectedId?: string | null }) {
  const pad = 60;
  const minX = Math.min(...stations.map((s) => s.lng));
  const maxX = Math.max(...stations.map((s) => s.lng));
  const minY = Math.min(...stations.map((s) => s.lat));
  const maxY = Math.max(...stations.map((s) => s.lat));
  const spanX = maxX - minX || 0.05;
  const spanY = maxY - minY || 0.05;

  return (
    <div className="relative w-full overflow-hidden rounded-xl2 border border-border bg-surface" style={{ aspectRatio: '16/9', minHeight: 180 }}>
      {/* map grid / blocks */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(#1a1f23 1px, transparent 1px), linear-gradient(90deg, #1a1f23 1px, transparent 1px), linear-gradient(#161a1e 1px, transparent 1px), linear-gradient(90deg, #161a1e 1px, transparent 1px)',
          backgroundSize: '120px 120px, 120px 120px, 30px 30px, 30px 30px',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(200,255,61,0.04), transparent 45%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 70%, rgba(108,203,255,0.05), transparent 40%)' }} />

      {/* road lines */}
      <div className="absolute left-0 right-0 top-[40%] h-2 bg-[#22272B]/80 -skew-y-2" />
      <div className="absolute left-0 right-0 top-[72%] h-1.5 bg-[#22272B]/70 skew-y-1" />
      <div className="absolute top-0 bottom-0 left-[55%] w-2 bg-[#22272B]/80 skew-x-2" />

      {/* markers */}
      {stations.map((s) => {
        const left = pad + ((s.lng - minX) / spanX) * (100 - pad * 2);
        const top = pad + ((maxY - s.lat) / spanY) * (100 - pad * 2);
        const active = s.id === selectedId;
        const color = s.availableSlots > 0 ? '#C8FF3D' : '#F2C94C';
        return (
          <button
            key={s.id}
            onClick={() => onSelect?.(s.id)}
            className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-full group"
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-label={s.name}
          >
            <span
              className={active ? 'absolute -inset-2 rounded-full anim-pulse' : 'hidden'}
              style={{ background: color + '22' }}
            />
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card shadow-lg transition-transform group-hover:scale-110"
              style={{ borderColor: color, color }}
            >
              <MapPin size={16} />
            </span>
            <span className="px-1.5 py-0.5 rounded bg-bg/90 border border-border text-[10px] font-medium whitespace-nowrap" style={{ color }}>
              {s.name.split(' ')[0]}
            </span>
          </button>
        );
      })}

      {/* user location */}
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-txt-sec" title="Your location">
        <LocateFixed size={15} />
      </span>
      <span className="absolute left-3 bottom-3 text-[10px] text-txt-mut bg-bg/80 px-2 py-1 rounded-md border border-border">Addis Ababa · demo map</span>
    </div>
  );
}
