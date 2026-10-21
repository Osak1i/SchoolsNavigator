import { Menu, X } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  currentBuilding?: string;
  currentFloor?: string;
}

export function TopBar({ onMenuClick, isMenuOpen, currentBuilding, currentFloor }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#A82227] to-[#8B1C20] text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-full shadow flex-shrink-0" style={{ width: 44, height: 44 }}>
            <img src="/logo.png" alt="RTK logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">RTK Navigator</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-red-100">Rīgas Tehniskā Koledža</p>
              {currentBuilding && currentFloor && (
                <>
                  <span className="text-red-300">•</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    {currentBuilding} · {currentFloor}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onMenuClick}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
