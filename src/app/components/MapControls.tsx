import { useState } from 'react';
import { Building2, Layers, ZoomIn, ZoomOut, Maximize2, ChevronDown } from 'lucide-react';
import { buildings, getFloorLabel } from '../data/floorMaps';
import { Language, t } from '../utils/translations';

interface Props {
  currentBuilding: string;
  onBuildingChange: (id: string) => void;
  currentFloor: number;
  onFloorChange: (f: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  language: Language;
}

export function MapControls({
  currentBuilding, onBuildingChange, currentFloor, onFloorChange,
  scale, onZoomIn, onZoomOut, onZoomReset, language,
}: Props) {
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [floorOpen, setFloorOpen]       = useState(false);
  const [zoomOpen, setZoomOpen]         = useState(false);

  const closeAll = () => { setBuildingOpen(false); setFloorOpen(false); setZoomOpen(false); };

  const currentBData = buildings.find(b => b.id === currentBuilding);
  const availableFloors = currentBData?.floors ?? [];

  return (
    <>
      {/* Building selector – top left */}
      <div className="absolute top-24 left-4 z-20">
        <div className="relative">
          <button onClick={() => { setBuildingOpen(!buildingOpen); setFloorOpen(false); setZoomOpen(false); }}
            className="bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2 border-2 border-[#A5968A] hover:bg-[#FCE8E9] transition-all">
            <div className="bg-[#A82227] p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[#A5968A] font-semibold uppercase leading-none">{t(language, 'building')}</p>
              <p className="text-sm font-bold text-[#A82227] leading-tight">{currentBData?.shortName}</p>
            </div>
            <ChevronDown className={`h-3 w-3 text-[#A82227] transition-transform ${buildingOpen ? 'rotate-180' : ''}`} />
          </button>

          {buildingOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-[#A5968A] p-1.5 min-w-[200px]">
              {buildings.map(b => (
                <button key={b.id} onClick={() => { onBuildingChange(b.id); setBuildingOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 last:mb-0 flex items-center gap-2 transition-all text-sm ${currentBuilding === b.id ? 'bg-[#A82227] text-white font-bold' : 'hover:bg-[#FCE8E9] text-[#A82227]'}`}>
                  <span className="font-bold text-base w-5">{b.shortName}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floor selector – top right */}
      <div className="absolute top-24 right-4 z-20">
        <div className="relative">
          <button onClick={() => { setFloorOpen(!floorOpen); setBuildingOpen(false); setZoomOpen(false); }}
            className="bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2 border-2 border-[#A5968A] hover:bg-[#FCE8E9] transition-all">
            <div className="bg-[#A82227] p-1.5 rounded-lg">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[#A5968A] font-semibold uppercase leading-none">{t(language, 'floor')}</p>
              <p className="text-sm font-bold text-[#A82227] leading-tight">
                {getFloorLabel(currentBuilding, currentFloor)}
              </p>
            </div>
            <ChevronDown className={`h-3 w-3 text-[#A82227] transition-transform ${floorOpen ? 'rotate-180' : ''}`} />
          </button>

          {floorOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-[#A5968A] p-1.5 min-w-[160px]">
              {[...availableFloors].reverse().map(f => (
                <button key={f} onClick={() => { onFloorChange(f); setFloorOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 last:mb-0 flex items-center justify-between text-sm transition-all ${currentFloor === f ? 'bg-[#A82227] text-white font-bold' : 'hover:bg-[#FCE8E9] text-[#A82227]'}`}>
                  <span className="font-bold">{getFloorLabel(currentBuilding, f)}</span>
                  <span className={`text-xs ${currentFloor === f ? 'text-red-200' : 'text-gray-400'}`}>F{f}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zoom – bottom right (above bottom bar) */}
      <div className="absolute bottom-48 right-4 z-20">
        <div className="relative">
          <button onClick={() => { setZoomOpen(!zoomOpen); setBuildingOpen(false); setFloorOpen(false); }}
            className="bg-white rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2 border-2 border-[#A5968A] hover:bg-[#FCE8E9] transition-all">
            <div className="bg-[#A82227] p-1.5 rounded-lg">
              <Maximize2 className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[#A5968A] font-semibold uppercase leading-none">{t(language, 'zoom')}</p>
              <p className="text-sm font-bold text-[#A82227] leading-tight">{Math.round(scale * 100)}%</p>
            </div>
            <ChevronDown className={`h-3 w-3 text-[#A82227] transition-transform ${zoomOpen ? 'rotate-180' : ''}`} />
          </button>

          {zoomOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border-2 border-[#A5968A] p-2 min-w-[170px] space-y-1.5">
              <button onClick={onZoomIn}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#A5968A] text-[#A82227] hover:bg-[#FCE8E9] text-sm font-bold transition-colors">
                <ZoomIn className="h-4 w-4" /> {t(language, 'zoomIn')}
              </button>
              <button onClick={onZoomOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-[#A5968A] text-[#A82227] hover:bg-[#FCE8E9] text-sm font-bold transition-colors">
                <ZoomOut className="h-4 w-4" /> {t(language, 'zoomOut')}
              </button>
              <div className="border-t border-[#A5968A] pt-1.5">
                <button onClick={onZoomReset}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#A82227] text-white hover:bg-[#8B1C20] text-sm font-bold transition-colors">
                  <Maximize2 className="h-4 w-4" /> {t(language, 'resetView')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(buildingOpen || floorOpen || zoomOpen) && (
        <div className="fixed inset-0 z-10" onClick={closeAll} />
      )}
    </>
  );
}
