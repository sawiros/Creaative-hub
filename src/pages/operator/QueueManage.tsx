import React, { useState } from 'react';
import { ClipboardList, Play, Square, SkipForward, ArrowUp, ArrowDown, XCircle, User } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Badge, StatusDot, Modal, cx } from '../../components/ui';

type Row = { id: string; vehicle: string; status: 'charging' | 'waiting' | 'reserved' | 'completed' | 'skipped'; eta: string };
const initial: Row[] = [
  { id: '1', vehicle: 'EV-102', status: 'charging', eta: '12 min' },
  { id: '2', vehicle: 'EV-221', status: 'waiting', eta: '25 min' },
  { id: '3', vehicle: 'EV-304', status: 'reserved', eta: '15:00' },
  { id: '4', vehicle: 'EV-501', status: 'waiting', eta: '48 min' },
];

export function OperatorQueue() {
  const { toast } = useApp();
  const [rows, setRows] = useState<Row[]>(initial);
  const [view, setView] = useState<Row | null>(null);
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);

  const update = (fn: (rows: Row[]) => Row[]) => setRows((p) => fn(p));
  const move = (id: string, dir: -1 | 1) => {
    update((p) => {
      const i = p.findIndex((r) => r.id === id);
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    toast('Queue updated', 'Position moved.', 'info');
  };

  const col = (s: string) => (s === 'charging' ? '#6CCBFF' : s === 'waiting' ? '#C8FF3D' : s === 'reserved' ? '#F2C94C' : s === 'skipped' ? '#FF6B6B' : '#687177');

  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2"><ClipboardList size={24} className="text-primary" /> Queue Management</h1>
        <p className="text-txt-sec text-sm mt-1">Bole Fast Charge · live queue</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-txt-mut border-b border-border">
              <th className="px-5 py-3 font-medium">Pos</th>
              <th className="px-5 py-3 font-medium">Vehicle</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">ETA</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-5 py-3 font-display font-bold text-lg">{i + 1}</td>
                <td className="px-5 py-3 text-txt-sec">{r.vehicle}</td>
                <td className="px-5 py-3"><Badge color={col(r.status)}><StatusDot color={col(r.status)} pulse={r.status === 'charging'} /> {r.status}</Badge></td>
                <td className="px-5 py-3 text-txt-sec">{r.eta}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5 justify-end flex-wrap">
                    <Button size="sm" variant="ghost" onClick={() => setView(r)}><User size={13} /> View</Button>
                    {r.status === 'waiting' && <Button size="sm" variant="outline" onClick={() => update((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'charging', eta: 'Now' } : x)))}><Play size={13} /> Start</Button>}
                    {r.status === 'charging' && <Button size="sm" variant="danger" onClick={() => setConfirm({ msg: `End session for ${r.vehicle}?`, fn: () => update((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'completed', eta: 'Done' } : x))) })}><Square size={13} /> End</Button>}
                    {r.status === 'reserved' && <Button size="sm" variant="outline" onClick={() => setConfirm({ msg: `Skip no-show for ${r.vehicle}?`, fn: () => update((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'skipped', eta: '—' } : x))) })}><SkipForward size={13} /> Skip</Button>}
                    <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => move(r.id, -1)} aria-label="Move up"><ArrowUp size={13} /></Button>
                    <Button size="sm" variant="ghost" disabled={i === rows.length - 1} onClick={() => move(r.id, 1)} aria-label="Move down"><ArrowDown size={13} /></Button>
                    {r.status !== 'skipped' && r.status !== 'completed' && <Button size="sm" variant="ghost" onClick={() => setConfirm({ msg: `Cancel reservation for ${r.vehicle}?`, fn: () => update((p) => p.map((x) => (x.id === r.id ? { ...x, status: 'skipped', eta: '—' } : x))) })}><XCircle size={13} /></Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-4 text-sm text-txt-sec">
        <p className="font-medium text-txt mb-1">Live queue summary</p>
        <p className="text-xs text-txt-mut">
          {rows.filter((r) => r.status === 'charging').length} charging · {rows.filter((r) => r.status === 'waiting').length} waiting · avg wait ~{Math.max(8, rows.length * 12)} min. Actions update local demo state.
        </p>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title="Vehicle details">
        {view && (
          <div className="space-y-3 text-sm">
            <InfoRow k="Vehicle ID" v={view.vehicle} />
            <InfoRow k="Plate" v={['3F 88021', '8E 44192', '2C 70013', '9A 12034'][Number(view.id) - 1]} />
            <InfoRow k="Status" v={view.status} />
            <InfoRow k="ETA" v={view.eta} />
            <InfoRow k="Driver" v="Abel T. · BYD Dolphin" />
          </div>
        )}
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Confirm action">
        <p className="text-sm text-txt-sec">{confirm?.msg}</p>
        <div className="flex gap-3 mt-5">
          <Button variant="outline" full onClick={() => setConfirm(null)}>Cancel</Button>
          <Button full onClick={() => { confirm?.fn(); toast('Action completed', 'Queue updated.', 'success'); setConfirm(null); }}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-border pb-2"><span className="text-txt-mut">{k}</span><span className="font-medium">{v}</span></div>;
}
