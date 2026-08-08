import React, { useEffect, useRef, useState } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { cx } from './ui';

const canned: [RegExp, string][] = [
  [/18%|battery|low battery/i, "I found 3 nearby options. Bole Fast Charge is your best choice — a 120 kW charger, 2.1 km away, and only ~12 min estimated wait. Reserve 15:00–15:30 for a 50 ETB fee."],
  [/3 ?pm|15:00|slot/i, "Yes. Bole Fast Charge has a 15:00–15:30 reservation slot available for a 50 ETB reservation fee. Want me to reserve it?"],
  [/cheap|cost|price|fee/i, "Bole Fast Charge is 6 ETB/kWh with a 50 ETB reservation fee. Megenagna ChargePoint is cheaper at 5 ETB/kWh but only offers 60 kW chargers."],
  [/queue|wait/i, "Bole Fast Charge has 3 vehicles ahead of you with an estimated 27 min wait. You're currently #3."],
  [/hi|hello|hey/i, "Hello Abel! I can help you find a charger, check availability, or estimate your charging cost."],
  [/fast|120|150/i, "Bole Fast Charge (120–150 kW) and Kazanchis Hub (120–150 kW) both offer DC fast charging. For speed, pick Bole."],
];

export function CopilotPanel({ onClose }: { onClose: () => void }) {
  const { copilotMsgs, dispatch, openStation } = useApp();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [copilotMsgs, typing]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    dispatch({ type: 'COPILOT_SEND', msg: { from: 'user', text } });
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const match = canned.find(([re]) => re.test(text));
      const reply = match ? match[1] : "I'd recommend Bole Fast Charge — a 120 kW fast charger 2.1 km away with a short queue. Open it to reserve a slot.";
      dispatch({ type: 'COPILOT_SEND', msg: { from: 'ai', text: reply } });
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed z-[60] bottom-20 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-[380px] card shadow-2xl anim-pop flex flex-col max-h-[70vh] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">ChargeShare Copilot</p>
            <p className="text-[11px] text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary anim-pulse" /> Demo assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-card text-txt-mut" aria-label="Close copilot">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-bg/40">
        {copilotMsgs.map((m, i) => (
          <div key={i} className={cx('max-w-[85%] rounded-xl px-3 py-2 text-sm anim-fade', m.from === 'ai' ? 'bg-surface border border-border text-txt' : 'bg-primary text-primary-ink ml-auto')}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-surface border border-border">
            <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-txt-mut animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-txt-mut animate-bounce [animation-delay:120ms]" /><span className="w-1.5 h-1.5 rounded-full bg-txt-mut animate-bounce [animation-delay:240ms]" /></span>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-surface flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="e.g. I have 18% battery, find me a charger"
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button onClick={() => send(input)} disabled={!input.trim() || typing} className="h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-ink flex items-center justify-center disabled:opacity-40" aria-label="Send">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
