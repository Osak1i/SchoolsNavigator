import { useState, useCallback, useEffect, useRef } from 'react';
import { SchoolMap }     from './components/SchoolMap';
import { TopBar }        from './components/TopBar';
import { BottomControls }from './components/BottomControls';
import { RoomInfo }      from './components/RoomInfo';
import { RoomSelector }  from './components/RoomSelector';
import { MapControls }   from './components/MapControls';
import { MenuDrawer }    from './components/MenuDrawer';
import { rooms as allRooms, nodes as initialNodes, edges } from './data/schoolData';
import { buildings, getFloorMap, getFloorLabel } from './data/floorMaps';
import { findShortestPath } from './utils/pathfinding';
import { Room, PathSegment } from './types/map';
import { Language, t } from './utils/translations';

type SelectorMode = 'start' | 'destination' | null;

// How many milliseconds to wait before revealing the next path segment
const STEP_DELAY_MS = 1000;

function App() {
  const [selectedRoom,    setSelectedRoom]    = useState<Room | null>(null);
  const [startRoom,       setStartRoom]       = useState<string | null>('entrance');
  const [destRoom,        setDestRoom]        = useState<string | null>(null);

  // fullPath = the complete computed path, never trimmed
  // visiblePath = the portion drawn so far during animation
  const [fullPath,        setFullPath]        = useState<PathSegment[]>([]);
  const [visiblePath,     setVisiblePath]     = useState<PathSegment[]>([]);
  const [isAnimating,     setIsAnimating]     = useState(false);

  const [selectorMode,    setSelectorMode]    = useState<SelectorMode>(null);
  const [isMenuOpen,      setIsMenuOpen]      = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState('building1');
  const [currentFloor,    setCurrentFloor]    = useState(1);
  const [scale,           setScale]           = useState(1);
  const [position,        setPosition]        = useState({ x: 0, y: 0 });
  const [language,        setLanguage]        = useState<Language>('en');
  const [debugNodes,      setDebugNodes]      = useState(false);

  // Refs for the animation timer so we can cancel it if a new path starts
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animStepRef  = useRef(0);

  // ── Cancel any running animation ──────────────────────────────────────────
  const cancelAnimation = () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setIsAnimating(false);
  };

  // ── Animate path segment by segment ───────────────────────────────────────
  const animatePath = useCallback((segments: PathSegment[]) => {
    cancelAnimation();
    if (segments.length === 0) { setVisiblePath([]); return; }

    setVisiblePath([]);
    setIsAnimating(true);
    animStepRef.current = 0;

    // Start from the beginning — show the map for the first segment's floor
    const first = segments[0];
    setCurrentBuilding(first.from.building);
    setCurrentFloor(first.from.floor);

    const reveal = (step: number) => {
      if (step >= segments.length) {
        setIsAnimating(false);
        return;
      }

      const seg = segments[step];

      // When a segment crosses to a new floor/building, switch the view first,
      // then draw that segment after a short pause so the user sees the floor change
      setCurrentBuilding(seg.from.building);
      setCurrentFloor(seg.from.floor);

      setVisiblePath(segments.slice(0, step + 1));

      animTimerRef.current = setTimeout(() => reveal(step + 1), STEP_DELAY_MS);
    };

    // Small initial delay so the view settles before drawing starts
    animTimerRef.current = setTimeout(() => reveal(0), 150);
  }, []);

  // ── Pathfinding ───────────────────────────────────────────────────────────
  const computePath = useCallback((start: string | null, dest: string | null) => {
    cancelAnimation();
    if (!start || !dest) { setFullPath([]); setVisiblePath([]); return; }
    const startNodeId = start === 'entrance'
      ? 'entrance'
      : allRooms.find(r => r.id === start)?.nodeId;
    const destNodeId = allRooms.find(r => r.id === dest)?.nodeId;
    if (startNodeId && destNodeId) {
      const segments = findShortestPath(startNodeId, destNodeId, initialNodes, edges);
      setFullPath(segments);
      animatePath(segments);
    } else {
      setFullPath([]);
      setVisiblePath([]);
    }
  }, [animatePath]);

  const handleStartChange = (roomId: string) => {
    setStartRoom(roomId);
    computePath(roomId, destRoom);
  };

  const handleDestChange = (roomId: string) => {
    setDestRoom(roomId);
    computePath(startRoom, roomId);
  };

  const handleNavigate = (roomId: string) => {
    setSelectedRoom(null);
    handleDestChange(roomId);
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setCurrentBuilding(room.building);
    setCurrentFloor(room.floor);
  };

  const handleSelectorSelect = (roomId: string) => {
    if (selectorMode === 'start')            handleStartChange(roomId);
    else if (selectorMode === 'destination') handleDestChange(roomId);
    setSelectorMode(null);
  };

  const handleClearPath = () => {
    cancelAnimation();
    setFullPath([]);
    setVisiblePath([]);
    setStartRoom('entrance');
    setDestRoom(null);
  };

  const handleBuildingChange = (id: string) => {
    setCurrentBuilding(id);
    const b = buildings.find(b => b.id === id);
    setCurrentFloor(b?.floors.includes(1) ? 1 : (b?.floors[0] ?? 1));
    setSelectedRoom(null);
  };

  const handleZoomIn    = () => setScale(s => Math.min(s * 1.25, 5));
  const handleZoomOut   = () => setScale(s => Math.max(s / 1.25, 0.3));
  const handleZoomReset = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  // Clean up timer on unmount
  useEffect(() => () => { if (animTimerRef.current) clearTimeout(animTimerRef.current); }, []);

  const highlightedRooms = [startRoom, destRoom]
    .filter((id): id is string => !!id && id !== 'entrance');

  const floorMap          = getFloorMap(currentBuilding, currentFloor);
  const buildingShortName = buildings.find(b => b.id === currentBuilding)?.shortName;
  const floorLabel        = getFloorLabel(currentBuilding, currentFloor);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-100">
      {/* Top bar */}
      <TopBar
        onMenuClick={() => setIsMenuOpen(v => !v)}
        isMenuOpen={isMenuOpen}
        currentBuilding={buildingShortName}
        currentFloor={floorLabel}
      />

      {/* Map */}
      <div className="absolute inset-0 pt-[72px] pb-[148px]">
        <SchoolMap
          rooms={allRooms}
          nodes={initialNodes}
          selectedRoom={selectedRoom}
          onRoomClick={handleRoomClick}
          path={visiblePath}
          highlightedRooms={highlightedRooms}
          scale={scale}
          position={position}
          onScaleChange={setScale}
          onPositionChange={setPosition}
          currentBuilding={currentBuilding}
          currentFloor={currentFloor}
          floorMap={floorMap}
          debugNodes={debugNodes}
        />
      </div>

      {/* Animating indicator */}
      {isAnimating && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30
                        bg-[#A82227] text-white text-xs font-semibold
                        px-4 py-1.5 rounded-full shadow-lg pointer-events-none
                        flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          Navigating…
        </div>
      )}

      {/* Bottom controls */}
      <BottomControls
        rooms={allRooms}
        startRoom={startRoom}
        destinationRoom={destRoom}
        hasActivePath={fullPath.length > 0}
        pathSteps={fullPath.length}
        onStartClick={() => { setSelectorMode('start'); setSelectedRoom(null); setIsMenuOpen(false); }}
        onDestinationClick={() => { setSelectorMode('destination'); setSelectedRoom(null); setIsMenuOpen(false); }}
        onClearPath={handleClearPath}
        language={language}
      />

      {/* Map controls */}
      <MapControls
        currentBuilding={currentBuilding}
        onBuildingChange={handleBuildingChange}
        currentFloor={currentFloor}
        onFloorChange={f => { setCurrentFloor(f); setSelectedRoom(null); }}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        language={language}
      />

      {/* Room info panel */}
      {selectedRoom && (
        <RoomInfo
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onNavigate={handleNavigate}
          language={language}
        />
      )}

      {/* Room selector modal */}
      {selectorMode && (
        <RoomSelector
          rooms={allRooms}
          title={t(language, selectorMode === 'start' ? 'selectStartingPoint' : 'selectDestination')}
          onSelect={handleSelectorSelect}
          onClose={() => setSelectorMode(null)}
          allowEntrance={selectorMode === 'start'}
          language={language}
        />
      )}

      {/* Menu drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Debug node overlay toggle */}
      <button hidden
        onClick={() => setDebugNodes(v => !v)}
        className={`absolute bottom-52 left-4 z-20 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
          debugNodes
            ? 'bg-orange-500 text-white border-orange-600'
            : 'bg-white text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-500'
        }`}
      >
        {debugNodes ? '◉ Nodes ON' : '○ Nodes'}
      </button>
    </div>
  );
}

export default App;
