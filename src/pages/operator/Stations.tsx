import React, { useState } from 'react';
import { MapPin, Plus, Pencil, Power, Trash2, Zap } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Modal, StatusDot, Badge } from '../../components/ui';
import { Charger } from '../../types';

const col = (s: string) => (s === 'charging' ? '#6CCBFF' : s === 'available' ? '#C8FF3D' : s === 'reserved' ? '#F2C94C' : '#687177');

export function OperatorStations() {
  const { stations, dispatch, toast } = useApp();
  const [expanded, setExpanded] = useState<string | null>(stations.find((s) => s.recommended)?.id || null);
  const [edit, setEdit] = useState<{ stationId: string; charger?: Charger } | null>(null);

  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Station Management</h1>
        <p className="text-txt-sec text-sm mt-1">{stations.length} stations · {stations.reduce((a, s) => a + s.chargers.length, 0)} chargers</p>
      </div>

      {stations.map((s) => {
        const open = expanded === s.id;
        return (
          <div key={s.id} className="card overflow-hidden">
            <button onClick={() => setExpanded(open ? null : s.id)} className="w-full flex items-center justify-between p-5 hover:bg-surface/40 transition-colors text-left">
              <div>
                <p className="font-display text-lg font-semibold">{s.name}</p>
                <p className="text-xs text-txt-mut mt-0.5 flex items-center gap-1.5"><MapPin size={12} /> {s.area} · {s.chargers.filter((c) => c.status === 'available').length}/{s.totalSlots} available</p>
              </div>
              <span className="text-txt-mut text-sm">{open ? '−' : '+'}</span>
            </button>
            {open && (
              <div className="px-5 pb-5 anim-fade">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-txt-mut">Chargers · {s.pricePerKwh} ETB/kWh · fee {s.reservationFee} ETB</p>
                  <Button size="sm" onClick={() => setEdit({ stationId: s.id })}><Plus size={14} /> Add charger</Button>
                </div>
                <div className="space-y-2">
                  {s.chargers.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary"><Zap size={16} /></span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{c.name} · {c.power} kW · {c.connector}</p>
                        <p className="text-xs text-txt-mut">{c.pricePerKwh} ETB/kWh · fee {c.reservationFee} ETB</p>
                      </div>
                      <Badge color={col(c.status)}><StatusDot color={col(c.status)} pulse={c.status === 'charging'} /> {c.status}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => setEdit({ stationId: s.id, charger: c })} aria-label="Edit"><Pencil size={14} /></Button>
                      <Button size="sm" variant="ghost" aria-label="Toggle power" onClick={() => {
                        const next = c.status === 'offline' ? 'available' : 'offline';
                        dispatch({ type: 'SET_CHARGER_STATUS', stationId: s.id, chargerId: c.id, status: next });
                        toast(next === 'offline' ? 'Charger disabled' : 'Charger enabled', `${c.name} ${next}.`, 'info');
                      }}><Power size={14} /></Button>
                      <Button size="sm" variant="ghost" aria-label="Remove" onClick={() => {
                        dispatch({ type: 'REMOVE_CHARGER', stationId: s.id, chargerId: c.id });
                        toast('Charger removed', `${c.name} deleted.`, 'warning');
                      }}><Trash2 size={14} className="text-[#FF6B6B]" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <ChargerModal edit={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

function ChargerModal({ edit, onClose }: { edit: { stationId: string; charger?: Charger } | null; onClose: () => void }) {
  const { dispatch, toast } = useApp();
  const [name, setName] = useState(edit?.charger?.name || '');
  const [power, setPower] = useState(edit?.charger?.power || 120);
  const [price, setPrice] = useState(edit?.charger?.pricePerKwh || 6);
  const [fee, setFee] = useState(edit?.charger?.reservationFee || 50);
  const [status, setStatus] = useState<string>(edit?.charger?.status || 'available');

  React.useEffect(() => {
    if (edit) {
      setName(edit.charger?.name || '');
      setPower(edit.charger?.power || 120);
      setPrice(edit.charger?.pricePerKwh || 6);
      setFee(edit.charger?.reservationFee || 50);
      setStatus(edit.charger?.status || 'available');
    }
  }, [edit]);

  if (!edit) return null;
  const isNew = !edit.charger;

  const save = () => {
    if (isNew) {
      dispatch({ type: 'ADD_CHARGER', stationId: edit.stationId, c: { id: 'c' + Date.now(), name: name || 'New Charger', type: 'DC Fast', power, connector: 'CCS2', status: status as Charger['status'], pricePerKwh: price, reservationFee: fee } });
      toast('Charger added', `${name} added to station.`, 'success');
    } else {
      dispatch({ type: 'UPDATE_CHARGER', stationId: edit.stationId, chargerId: edit.charger.id, patch: { name, power, pricePerKwh: price, reservationFee: fee, status: status as Charger['status'] } });
      toast('Charger updated', `${name} saved.`, 'success');
    }
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isNew ? 'Add charger' : `Edit ${edit.charger?.name}`}>
      <div className="space-y-4">
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></Field>
        <Field label="Power (kW)"><input type="number" value={power} onChange={(e) => setPower(Number(e.target.value))} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (ETB/kWh)"><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm" /></Field>
          <Field label="Fee (ETB)"><input type="number" value={fee} onChange={(e) => setFee(Number(e.target.value))} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm" /></Field>
        </div>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm">
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="charging">Charging</option>
            <option value="offline">Offline</option>
          </select>
        </Field>
        <Button full size="lg" onClick={save}>{isNew ? 'Add charger' : 'Save changes'}</Button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-txt-mut block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
