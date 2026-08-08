import React, { useState } from 'react';
import { CalendarX, MapPin, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Badge, StatusDot, Modal } from '../../components/ui';
import { Qr } from '../../components/Qr';

const statusColor: Record<string, string> = { confirmed: '#C8FF3D', queued: '#F2C94C', active: '#6CCBFF', completed: '#687177', cancelled: '#FF6B6B' };

export function Reservations() {
  const { reservations, dispatch, nav, toast, openStation } = useApp();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const active = reservations.filter((r) => r.status !== 'cancelled');
  if (active.length === 0) {
    return (
      <div className="max-w-lg mx-auto card p-10 text-center space-y-4 anim-fade">
        <CalendarX size={40} className="mx-auto text-txt-mut" />
        <div>
          <p className="font-display text-xl font-bold">No reservations yet</p>
          <p className="text-sm text-txt-mut mt-1">Reserve a slot to skip the queue at your favorite station.</p>
        </div>
        <Button onClick={() => nav('find')}>Find a charger</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Reservations</h1>
        <p className="text-txt-sec text-sm mt-1">{active.length} upcoming / active</p>
      </div>

      <div className="space-y-4">
        {active.map((r) => {
          const st = r.status === 'queued' ? 'queued' : r.status === 'active' ? 'active' : 'confirmed';
          const col = statusColor[st];
          return (
            <div key={r.id} className="card p-5 anim-fade">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="rounded-xl bg-white p-2 inline-flex shrink-0 self-start">
                  <Qr text={r.qr} size={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-semibold">{r.stationName}</h3>
                    <Badge color={col}><StatusDot color={col} /> {r.status}</Badge>
                  </div>
                  <p className="text-sm text-txt-sec mt-1 inline-flex items-center gap-1.5"><MapPin size={13} /> {r.area} · <Zap size={13} className="text-primary" /> {r.power} kW</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-txt-mut mt-1.5">
                    <span>{r.time}</span>
                    <span>#{r.ref}</span>
                    <span>{r.fee} ETB</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {st === 'confirmed' && <Button size="sm" variant="outline" onClick={() => { dispatch({ type: 'JOIN_QUEUE', position: 3 }); dispatch({ type: 'NAV', route: 'queue' }); toast('Joined queue', 'You are #3 at ' + r.stationName, 'info'); }}>Join Queue</Button>}
                  <Button size="sm" variant="dark" onClick={() => openStation(r.stationId)}>Station <ArrowRight size={14} /></Button>
                  {st === 'confirmed' && (
                    <Button size="sm" variant="danger" onClick={() => setCancelId(r.id)}>Cancel</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancel reservation?">
        <p className="text-sm text-txt-sec">Your reservation and reservation fee will be released. This can't be undone.</p>
        <div className="flex gap-3 mt-5">
          <Button variant="outline" full onClick={() => setCancelId(null)}>Keep</Button>
          <Button
            variant="danger"
            full
            onClick={() => {
              if (cancelId) {
                dispatch({ type: 'CANCEL_RESERVATION', id: cancelId });
                toast('Reservation cancelled', 'Your slot has been released.', 'warning');
              }
              setCancelId(null);
            }}
          >
            Cancel Reservation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
