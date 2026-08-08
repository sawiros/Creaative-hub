import React from 'react';
import { Car, Phone, Smartphone, CreditCard, CalendarClock, Zap, ChevronRight, LogOut } from 'lucide-react';
import { useApp } from '../../store';
import { useAuth } from '../../lib/auth';
import { Button, ProgressRing } from '../../components/ui';

export function Profile() {
  const { battery, history, reservations, nav, toast } = useApp();
  const { user, profile, signOut } = useAuth();
  const displayBattery = profile?.battery ?? battery;
  const activeRes = reservations.filter((r) => r.status !== 'cancelled').length;
  const fullName = profile?.full_name || 'Driver';
  const phone = profile?.phone || '09 XX XX XX XX';
  const vehicle = profile?.vehicle || 'BYD Dolphin';

  return (
    <div className="max-w-3xl mx-auto space-y-6 anim-fade">
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary font-display text-3xl font-bold">
          {fullName[0]}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-2xl font-bold">{fullName}</h1>
          <p className="text-sm text-txt-sec">Driver · Member</p>
          <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start text-sm text-txt-mut">
            <span className="inline-flex items-center gap-1.5"><Car size={14} /> {vehicle}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {phone}</span>
          </div>
        </div>
        <ProgressRing value={displayBattery} size={84} label={`${displayBattery}%`} sub="battery" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { l: 'Reservations', v: String(activeRes) },
          { l: 'Sessions', v: String(history.length) },
          { l: 'Total kWh', v: history.reduce((a, h) => a + h.kWh, 0).toFixed(0) },
        ].map((m) => (
          <div key={m.l} className="card p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">{m.v}</p>
            <p className="text-xs text-txt-mut mt-0.5">{m.l}</p>
          </div>
        ))}
      </div>

      <div className="card divide-y divide-border">
        {[
          { icon: <Car size={18} />, l: 'Vehicle', v: `${vehicle} · Electric Vehicle`, onClick: () => toast('Vehicle settings', 'Demo — edit vehicle here.', 'info') },
          { icon: <Smartphone size={18} />, l: 'Phone number', v: phone, onClick: () => toast('Phone', 'Demo action.', 'info') },
          { icon: <CreditCard size={18} />, l: 'Saved payment method', v: 'Telebirr •••• 2604', onClick: () => toast('Payment methods', 'Telebirr saved.', 'success') },
        ].map((row, i) => (
          <button key={i} onClick={row.onClick} className="w-full flex items-center gap-3 p-4 hover:bg-surface transition-colors text-left">
            <span className="text-primary">{row.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-sm">{row.l}</p>
              <p className="text-xs text-txt-mut mt-0.5">{row.v}</p>
            </div>
            <ChevronRight size={16} className="text-txt-mut" />
          </button>
        ))}
      </div>

      <div className="card p-5">
        <p className="font-display text-sm font-semibold flex items-center gap-2 mb-3"><CalendarClock size={15} className="text-primary" /> Recent reservations</p>
        {activeRes > 0 ? (
          <div className="space-y-2">
            {reservations.filter((r) => r.status !== 'cancelled').slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm bg-surface border border-border rounded-lg p-3">
                <span className="flex items-center gap-2"><Zap size={13} className="text-primary" />{r.stationName}</span>
                <span className="text-txt-mut text-xs">{r.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-txt-mut">No reservations yet.</p>
        )}
      </div>

      <Button variant="danger" full onClick={() => { signOut(); nav('dashboard'); }}>
        <LogOut size={16} /> Sign out
      </Button>
    </div>
  );
}
