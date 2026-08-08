import React, { useState } from 'react';
import { CalendarRange, Play, XCircle, User } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Badge, StatusDot, Modal } from '../../components/ui';

export function OperatorReservations() {
  const { dispatch, toast } = useApp();
  const [rows, setRows] = useState([
    { id: '1', ref: 'CS-1048', vehicle: 'EV-102', station: 'Bole Fast Charge', time: '15:00', fee: 50, status: 'confirmed' },
    { id: '2', ref: 'CS-1047', vehicle: 'EV-221', station: 'Bole Fast Charge', time: '15:30', fee: 50, status: 'confirmed' },
    { id: '3', ref: 'CS-1046', vehicle: 'EV-118', station: 'Mexico EV Hub', time: '14:30', fee: 40, status: 'confirmed' },
    { id: '4', ref: 'CS-1045', vehicle: 'EV-902', station: 'Kazanchis Hub', time: '16:00', fee: 60, status: 'confirmed' },
    { id: '5', ref: 'CS-1044', vehicle: 'EV-337', station: 'Mexico EV Hub', time: '17:00', fee: 40, status: 'cancelled' },
  ]);
  const [view, setView] = useState<(typeof rows)[0] | null>(null);

  const setStatus = (id: string, status: string, label: string) => {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    toast(label, 'Reservation updated.', 'info');
  };

  const col = (s: string) => (s === 'confirmed' ? '#C8FF3D' : s === 'cancelled' ? '#FF6B6B' : '#687177');

  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2"><CalendarRange size={24} className="text-primary" /> Reservations</h1>
        <p className="text-txt-sec text-sm mt-1">{rows.filter((r) => r.status === 'confirmed').length} confirmed today</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs text-txt-mut border-b border-border">
              <th className="px-5 py-3 font-medium">Ref</th>
              <th className="px-5 py-3 font-medium">Vehicle</th>
              <th className="px-5 py-3 font-medium">Station</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Fee</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-5 py-3 font-mono text-xs">{r.ref}</td>
                <td className="px-5 py-3 text-txt-sec">{r.vehicle}</td>
                <td className="px-5 py-3">{r.station}</td>
                <td className="px-5 py-3">{r.time}</td>
                <td className="px-5 py-3">{r.fee} ETB</td>
                <td className="px-5 py-3">
                  <Badge color={col(r.status)}><StatusDot color={col(r.status)} /> {r.status}</Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setView(r)}><User size={13} /> View</Button>
                    {r.status === 'confirmed' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setStatus(r.id, 'confirmed', 'Checked in')}><Play size={13} /> Check in</Button>
                        <Button size="sm" variant="danger" onClick={() => setStatus(r.id, 'cancelled', 'Cancelled')}><XCircle size={13} /></Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title="Reservation details">
        {view && (
          <div className="space-y-3 text-sm">
            {[
              ['Reference', view.ref], ['Vehicle', view.vehicle], ['Station', view.station],
              ['Time', view.time], ['Fee', `${view.fee} ETB`], ['Payment', 'Telebirr · paid'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-2"><span className="text-txt-mut">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
