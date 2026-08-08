import React from 'react';
import { BarChart3, TrendingUp, Timer, Gauge, Banknote, CheckCircle2, UserX } from 'lucide-react';
import { useApp } from '../../store';
import { Stat } from '../../components/ui';

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const resByDay = [22, 28, 25, 34, 31, 18, 12];
const revenue = [3200, 4100, 3800, 4850, 4500, 2600, 1700];

export function OperatorAnalytics() {
  const { stations } = useApp();
  const max = Math.max(...resByDay);
  const maxRev = Math.max(...revenue);
  const utilization = stations.reduce((a, s) => a + s.chargers.filter((c) => c.status === 'charging').length, 0) / Math.max(1, stations.reduce((a, s) => a + s.chargers.length, 0)) * 100;

  return (
    <div className="space-y-6 anim-fade">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-txt-sec text-sm mt-1">Network performance · last 7 days</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Reservations" value="170" icon={<BarChart3 size={16} />} sub="this week" />
        <Stat label="Avg queue time" value="14m" icon={<Timer size={16} />} sub="−3m vs last week" accent="#6CCBFF" />
        <Stat label="Utilization" value={`${Math.round(utilization * 10)}%`} icon={<Gauge size={16} />} accent="#F2C94C" />
        <Stat label="Revenue" value="24,750" icon={<Banknote size={16} />} sub="ETB" />
        <Stat label="No-show rate" value="4.2%" icon={<UserX size={16} />} sub="low" accent="#FF6B6B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reservations bar chart */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4"><BarChart3 size={16} className="text-primary" /><h3 className="font-display text-sm font-semibold">Reservations per day</h3></div>
          <div className="flex items-end gap-3 h-40">
            {resByDay.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="relative w-full flex items-end justify-center flex-1">
                  <div className="w-full max-w-[34px] rounded-t-md bg-primary/70 hover:bg-primary transition-colors anim-grow" style={{ height: `${(v / max) * 100}%` }} />
                  <span className="absolute -top-5 text-[10px] text-txt-sec">{v}</span>
                </div>
                <span className="text-[10px] text-txt-mut">{week[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue line chart */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} className="text-primary" /><h3 className="font-display text-sm font-semibold">Revenue (ETB)</h3></div>
          <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label="Revenue trend">
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8FF3D" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C8FF3D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={points(revenue, 320, 150)} fill="none" stroke="#C8FF3D" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <polygon points={points(revenue, 320, 150) + ` 320,150 0,150`} fill="url(#revFill)" />
            {revenue.map((v, i) => {
              const [x, y] = point(i, v, revenue, 320, 150);
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#C8FF3D" />;
            })}
          </svg>
          <div className="flex justify-between text-[10px] text-txt-mut mt-1 px-1">
            {week.map((w) => <span key={w}>{w}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="font-display text-sm font-semibold mb-3">Charger utilization by station</p>
          <div className="space-y-3">
            {stations.map((s) => {
              const u = Math.round((s.chargers.filter((c) => c.status !== 'offline').length / Math.max(1, s.chargers.length)) * 100);
              return (
                <div key={s.id}>
                  <div className="flex justify-between text-xs text-txt-mut mb-1"><span>{s.name}</span><span>{u}%</span></div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full anim-grow" style={{ width: `${u}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card p-5">
          <p className="font-display text-sm font-semibold mb-3">Key metrics</p>
          <div className="space-y-3 text-sm">
            <MetricRow k="Completed sessions" v="166" />
            <MetricRow k="Avg energy per session" v="32.4 kWh" />
            <MetricRow k="Avg revenue per session" v="185 ETB" />
            <MetricRow k="Peak hour" v="17:00 – 18:00" />
            <MetricRow k="Top station" v="Bole Fast Charge" />
          </div>
        </div>
      </div>
    </div>
  );
}

function point(i: number, v: number, data: number[], w: number, h: number) {
  const max = Math.max(...data);
  const x = (i / (data.length - 1)) * w;
  const y = h - (v / max) * (h - 16) - 8;
  return [x, y];
}
function points(data: number[], w: number, h: number) {
  return data.map((v, i) => point(i, v, data, w, h).join(',')).join(' ');
}
function MetricRow({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-border pb-2"><span className="text-txt-mut">{k}</span><span className="font-medium">{v}</span></div>;
}
