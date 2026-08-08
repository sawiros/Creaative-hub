import React from 'react';
import { X } from 'lucide-react';

export function cx(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

type BtnVariant = 'primary' | 'ghost' | 'danger' | 'outline' | 'dark';
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'; full?: boolean }
> = ({ variant = 'primary', size = 'md', full, className, children, ...rest }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60';
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-[15px] px-5 py-3' };
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-primary text-primary-ink hover:bg-primary-dark shadow-sm',
    ghost: 'text-txt-sec hover:text-txt hover:bg-surface',
    danger: 'bg-[#2a1518] text-[#FF8A8A] border border-[#3a2022] hover:bg-[#33191c]',
    outline: 'border border-border text-txt hover:bg-surface',
    dark: 'bg-surface text-txt border border-border hover:bg-card',
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], full && 'w-full', className)} {...rest}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ color?: string; children: React.ReactNode; className?: string }> = ({ color = 'var(--c, #C8FF3D)', children, className }) => (
  <span
    className={cx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', className)}
    style={{ background: color + '18', color, border: `1px solid ${color}33` }}
  >
    {children}
  </span>
);

export const StatusDot: React.FC<{ color: string; className?: string; pulse?: boolean }> = ({ color, className, pulse }) => (
  <span className={cx('inline-block w-2 h-2 rounded-full', pulse && 'anim-pulse', className)} style={{ background: color }} />
);

export const SectionTitle: React.FC<{ title: string; sub?: string; right?: React.ReactNode }> = ({ title, sub, right }) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      <h3 className="font-display text-[15px] font-semibold text-txt">{title}</h3>
      {sub && <p className="text-xs text-txt-mut mt-0.5">{sub}</p>}
    </div>
    {right}
  </div>
);

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cx('relative w-full anim-pop surface shadow-2xl max-h-[90vh] overflow-auto', wide ? 'max-w-2xl' : 'max-w-md')}
      >
        {title && (
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface text-txt-mut" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ label, value, icon, sub, accent }: { label: string; value: string; icon?: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-txt-mut">{label}</p>
        {icon && <span style={{ color: accent || '#C8FF3D' }}>{icon}</span>}
      </div>
      <p className="font-display text-2xl font-bold mt-1" style={{ color: accent || 'var(--c,#E8ECEE)' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-txt-mut mt-1">{sub}</p>}
    </div>
  );
}

export function ProgressRing({ value, size = 120, stroke = 9, label, sub }: { value: number; size?: number; stroke?: number; label?: string; sub?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#22272B" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#C8FF3D"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        {label && <div className="font-display text-2xl font-bold">{label}</div>}
        {sub && <div className="text-[11px] text-txt-mut">{sub}</div>}
      </div>
    </div>
  );
}

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <span className={cx('inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin', className)} />
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => <div className={cx('skeleton rounded-lg', className)} />;
