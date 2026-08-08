import React from 'react';
import { useApp } from '../../store';
import { MapView } from '../../components/MapView';
import { StationCard } from '../../components/StationCard';
import { Button } from '../../components/ui';

export function MapPage() {
  const { stations, openStation, nav } = useApp();
  const rec = stations.find((s) => s.recommended);
  return (
    <div className="space-y-5 anim-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Station Map</h1>
          <p className="text-txt-sec text-sm mt-1">Addis Ababa · {stations.length} demo stations</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => nav('find')}>List view</Button>
      </div>
      <MapView stations={stations} onSelect={openStation} selectedId={rec?.id} />
      <p className="text-xs text-txt-mut">Stylized map placeholder — no external map service required. Tap a marker for details.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map((s) => <StationCard key={s.id} station={s} onOpen={openStation} />)}
      </div>
    </div>
  );
}
