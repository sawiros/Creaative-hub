import React, { useState } from 'react';
import { Zap, Battery, Gauge, Timer, Square, MapPin, TrendingUp } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Modal, ProgressRing } from '../../components/ui';

export function Charging() {
  const { charging, dispatch, nav, toast } = useApp();
  const [endOpen, setEndOpen] = useState(false);

  if (!charging) {
    return (
      <div className="max-w-lg mx-auto card p-10 text-center space-y-4 anim-fade">
        <Battery size={40} className="mx-auto text-txt-mut" />
        <div>
          <p className="font-display text-xl font-bold">No active session</p>
          <p className="text-sm text-txt-mut mt-1">Start a charging session at your reserved slot to see live stats here.</p>
        </div>
        <Button onClick={() => nav('reservations')}>View reservations</Button>
      </div>
    );
  }

  const pct = Math.round(((charging.batteryNow - charging.batteryStart) / (charging.batteryTarget - charging.batteryStart)) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 anim-fade">
      <div className="card p-6 text-center">
        <p className="text-xs text-txt-mut uppercase tracking-wider flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6CCBFF] anim-pulse" /> Charging now
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{charging.stationName}</h1>
        <p className="text-txt-sec text-sm mt-1 inline-flex items-center gap-1.5"><MapPin size={13} /> {charging.power} kW DC Fast</p>

        <div className="flex justify-center mt-6">
          <ProgressRing
            value={((charging.batteryNow - charging.batteryStart) / (charging.batteryTarget - charging.batteryStart)) * 100}
            size={170}
            stroke={12}
            label={`${charging.batteryNow}%`}
            sub="battery"
          />
        </div>
        <p className="text-sm text-txt-sec mt-2">{charging.batteryStart}% → {charging.batteryTarget}% · target</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric icon={<Gauge size={16} />} label="Power" value={`${charging.power} kW`} />
        <Metric icon={<Zap size={16} />} label="Energy delivered" value={`${charging.energyDelivered} kWh`} />
        <Metric icon={<Timer size={16} />} label="Time elapsed" value={`${charging.timeElapsedMin} min`} />
        <Metric icon={<TrendingUp size={16} />} label="Est. remaining" value={`${charging.estRemainingMin} min`} />
      </div>

      {/* session progress bar */}
      <div className="card p-5">
        <div className="flex justify-between text-xs text-txt-mut mb-2"><span>Session progress</span><span>{pct}%</span></div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-[#6CCBFF] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-txt-mut mt-3">Charging at a controlled rate to protect your battery. Estimated cost {Math.round(charging.energyDelivered * 6)} ETB so far.</p>
      </div>

      <Button full size="lg" variant="danger" onClick={() => setEndOpen(true)}>
        <Square size={16} /> End Charging Session
      </Button>

      <Modal open={endOpen} onClose={() => setEndOpen(false)} title="End charging session?">
        <p className="text-sm text-txt-sec">You'll stop charging at {charging.batteryNow}%. The session will be recorded to your history.</p>
        <div className="flex gap-3 mt-5">
          <Button variant="outline" full onClick={() => setEndOpen(false)}>Continue charging</Button>
          <Button variant="danger" full onClick={() => {
            dispatch({ type: 'END_CHARGING' });
            dispatch({ type: 'COMPLETE_SESSION', rec: {
              id: 'h' + Date.now(), date: 'Aug 8', dateLabel: '2026-08-08', station: charging.stationName || 'Bole Fast Charge', area: 'Bole',
              kWh: charging.energyDelivered, cost: Math.round(charging.energyDelivered * 6), durationMin: charging.timeElapsedMin,
              startBattery: charging.batteryStart, endBattery: charging.batteryNow,
            }});
            dispatch({ type: 'ADD_NOTIF', n: { title: 'Session ended', body: 'Charging session recorded to history.', icon: 'info' } });
            toast('Session ended', 'Added to your history.', 'info');
            setEndOpen(false);
          }}>End Session</Button>
        </div>
      </Modal>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4">
      <span className="text-primary">{icon}</span>
      <p className="text-xs text-txt-mut mt-2">{label}</p>
      <p className="font-display text-lg font-bold">{value}</p>
    </div>
  );
}
