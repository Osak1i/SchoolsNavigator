import { MapPin, Navigation, Locate, X } from 'lucide-react';
import { Room } from '../types/map';
import { Language } from '../utils/translations';
import { t } from '../utils/translations';

interface Props {
  rooms: Room[];
  startRoom: string | null;
  destinationRoom: string | null;
  hasActivePath: boolean;
  pathSteps: number;
  onStartClick: () => void;
  onDestinationClick: () => void;
  onClearPath: () => void;
  language: Language;
}

export function BottomControls({ rooms, startRoom, destinationRoom, hasActivePath, pathSteps,
  onStartClick, onDestinationClick, onClearPath, language }: Props) {

  const startData = startRoom === 'entrance'
    ? { number: 'Ieeja', name: t(language, 'mainEntrance') }
    : rooms.find(r => r.id === startRoom);
  const destData = rooms.find(r => r.id === destinationRoom);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-[#A5968A] px-4 pt-3 pb-4 shadow-2xl">
      <div className="space-y-2">
        {/* Start */}
        <button onClick={onStartClick}
          className="w-full flex items-center gap-3 bg-[#F5F1ED] border-2 border-[#A5968A] rounded-xl p-3 active:bg-[#E8E1D9] transition-colors">
          <div className="bg-[#A5968A] p-2 rounded-full flex-shrink-0">
            <Locate className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs text-[#6B6159] font-medium">{t(language, 'start')}</p>
            <p className="font-semibold text-gray-900 truncate">
              {startData ? `${startData.number} · ${startData.name}` : t(language, 'selectStartingPoint')}
            </p>
          </div>
          <MapPin className="h-5 w-5 text-[#A5968A] flex-shrink-0" />
        </button>

        {/* Destination */}
        <button onClick={onDestinationClick}
          className="w-full flex items-center gap-3 bg-[#FCE8E9] border-2 border-[#A82227] rounded-xl p-3 active:bg-[#F8D4D5] transition-colors">
          <div className="bg-[#A82227] p-2 rounded-full flex-shrink-0">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs text-[#8B1C20] font-medium">{t(language, 'destination')}</p>
            <p className="font-semibold text-gray-900 truncate">
              {destData ? `${destData.number} · ${destData.name}` : t(language, 'selectDestination')}
            </p>
          </div>
          <MapPin className="h-5 w-5 text-[#A82227] flex-shrink-0" />
        </button>

        {/* Path info + clear */}
        {hasActivePath && (
          <div className="flex gap-2">
            <div className="flex-1 bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-green-700">
                {t(language, 'routeFound')} · {pathSteps} {t(language, 'steps')}
              </span>
            </div>
            <button onClick={onClearPath}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 border-[#A5968A] text-[#A82227] bg-white hover:bg-[#F5F1ED] transition-colors text-sm font-semibold">
              <X className="h-4 w-4" />
              {t(language, 'clearPath')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
