import { CheckCircle2, Info, Zap, AlertTriangle } from 'lucide-react';
import { useApp } from '../store';
import { cx } from './ui';

const icons = {
  success: <CheckCircle2 size={18} className="text-primary" />,
  info: <Info size={18} className="text-[#6CCBFF]" />,
  warning: <AlertTriangle size={18} className="text-[#F2C94C]" />,
  charging: <Zap size={18} className="text-primary" />,
};

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="anim-toast card px-4 py-3 flex items-start gap-3 pointer-events-auto">
          <div className="mt-0.5 shrink-0">{icons[(t.icon as keyof typeof icons) || 'info']}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-txt">{t.title}</p>
            {t.body && <p className={cx('text-xs text-txt-mut mt-0.5', 'break-words')}>{t.body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
