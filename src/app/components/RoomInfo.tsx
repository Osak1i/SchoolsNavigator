import { X, MapPin, User, BookOpen, Navigation, Building2, Layers } from 'lucide-react';
import { Room } from '../types/map';
import { Language, t } from '../utils/translations';
import { buildings, getFloorLabel } from '../data/floorMaps';

interface Props {
  room: Room | null;
  onClose: () => void;
  onNavigate: (roomId: string) => void;
  language: Language;
}

export function RoomInfo({ room, onClose, onNavigate, language }: Props) {
  if (!room) return null;

  const buildingData = buildings.find(b => b.id === room.building);
  const floorLabel   = getFloorLabel(room.building, room.floor);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl border-t-2 border-[#A5968A] animate-slide-up">
      {/* drag handle */}
      <div className="w-12 h-1.5 bg-[#A5968A] rounded-full mx-auto mt-3 mb-4" />

      <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block bg-[#A82227] text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
              {t(language, 'roomNumber')} {room.number}
            </span>
            <h2 className="text-xl font-bold">{room.name}</h2>
          </div>
          <button onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info cards */}
        <div className="space-y-3 mb-5">
          {room.teacher && (
            <div className="flex items-center gap-3 bg-[#F5F1ED] p-3 rounded-xl">
              <div className="bg-[#FCE8E9] p-2 rounded-full">
                <User className="h-4 w-4 text-[#A82227]" />
              </div>
              <div>
                <p className="text-xs text-[#6B6159]">{t(language, 'teacher')}</p>
                <p className="font-semibold text-sm">{room.teacher}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#F5F1ED] p-3 rounded-xl">
            <div className="bg-[#FCE8E9] p-2 rounded-full">
              <BookOpen className="h-4 w-4 text-[#A82227]" />
            </div>
            <div>
              <p className="text-xs text-[#6B6159]">{t(language, 'purpose')}</p>
              <p className="font-semibold text-sm">{room.purpose || 'Classroom'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F5F1ED] p-3 rounded-xl">
            <div className="bg-[#FCE8E9] p-2 rounded-full">
              <Building2 className="h-4 w-4 text-[#A82227]" />
            </div>
            <div>
              <p className="text-xs text-[#6B6159]">{t(language, 'building')}</p>
              <p className="font-semibold text-sm">{buildingData?.name ?? room.building}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F5F1ED] p-3 rounded-xl">
            <div className="bg-[#FCE8E9] p-2 rounded-full">
              <Layers className="h-4 w-4 text-[#A82227]" />
            </div>
            <div>
              <p className="text-xs text-[#6B6159]">{t(language, 'floor')}</p>
              <p className="font-semibold text-sm">{floorLabel}</p>
            </div>
          </div>
        </div>

        {/* Navigate button */}
        <button onClick={() => onNavigate(room.id)}
          className="w-full h-14 flex items-center justify-center gap-2 text-base font-bold rounded-xl bg-[#A82227] hover:bg-[#8B1C20] text-white transition-colors shadow-md active:scale-95">
          <Navigation className="h-5 w-5" />
          {t(language, 'navigateHere')}
        </button>
      </div>
    </div>
  );
}
