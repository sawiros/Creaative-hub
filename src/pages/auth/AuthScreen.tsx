import React, { useState } from 'react';
import { Car, Phone, Mail, Lock, BatteryCharging, User, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Logo } from '../../components/Logo';
import { Button, cx } from '../../components/ui';

const vehicleOptions = ['BYD Dolphin', 'BYD Atto 3', 'Tesla Model 3', 'Hyundai Kona Electric', 'Geely Geometry C', 'BYD Seal', 'Nissan Leaf', 'Tesla Model Y', 'Other'];

export function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel (desktop) */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between p-10 bg-surface border-r border-border">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-xl font-bold">ChargeShare</span>
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Reserve your charging slot.<br />Skip the physical queue.
          </h1>
          <p className="text-txt-sec max-w-sm">Ethiopia's smart EV charging reservation & queue platform. Sign up to reserve a charger and pay with Telebirr.</p>
          <div className="flex gap-2 text-xs text-txt-mut">
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border">60+ members</span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border">Telebirr</span>
            <span className="px-3 py-1.5 rounded-lg bg-card border border-border">DC Fast</span>
          </div>
        </div>
        <p className="text-xs text-txt-mut">Demo build · data stored per your Supabase project.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Logo />
            <span className="font-display text-xl font-bold">ChargeShare</span>
          </div>

          <div className="flex p-1 bg-surface rounded-lg border border-border mb-6">
            {(['signup', 'login'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={cx('flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors', mode === m ? 'bg-primary text-primary-ink' : 'text-txt-sec hover:text-txt')}>
                {m === 'signup' ? 'Sign up' : 'Log in'}
              </button>
            ))}
          </div>

          {mode === 'signup' ? <SignUp onSwitch={() => setMode('login')} /> : <LogIn onSwitch={() => setMode('signup')} />}
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; label: string; error?: string }) {
  return (
    <div>
      <label className="text-xs text-txt-mut block mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-mut">{icon}</span>
        <input className="w-full bg-surface border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" {...rest} />
      </div>
      {error && <p className="text-xs text-[#FF6B6B] mt-1">{error}</p>}
    </div>
  );
}

function SignUp({ onSwitch }: { onSwitch: () => void }) {
  const { signUp, isSupabase } = useAuth();
  const [f, setF] = useState({ fullName: '', phone: '', email: '', password: '', vehicle: 'BYD Dolphin', battery: 23 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const r = await signUp(f);
    setBusy(false);
    if (!r.ok) setError(r.error || 'Sign up failed.');
    else if (isSupabase) setDone(true); // Supabase may require email confirmation
  };

  if (done) {
    return (
      <div className="card p-6 text-center space-y-3 anim-pop">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary"><Zap size={22} /></span>
        <h2 className="font-display text-xl font-bold">Check your inbox</h2>
        <p className="text-sm text-txt-sec">We sent a confirmation link to <strong>{f.email}</strong>. Confirm it, then log in.</p>
        <Button variant="outline" full onClick={onSwitch}>Go to login</Button>
      </div>
    );
  }

  const batteryColor = f.battery < 30 ? '#FF6B6B' : f.battery < 60 ? '#F2C94C' : '#C8FF3D';

  return (
    <form onSubmit={submit} className="card p-6 space-y-4 anim-fade">
      <h2 className="font-display text-xl font-bold">Create your account</h2>
      <Field icon={<User size={16} />} label="Full name" value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} placeholder="Abel Tesfaye" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field icon={<Phone size={16} />} label="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="09 XX XX XX XX" required />
        <Field icon={<Mail size={16} />} label="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@email.com" required />
      </div>
      <Field icon={<Lock size={16} />} label="Password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="Min 6 characters" minLength={6} required />

      <div>
        <label className="text-xs text-txt-mut block mb-1.5">Your EV model</label>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
          <Car size={16} className="text-txt-mut" />
          <select value={f.vehicle} onChange={(e) => setF({ ...f, vehicle: e.target.value })} className="flex-1 bg-transparent text-sm focus:outline-none">
            {vehicleOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-txt-mut flex items-center gap-1.5"><BatteryCharging size={14} /> Current battery</label>
          <span className="text-sm font-display font-bold" style={{ color: batteryColor }}>{f.battery}%</span>
        </div>
        <input type="range" min={5} max={100} value={f.battery} onChange={(e) => setF({ ...f, battery: Number(e.target.value) })} className="w-full accent-[#C8FF3D]" />
      </div>

      {error && <p className="text-sm text-[#FF6B6B] bg-[#2a1518] border border-[#3a2022] rounded-lg px-3 py-2">{error}</p>}

      <Button full size="lg" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Sign up & continue'}<ArrowRight size={16} /></Button>
      <p className="text-[11px] text-center text-txt-mut">
        {isSupabase ? 'Stored in your Supabase project.' : 'Demo mode: stored in this browser.'} You must be signed in to reserve a charger.
      </p>
    </form>
  );
}

function LogIn({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const r = await signIn(id, password);
    setBusy(false);
    if (!r.ok) setError(r.error || 'Login failed.');
  };

  return (
    <form onSubmit={submit} className="card p-6 space-y-4 anim-fade">
      <h2 className="font-display text-xl font-bold">Welcome back</h2>
      <Field icon={<Phone size={16} />} label="Phone or email" value={id} onChange={(e) => setId(e.target.value)} placeholder="09 XX XX XX XX" required />
      <Field icon={<Lock size={16} />} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
      {error && <p className="text-sm text-[#FF6B6B] bg-[#2a1518] border border-[#3a2022] rounded-lg px-3 py-2">{error}</p>}
      <Button full size="lg" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}<ArrowRight size={16} /></Button>
      <p className="text-[11px] text-center text-txt-mut">New here? <button type="button" onClick={onSwitch} className="text-primary hover:underline">Create an account</button></p>
    </form>
  );
}
