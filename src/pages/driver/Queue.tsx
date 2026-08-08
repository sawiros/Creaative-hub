import React, { useEffect, useState } from 'react';
import { Clock, LogOut, ChevronDown, MapPin, Zap } from 'lucide-react';
import { useApp } from '../../store';
import { Button, Modal, StatusDot, cx } from '../../components/ui';

export function Queue() {
  const { queuePosition, queueJoined, dispatch, nav, toast } = useApp();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [position, setPosition] = useState(queuePosition);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPosition(queuePosition);
  }, [queuePosition]);

  useEffect(() => {
    if (!queueJoined) return;
    // simulate queue advancing
    const t = setInterval(() => {
      setTick((x) => x + 1);
      setPosition((p) => Math.max(1, p - (Math.random() > 0.7 ? 1 : 0)));
    }, 6000);
    return () => clearInterval(t);
  }, [queueJoined]);

  if (!queueJoined) {
    return (
      <div className="max-w-lg mx-auto card p-10 text-center space-y-4 anim-fade">
        <Clock size={40} className="mx-auto text-txt-mut" />
        <div>
          <p className="font-display text-xl font-bold">You're not in a queue</p>
          <p className="text-sm text-txt-mut mt-1">Join the smart queue at a busy station to reserve your place without waiting in line.</p>
        </div>
        <Button onClick={() => nav('find')}>Find a busy station</Button>
      </div>
    );
  }

  const wait = Math.max(8, position * 12 - tick * 2);
  const eta = Math.floor(new Date().getTime() / 1000 / 60) % 1440;

  const vehicles = ['EV-102', 'EV-221', 'EV-304', 'EV-501'];
  const youIndex = position - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6 anim-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Charging Queue</h1>
          <p className="text-txt-sec text-sm mt-1 flex items-center gap-1.5"><MapPin size={13} /> Bole Fast Charge</p>
        </div>
        <Button variant="danger" onClick={() => setLeaveOpen(true)}><LogOut size={15} /> Leave Queue</Button>
      </div>

      {/* hero queue status */}
      <div className="card p-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-txt-mut">Your position</p>
          <p className="font-display text-5xl font-bold text-primary mt-1">#{position}</p>
        </div>
        <div>
          <p className="text-xs text-txt-mut">Estimated waiting time</p>
          <p className="font-display text-5xl font-bold mt-1">{wait}<span className="text-lg text-txt-sec"> min</span></p>
          <p className="text-xs text-txt-mut mt-1 flex items-center gap-1"><Clock size={12} /> Est. start ~{formatTime(eta + Math.floor(wait / 60))}</p>
        </div>
      </div>

      {/* progress */}
      <div className="card p-5">
        <div className="flex justify-between text-xs text-txt-mut mb-2">
          <span>Reservation window: 15:00 – 15:30</span>
          <span>{Math.round(((5 - position) / 4) * 100)}% to charger</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.max(10, ((5 - position) / 4) * 100)}%` }} />
        </div>
      </div>

      {/* visual queue */}
      <div className="card p-5">
        <p className="text-xs text-txt-mut mb-4 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6CCBFF] anim-pulse" /> Now charging · EV-102 · ~{Math.max(2, 12 - tick * 2)} min remaining
        </p>
        <div className="space-y-1">
          {[0, 1, 2, 3].map((i) => {
            const isYou = i === youIndex;
            return (
              <React.Fragment key={i}>
                <div className={cx('flex items-center gap-3 p-3 rounded-lg', isYou ? 'bg-primary/12 border border-primary/40' : 'bg-surface border border-border')}>
                  <span className={cx('font-display font-bold text-lg w-8', isYou ? 'text-primary' : i === 0 ? 'text-[#6CCBFF]' : 'text-txt-mut')}>#{i + 1}</span>
                  <span className={cx('text-sm', isYou ? 'text-primary font-semibold' : 'text-txt-sec')}>
                    {isYou ? 'You — Abel · BYD Dolphin' : vehicles[i]}
                  </span>
                  <span className="ml-auto text-xs text-txt-mut">
                    {i === 0 ? 'charging' : isYou ? 'waiting' : `~${Math.max(8, (i + 1) * 12)} min`}
                  </span>
                </div>
                {i < 3 && <div className="flex justify-center py-0.5"><ChevronDown size={14} className="text-txt-mut" /></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="card p-4 text-sm text-txt-sec">
        <p className="font-medium text-txt mb-1 inline-flex items-center gap-1.5"><Zap size={14} className="text-primary" /> You'll be notified when you move up.</p>
        <p className="text-xs text-txt-mut">Queue position updates live. You can leave anytime before your slot starts.</p>
      </div>

      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Leave the queue?">
        <p className="text-sm text-txt-sec">You'll lose your current position at Bole Fast Charge. Your reservation remains valid.</p>
        <div className="flex gap-3 mt-5">
          <Button variant="outline" full onClick={() => setLeaveOpen(false)}>Stay in queue</Button>
          <Button variant="danger" full onClick={() => {
            dispatch({ type: 'LEAVE_QUEUE' });
            dispatch({ type: 'ADD_NOTIF', n: { title: 'Left queue', body: 'You left the queue at Bole Fast Charge.', icon: 'warning' } });
            toast('Left queue', 'You are no longer queued.', 'warning');
            setLeaveOpen(false);
          }}>Leave Queue</Button>
        </div>
      </Modal>
    </div>
  );
}

function formatTime(m: number) {
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
