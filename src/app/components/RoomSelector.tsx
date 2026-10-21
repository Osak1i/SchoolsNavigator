import { useState, useMemo } from 'react';
import { MapPin, Search, Building2, Layers } from 'lucide-react';
import { Room } from '../types/map';
import { Language, t } from '../utils/translations';
import { buildings, getFloorLabel } from '../data/floorMaps';

interface Props {
  rooms: Room[];
  title: string;
  onSelect: (roomId: string) => void;
  onClose: () => void;
  allowEntrance?: boolean;
  language: Language;
}

export function RoomSelector({ rooms, title, onSelect, onClose, allowEntrance = false, language }: Props) {
  const [search, setSearch] = useState('');
  const [filterBuilding, setFilterBuilding] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rooms.filter(r => {
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.number.toLowerCase().includes(q) ||
        r.teacher.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q);
      const matchBuilding = filterBuilding === 'all' || r.building === filterBuilding;
      return matchSearch && matchBuilding;
    });
  }, [rooms, search, filterBuilding]);

  const grouped = useMemo(() => {
    const map = new Map<string, Room[]>();
    for (const r of filtered) {
      const key = `${r.building}-${r.floor}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [filtered]);

  const select = (id: string) => { onSelect(id); onClose(); };

  return (
    <div className="absolute inset-0 z-40 bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-[#A5968A] rounded-full mx-auto mt-3 mb-2" />

        <div className="px-5 pb-2">
          <h2 className="text-xl font-bold text-[#A82227] mb-3">{title}</h2>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t(language, 'searchRooms')}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-[#A5968A] rounded-xl text-sm focus:border-[#A82227] focus:outline-none" />
          </div>

          {/* Building filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setFilterBuilding('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterBuilding === 'all' ? 'bg-[#A82227] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE8E9]'}`}>
              All
            </button>
            {buildings.map(b => (
              <button key={b.id} onClick={() => setFilterBuilding(b.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterBuilding === b.id ? 'bg-[#A82227] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#FCE8E9]'}`}>
                <Building2 className="h-3 w-3" />
                {b.shortName} – {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-1">
          {/* Entrance option */}
          {allowEntrance && !search && filterBuilding === 'all' && (
            <button onClick={() => select('entrance')}
              className="w-full flex items-center gap-3 p-3 bg-[#F5F1ED] border-2 border-[#A5968A] rounded-xl hover:bg-[#E8E1D9] transition-colors mb-2">
              <div className="bg-[#A5968A] text-white px-2 py-1 rounded-lg text-xs font-bold">ENTRY</div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{t(language, 'mainEntrance')}</p>
                <p className="text-xs text-gray-500">{t(language, 'schoolEntryPoint')}</p>
              </div>
              <MapPin className="h-4 w-4 text-[#A5968A]" />
            </button>
          )}

          {/* Grouped rooms */}
          {grouped.size === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">{t(language, 'noRoomsFound')}</p>
          ) : (
            Array.from(grouped.entries()).map(([key, groupRooms]) => {
              const [bldg, floorStr] = key.split('-');
              const floor = parseInt(floorStr);
              const bData = buildings.find(b => b.id === bldg);
              return (
                <div key={key} className="mb-3">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <Building2 className="h-3 w-3 text-[#A5968A]" />
                    <span className="text-xs font-bold text-[#A5968A] uppercase tracking-wide">
                      {bData?.shortName} · {getFloorLabel(bldg, floor)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {groupRooms.map(room => (
                      <button key={room.id} onClick={() => select(room.id)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-[#FCE8E9] hover:border-[#A82227] active:bg-[#F8D4D5] transition-colors">
                        <div className="bg-[#A82227] text-white px-2 py-1 rounded-lg text-xs font-bold min-w-[2.5rem] text-center">
                          {room.number}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-sm truncate">{room.name}</p>
                          {room.teacher && <p className="text-xs text-gray-500 truncate">{room.teacher}</p>}
                        </div>
                        <MapPin className="h-4 w-4 text-[#A82227] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
