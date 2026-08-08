import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../../store';
import { StationCard } from '../../components/StationCard';
import { MapView } from '../../components/MapView';
import { Button, cx } from '../../components/ui';

export function Find() {
  const { stations, openStation } = useApp();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('All areas');
  const [maxPower, setMaxPower] = useState<number>(0);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const areas = ['All areas', ...Array.from(new Set(stations.map((s) => s.area)))];
  const minPower = Math.min(...stations.map((s) => s.maxPower));

  const filtered = useMemo(
    () =>
      stations
        .filter((s) => (area === 'All areas' || s.area === area))
        .filter((s) => s.maxPower >= maxPower)
        .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.area.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [query, area, maxPower, stations]
  );

  return (
    <div className="space-y-5 anim-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Find Chargers</h1>
          <p className="text-txt-sec text-sm mt-1">{stations.length} stations · Addis Ababa</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={view === 'list' ? 'dark' : 'ghost'} onClick={() => setView('list')}>List</Button>
          <Button size="sm" variant={view === 'map' ? 'dark' : 'ghost'} onClick={() => setView('map')}>Map</Button>
        </div>
      </div>

      {/* search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-mut" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search station or area…"
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button variant="dark" onClick={() => setFiltersOpen(!filtersOpen)} aria-label="Filters">
          <SlidersHorizontal size={16} /> <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {filtersOpen && (
        <div className="card p-4 anim-fade space-y-4">
          <div>
            <p className="text-xs text-txt-mut mb-2">Area</p>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <button key={a} onClick={() => setArea(a)} className={cx('px-3 py-1.5 rounded-lg text-xs font-medium border', a === area ? 'bg-primary/12 text-primary border-primary/40' : 'bg-surface text-txt-sec border-border hover:text-txt')}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-txt-mut mb-2"><span>Minimum power</span><span className="text-txt">{maxPower || 'Any'} kW</span></div>
            <input type="range" min={minPower} max={150} step={10} value={maxPower} onChange={(e) => setMaxPower(Number(e.target.value))} className="w-full accent-[#C8FF3D]" />
            {maxPower > 0 && <button onClick={() => setMaxPower(0)} className="text-xs text-primary mt-1 inline-flex items-center gap-1"><X size={12} /> Clear</button>}
          </div>
        </div>
      )}

      {view === 'map' ? (
        <div>
          <MapView stations={stations} onSelect={openStation} />
          <p className="text-xs text-txt-mut mt-2">Click a marker to view a station. Map is a stylized demo placeholder.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {filtered.map((s) => <StationCard key={s.id} station={s} onOpen={openStation} />)}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-lg font-semibold">No chargers match your filters.</p>
          <p className="text-sm text-txt-mut mt-1">Try clearing the search or lowering the power requirement.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setArea('All areas'); setMaxPower(0); }}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => <StationCard key={s.id} station={s} onOpen={openStation} />)}
        </div>
      )}
    </div>
  );
}
