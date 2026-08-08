import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <span
    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-ink shrink-0"
    style={{ width: size, height: size }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* minimal connection/branch symbol */}
      <path d="M5 19V9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M5 5V4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5" cy="19" r="1.6" fill="currentColor" />
      <path d="M19 8v11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="19" cy="8" r="1.6" fill="currentColor" />
      <path d="M5 9h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  </span>
);
