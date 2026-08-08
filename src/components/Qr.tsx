import React from 'react';

// Deterministic pseudo-QR from a seed string. NOT a scannable code.
export const Qr: React.FC<{ text: string; size?: number; className?: string }> = ({ text, size = 168, className }) => {
  const cells = 21;
  const pad = 2;
  const n = cells + pad * 2;
  const grid: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967295;
  };

  for (let y = pad; y < n - pad; y++) for (let x = pad; x < n - pad; x++) if (rand() > 0.52) grid[y][x] = true;

  const finder = (oy: number, ox: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const on = y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4);
        grid[oy + y][ox + x] = on;
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} className={className} role="img" aria-label="QR code placeholder">
      <rect width={n} height={n} fill="#ffffff" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0B0D0F" /> : null
        )
      )}
    </svg>
  );
};
