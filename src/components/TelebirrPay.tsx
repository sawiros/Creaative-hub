import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Loader2, Smartphone } from 'lucide-react';
import { Modal, Button } from './ui';

type Phase = 'form' | 'processing' | 'success' | 'error';

export function TelebirrPay({
  open,
  onClose,
  amount,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (txn: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>('form');
  const [txn, setTxn] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (open) {
      setPhase('form');
      setPin('');
    }
  }, [open]);

  const confirm = () => {
    setPhase('processing');
    setTimeout(() => {
      if (Math.random() > 0.92) {
        setPhase('error');
      } else {
        const t = 'TXN-CHG-' + Math.floor(10000 + Math.random() * 89999);
        setTxn(t);
        setPhase('success');
      }
    }, 1700);
  };

  const done = () => {
    if (phase === 'success') onSuccess(txn);
    onClose();
  };

  return (
    <Modal open={open} onClose={phase === 'success' ? done : onClose} title="Pay with Telebirr">
      {phase === 'form' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-surface border border-border p-4">
            <p className="text-xs text-txt-mut">Reservation fee</p>
            <p className="font-display text-3xl font-bold mt-1">{amount} <span className="text-lg text-txt-sec">ETB</span></p>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-surface border border-border p-3">
            <Smartphone size={20} className="text-primary" />
            <div className="flex-1">
              <label className="text-[11px] text-txt-mut">Phone number</label>
              <input
                value="09 11 48 26 04"
                readOnly
                className="w-full bg-transparent text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-txt-mut block mb-1.5">Telebirr PIN (demo)</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              placeholder="Enter any 4 digits"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button full size="lg" onClick={confirm} disabled={pin.length < 4}>
            Confirm Payment
          </Button>
          <p className="text-[11px] text-center text-txt-mut flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-primary" />
            Demo payment — not connected to the real Telebirr API.
          </p>
        </div>
      )}

      {phase === 'processing' && (
        <div className="py-10 text-center space-y-4">
          <Loader2 size={40} className="mx-auto text-primary animate-spin" />
          <p className="font-display text-lg font-semibold">Processing payment...</p>
          <p className="text-sm text-txt-mut">Please approve on your Telebirr app.</p>
        </div>
      )}

      {phase === 'success' && (
        <div className="py-6 text-center space-y-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 size={32} />
          </span>
          <div>
            <p className="font-display text-xl font-bold">Payment successful</p>
            <p className="text-sm text-txt-sec mt-1">{amount} ETB · Telebirr</p>
          </div>
          <div className="rounded-lg bg-surface border border-border p-3 text-sm">
            <p className="text-xs text-txt-mut mb-1">Transaction</p>
            <p className="font-mono text-primary">{txn}</p>
          </div>
          <Button full size="lg" onClick={done}>
            Confirm Reservation
          </Button>
        </div>
      )}

      {phase === 'error' && (
        <div className="py-8 text-center space-y-4">
          <p className="text-[#FF6B6B] text-lg font-semibold">Payment failed</p>
          <p className="text-sm text-txt-mut">Insufficient balance in demo wallet. Try again.</p>
          <Button variant="outline" full onClick={() => setPhase('form')}>Try again</Button>
        </div>
      )}
    </Modal>
  );
}
