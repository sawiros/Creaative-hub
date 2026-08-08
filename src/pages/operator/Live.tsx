import React from 'react';
import { PlugZap, Play, Square, XCircle } from 'lucide-react';
import { useApp } from '../../store';
import { Button, StatusDot, Badge } from '../../components/ui';

export function OperatorLive() {
  const { stations, dispatch, toast } = useApp();
  const all = stations.flatMap((s) =>
    s.chargers.map((c) => ({ ...c, stationName: s.name, stationId: s.id }))
  );
  const col = (s: string) => (s === 'charging' ? '#6CCBFF' : s === 'available' ? '#C8FF3D' : s === 'reserved' ? '#F2C94C' : '#687177');

  const setStatus = (stationId: string, chargerId: string, status: 'charging' | 'available' | 'reserved' | 'offline', label: string) => {
    dispatch({ type: 'SET_CHARGER_STATUS', stationId, chargerId, status });
    toast(label, `${chargerId} updated to ${status}.`, 'info');
  };

  return (
    <div className="space-y-5 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Live Chargers</h1>
        <p className="text-txt-sec text-sm mt-1">{all.filter((c) => c.status === 'charging').length} charging · {all.filter((c) => c.status === 'available').length} available</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {all.map((c) => {
          const color = col(c.status);
          return (
            <div key={c.stationId + c.id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm flex items-center gap-2"><PlugZap size={15} className="text-primary" />{c.name}</p>
                <Badge color={color}><StatusDot color={color} pulse={c.status === 'charging'} /> {c.status}</Badge>
              </div>
              <p className="text-xs text-txt-mut mt-1">{c.stationName} · {c.power} kW</p>
              {c.status === 'charging' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-txt-mut"><span>EV-102 · 78%</span><span>18 min left</span></div>
                  <div className="h-1.5 bg-surface rounded-full mt-1.5 overflow-hidden"><div className="h-full rounded-full bg-[#6CCBFF]" style={{ width: '78%' }} /></div>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                {c.status === 'available' && <Button size="sm" onClick={() => setStatus(c.stationId, c.id, 'charging', 'Session started')}><Play size={13} /> Start session</Button>}
                {c.status === 'charging' && <Button size="sm" variant="danger" onClick={() => setStatus(c.stationId, c.id, 'available', 'Session ended')}><Square size={13} /> End</Button>}
                {c.status !== 'offline' && <Button size="sm" variant="outline" onClick={() => setStatus(c.stationId, c.id, 'offline', 'Charger disabled')}><XCircle size={13} /> Disable</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
