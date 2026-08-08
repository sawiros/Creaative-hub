import React, { useState } from 'react';
import { Bell, ToggleLeft, ToggleRight, Shield, Smartphone, Monitor, Users, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../../store';
import { cx } from '../../components/ui';

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={on} className="shrink-0">
      {on ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-txt-mut" />}
    </button>
  );
}

export function Settings({ operator }: { operator?: boolean }) {
  const { dispatch, toast, notifications, dispatch: d } = useApp();
  const [toggles, setToggles] = useState({ push: true, queue: true, promo: false });
  const unread = notifications.filter((n) => !n.read).length;

  const flip = (k: keyof typeof toggles) => {
    setToggles((p) => ({ ...p, [k]: !p[k] }));
    toast('Preference saved', 'Settings updated.', 'success');
  };

  const setMode = (m: 'driver' | 'operator') => dispatch({ type: 'SET_MODE', mode: m });

  return (
    <div className="max-w-2xl mx-auto space-y-6 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-txt-sec text-sm mt-1">Preferences and app configuration</p>
      </div>

      {/* role switch */}
      <div className="card p-5">
        <p className="font-display text-sm font-semibold flex items-center gap-2 mb-3"><Users size={15} className="text-primary" /> App mode</p>
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface rounded-lg border border-border">
          {(['driver', 'operator'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cx('py-2.5 rounded-lg text-sm font-medium capitalize transition-colors', operator === (m === 'operator') ? 'bg-primary text-primary-ink' : 'hover:bg-card text-txt-sec')}>
              {m}
            </button>
          ))}
        </div>
        <p className="text-xs text-txt-mut mt-2">Switch between the driver app and the operator dashboard.</p>
      </div>

      {/* notifications */}
      <div className="card p-5 space-y-4">
        <p className="font-display text-sm font-semibold flex items-center gap-2 mb-1"><Bell size={15} className="text-primary" /> Notifications</p>
        {[
          { k: 'push' as const, l: 'Push notifications', v: 'Queue updates, reservation confirmations' },
          { k: 'queue' as const, l: 'Queue position alerts', v: 'Get notified when you move up the queue' },
          { k: 'promo' as const, l: 'Promotions & offers', v: 'Charging deals and station offers' },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between gap-4 py-1">
            <div>
              <p className="text-sm font-medium">{r.l}</p>
              <p className="text-xs text-txt-mut">{r.v}</p>
            </div>
            <Switch on={toggles[r.k]} onClick={() => flip(r.k)} />
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-1">
        <p className="font-display text-sm font-semibold flex items-center gap-2 mb-2"><Shield size={15} className="text-primary" /> Account & security</p>
        {[
          { l: 'Change phone number', v: currentPhone() },
          { l: 'Payment methods', v: 'Telebirr •••• 2604' },
          { l: 'Privacy & data', v: 'Manage what we store' },
        ].map((r, i) => (
          <button key={i} onClick={() => toast('Coming soon', 'This is a demo setting.', 'info')} className="w-full flex items-center justify-between py-2.5 text-sm hover:bg-surface rounded-lg px-2 -mx-2">
            <span className="font-medium">{r.l}</span>
            <span className="text-txt-mut flex items-center gap-1">{r.v} <ChevronRight size={14} /></span>
          </button>
        ))}
      </div>

      <div className="card p-5 flex items-start gap-3">
        <Smartphone size={16} className="text-primary mt-0.5" />
        <div className="text-xs text-txt-mut space-y-1.5">
          <p><strong className="text-txt-sec">ChargeShare</strong> · Demo build v1.0.0</p>
          <p className="flex items-center gap-1.5"><Info size={12} /> This is a product demonstration. Station, operator and payment data are demo data unless stated otherwise.</p>
          <p>Not connected to the real Telebirr API or any charging network.</p>
        </div>
      </div>
    </div>
  );
}

function currentPhone() {
  return '09 11 48 26 04';
}
