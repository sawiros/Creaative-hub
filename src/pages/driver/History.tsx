import React from 'react';
import { History as HistIcon, Zap, Timer, MapPin } from 'lucide-react';
import { useApp } from '../../store';
import { Button } from '../../components/ui';

export function HistoryPage() {
  const { history, nav } = useApp();
  if (history.length === 0) {
    return (
      <div className="max-w-lg mx-auto card p-10 text-center space-y-4 anim-fade">
        <HistIcon size={40} className="mx-auto text-txt-mut" />
        <div>
          <p className="font-display text-xl font-bold">No charging history</p>
          <p className="text-sm text-txt-mut mt-1">Your past sessions will appear here.</p>
        </div>
        <Button onClick={() => nav('find')}>Find a charger</Button>
      </div>
    );
  }
  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">History</h1>
        <p className="text-txt-sec text-sm mt-1">{history.length} sessions</p>
      </div>
      <div className="space-y-3">
        {history.map((h) => (
          <div key={h.id} className="card p-5 flex items-center gap-4 anim-fade">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary shrink-0">
              <Zap size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold truncate">{h.station}</h3>
              </div>
              <p className="text-xs text-txt-mut mt-0.5 inline-flex items-center gap-2"><MapPin size={12} /> {h.area} · {h.date}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-txt-sec mt-1.5">
                <span className="inline-flex items-center gap-1"><Zap size={13} className="text-primary" /> {h.kWh} kWh</span>
                <span className="inline-flex items-center gap-1"><Timer size={13} /> {h.durationMin} min</span>
                <span>{h.startBattery}% → {h.endBattery}%</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-lg font-bold">{h.cost} <span className="text-xs text-txt-sec">ETB</span></p>
              <p className="text-xs text-primary">Completed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
