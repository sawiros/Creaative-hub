import React, { useEffect, useState } from 'react';
import { Users, Car, BatteryCharging, Search, Phone } from 'lucide-react';
import { memberDb, Member } from '../../lib/supabase';
import { Skeleton } from '../../components/ui';

export function Members() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [query, setQuery] = useState('');
  const [usingRemote, setUsingRemote] = useState(false);

  useEffect(() => {
    memberDb.list().then((m) => {
      setMembers(m);
    });
  }, []);

  const filtered = (members || []).filter((m) =>
    m.full_name.toLowerCase().includes(query.toLowerCase()) || m.vehicle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5 anim-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2"><Users size={26} className="text-primary" /> Member Database</h1>
          <p className="text-txt-sec text-sm mt-1">
            {members ? `${members.length} registered drivers` : 'Loading…'}
            {usingRemote ? ' · shared via Supabase' : ' · demo'}
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-mut" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or EV…" className="bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-txt-mut flex items-center gap-1.5"><Car size={14} /> Registered EVs</span>
        {['BYD Dolphin', 'BYD Atto 3', 'Tesla Model 3', 'Hyundai Kona', 'Geely Geometry C'].map((v) => (
          <span key={v} className="px-2 py-1 rounded-md bg-surface border border-border text-[11px] text-txt-sec">{v}</span>
        ))}
      </div>

      {!members ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="card p-4 flex items-center gap-3 anim-fade">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary font-display font-bold">
                {m.full_name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{m.full_name}</p>
                <p className="text-xs text-txt-mut truncate inline-flex items-center gap-1"><Car size={11} /> {m.vehicle}</p>
                <p className="text-xs text-txt-mut truncate inline-flex items-center gap-1"><Phone size={11} /> {m.phone}</p>
              </div>
              <span className="shrink-0 flex items-center gap-1 text-xs font-medium" style={{ color: m.battery < 30 ? '#FF6B6B' : m.battery < 60 ? '#F2C94C' : '#C8FF3D' }}>
                <BatteryCharging size={13} /> {m.battery}%
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-txt-mut">{usingRemote ? 'Live Supabase records.' : 'Demo database. Connect Supabase to share registrations across devices.'}</p>
    </div>
  );
}
