import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CalendarPlus, Zap, Car, Clock } from 'lucide-react';
import { useApp } from '../../store';
import { Button, cx, Badge } from '../../components/ui';
import { TelebirrPay } from '../../components/TelebirrPay';
import { Qr } from '../../components/Qr';
import { timeSlots } from '../../data/mock';

export function Reserve() {
  const { stations, stationId, dispatch, nav, toast, slots } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chargerIdx, setChargerIdx] = useState(0);
  const [slot, setSlot] = useState<string>('');
  const [payOpen, setPayOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [ref, setRef] = useState('');

  const station = stations.find((s) => s.id === stationId) || stations.find((s) => s.recommended) || stations[0];
  const availableChargers = station.chargers.filter((c) => c.status === 'available' || c.status === 'reserved');
  const charger = availableChargers[Math.min(chargerIdx, availableChargers.length - 1)];
  const fee = station.reservationFee;

  useEffect(() => {
    if (!stationId) nav('find');
  }, []);

  const handlePaid = (txn: string) => {
    const r = 'CS-' + Math.floor(1040 + Math.random() * 80);
    const endMin = (parseInt(slot.split(':')[0]) * 60 + parseInt(slot.split(':')[1])) + 30;
    const endTime = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
    setRef(r);
    setConfirmed(true);
    dispatch({
      type: 'ADD_RESERVATION',
      r: {
        id: 'r' + Date.now(),
        ref: r,
        stationId: station.id,
        stationName: station.name,
        area: station.area,
        chargerName: charger.name,
        power: charger.power,
        time: `${slot} – ${endTime}`,
        fee,
        status: 'confirmed',
        qr: `CS|${station.name}|${r}|${slot}`,
        txn,
        dateLabel: 'Aug 8',
      },
    });
    dispatch({ type: 'ADD_NOTIF', n: { title: 'Reservation confirmed', body: `${station.name} · ${slot} · ${r}`, icon: 'success' } });
    toast('Reservation confirmed', `${station.name} · ${slot}`, 'success');
  };

  const joinQueue = () => {
    dispatch({ type: 'JOIN_QUEUE', position: station.queue.length + 1 });
    dispatch({ type: 'ADD_NOTIF', n: { title: 'Joined queue', body: `You are #${station.queue.length + 1} at ${station.name}`, icon: 'info' } });
    toast('Joined queue', `You are #${station.queue.length + 1} at ${station.name}`, 'info');
    nav('queue');
  };

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto anim-pop space-y-6">
        <div className="card p-8 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary mb-4">
            <Check size={36} />
          </span>
          <h1 className="font-display text-3xl font-bold">Reservation confirmed</h1>
          <p className="text-txt-sec mt-2">{station.name} · {areaLabel(station.area)}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-left">
            <Detail label="Charger" value={`${charger.power} kW DC Fast`} />
            <Detail label="Time" value={slot} />
            <Detail label="Reservation" value={ref} />
            <Detail label="Fee" value={`${fee} ETB paid`} />
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-xl bg-white p-4 inline-block">
              <Qr text={`${station.name}|${ref}|${slot}`} size={168} />
            </div>
            <p className="text-xs text-txt-mut mt-3">Scan at the charging station to start your session.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button onClick={() => nav('reservations')}>View Reservation</Button>
            <Button variant="outline" onClick={() => toast('Added to calendar', `${station.name} · ${slot}`, 'success')}><CalendarPlus size={16} /> Add to Calendar</Button>
            <Button variant="dark" onClick={() => nav('dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
        <div className="card p-4">
          <p className="text-xs text-txt-mut mb-2 flex items-center gap-1.5"><Zap size={13} className="text-primary" /> Station is busy? Join the smart queue.</p>
          <Button full variant="outline" onClick={joinQueue}>Join Queue at {station.name}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto anim-fade space-y-6">
      <button onClick={() => (step === 1 ? nav('station') : setStep((step - 1) as 1 | 2))} className="inline-flex items-center gap-1.5 text-sm text-txt-sec hover:text-txt">
        <ArrowLeft size={16} /> Back
      </button>

      {/* stepper */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <span className={cx('h-2.5 w-2.5 rounded-full', s <= step ? 'bg-primary' : 'bg-border')} />
            {s < 3 && <span className={cx('h-px flex-1', s < step ? 'bg-primary' : 'bg-border')} />}
          </React.Fragment>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold">{station.name}</h2>
            <p className="text-xs text-txt-mut">{station.area} · {station.distanceKm.toFixed(1)} km</p>
          </div>
          <Badge>{step === 1 ? 'Charger' : step === 2 ? 'Time' : 'Summary'}</Badge>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-xs text-txt-mut">Select a charger</p>
            {availableChargers.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setChargerIdx(i)}
                className={cx('w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors', i === chargerIdx ? 'bg-primary/8 border-primary/50' : 'bg-surface border-border hover:border-[#2d3338]')}
              >
                <span className={cx('flex h-11 w-11 items-center justify-center rounded-lg', i === chargerIdx ? 'bg-primary text-primary-ink' : 'bg-card text-txt-sec')}>
                  <Zap size={20} />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.name} · {c.power} kW</p>
                  <p className="text-xs text-txt-mut">{c.type} · {c.connector} · {c.pricePerKwh} ETB/kWh</p>
                </div>
                <span className="text-xs font-medium" style={{ color: c.status === 'available' ? '#C8FF3D' : '#F2C94C' }}>{c.status}</span>
              </button>
            ))}
            <Button full size="lg" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-txt-mut">Select a time slot · {charger.name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const disabled = s.status === 'full';
                return (
                  <button
                    key={s.time}
                    disabled={disabled}
                    onClick={() => setSlot(s.time)}
                    className={cx(
                      'p-3 rounded-lg border text-center transition-all',
                      slot === s.time ? 'bg-primary text-primary-ink border-primary' : 'bg-surface border-border',
                      disabled ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#2d3338]',
                      s.status === 'limited' && !disabled && !(slot === s.time) && 'border-[#F2C94C]/40'
                    )}
                  >
                    <p className="font-display font-bold text-lg">{s.time}</p>
                    <p className={cx('text-[10px] uppercase tracking-wide mt-0.5', slot === s.time ? 'text-primary-ink/70' : s.status === 'limited' ? 'text-[#F2C94C]' : 'text-txt-mut')}>
                      {s.status}
                    </p>
                  </button>
                );
              })}
            </div>
            <Button full size="lg" onClick={() => setStep(3)} disabled={!slot}>Continue <ArrowRight size={16} /></Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-3">
              {[
                { l: 'Station', v: station.name },
                { l: 'Charger', v: `${charger.power} kW DC Fast · ${charger.connector}` },
                { l: 'Time', v: slot },
                { l: 'Reservation fee', v: `${fee} ETB` },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-sm py-1.5">
                  <span className="text-txt-mut">{r.l}</span>
                  <span className="font-medium text-right">{r.v}</span>
                </div>
              ))}
              <div className="h-px bg-border" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="font-display">{fee} ETB</span>
              </div>
            </div>
            <Button full size="lg" onClick={() => setPayOpen(true)}>
              <Car size={16} /> Reserve & Pay with Telebirr
            </Button>
            <p className="text-[11px] text-center text-txt-mut flex items-center justify-center gap-1.5"><Clock size={12} /> Reservation holds your slot for 15 minutes.</p>
          </div>
        )}
      </div>

      <TelebirrPay open={payOpen} onClose={() => setPayOpen(false)} amount={fee} onSuccess={handlePaid} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface border border-border p-3">
      <p className="text-[11px] text-txt-mut">{label}</p>
      <p className="font-medium text-sm mt-0.5">{value}</p>
    </div>
  );
}
function areaLabel(a: string) { return a; }
