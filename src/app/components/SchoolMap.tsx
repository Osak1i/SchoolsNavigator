import { Room, Node, PathSegment, FloorMap } from '../types/map';
import { useState, useRef, useEffect } from 'react';
import { getCachedSVG, getSVG } from '../utils/svgCache';

interface SchoolMapProps {
  rooms: Room[];
  nodes: Node[];
  selectedRoom: Room | null;
  onRoomClick: (room: Room) => void;
  path: PathSegment[];
  highlightedRooms: string[];
  scale: number;
  position: { x: number; y: number };
  onScaleChange: (s: number) => void;
  onPositionChange: (p: { x: number; y: number }) => void;
  currentBuilding: string;
  currentFloor: number;
  floorMap?: FloorMap;
  debugNodes?: boolean;
}

export function SchoolMap({
  rooms, nodes, selectedRoom, onRoomClick, path, highlightedRooms,
  scale, position, onScaleChange, onPositionChange,
  currentBuilding, currentFloor, floorMap,
  debugNodes = false,
}: SchoolMapProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgInner, setSvgInner] = useState<string | null>(null);
  const lastTouchDist = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const didDrag = useRef(false);

  const filteredNodes = nodes.filter(n => n.building === currentBuilding && n.floor === currentFloor);
  const filteredRooms = rooms.filter(r => r.building === currentBuilding && r.floor === currentFloor);

  // Path segments on this floor
  const pathSegsCurrent = path.filter(
    s => s.from.building === currentBuilding && s.from.floor === currentFloor
       && s.to.building === currentBuilding && s.to.floor === currentFloor
  );
  const pathNodesCurrent = Array.from(new Map(
    path.flatMap(s => [s.from, s.to])
      .filter(n => n.building === currentBuilding && n.floor === currentFloor)
      .map(n => [n.id, n])
  ).values());

  // ── Load SVG from cache (instant if preloaded, fetches once if not) ─────────
  useEffect(() => {
    if (!floorMap?.svgPath) { setSvgInner(null); return; }

    // Try the cache first — if it's already there, set instantly with no flash
    const cached = getCachedSVG(floorMap.svgPath);
    if (cached !== null) {
      setSvgInner(cached);
      return;
    }

    // Not cached yet (e.g. first load before preload finished) — fetch it now
    let cancelled = false;
    getSVG(floorMap.svgPath).then(inner => {
      if (!cancelled) setSvgInner(inner || null);
    });
    return () => { cancelled = true; };
  }, [floorMap?.svgPath]);

  // ── Pointer / touch handlers ──────────────────────────────────────────────
  const getXY = (e: React.MouseEvent | React.TouchEvent) =>
    'touches' in e
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onScaleChange(Math.min(Math.max(0.3, scale * (e.deltaY > 0 ? 0.9 : 1.1)), 8));
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length === 2) {
      lastTouchDist.current = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY);
      return;
    }
    didDrag.current = false;
    setIsDragging(true);
    const { x, y } = getXY(e);
    setDragStart({ x: x - position.x, y: y - position.y });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY);
      if (lastTouchDist.current)
        onScaleChange(Math.min(Math.max(0.3, scale * dist / lastTouchDist.current), 8));
      lastTouchDist.current = dist; return;
    }
    if (!isDragging) return;
    const { x, y } = getXY(e);
    const nx = x - dragStart.x, ny = y - dragStart.y;
    if (Math.abs(nx - position.x) > 3 || Math.abs(ny - position.y) > 3) didDrag.current = true;
    onPositionChange({ x: nx, y: ny });
  };

  const handlePointerUp = () => { setIsDragging(false); lastTouchDist.current = null; };

  const handleRoomClickInternal = (room: Room, e: React.MouseEvent) => {
    if (didDrag.current) { e.stopPropagation(); return; }
    onRoomClick(room);
  };

  useEffect(() => {
    const up = () => { setIsDragging(false); setDraggingNodeId(null); };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  const vb = floorMap?.viewBox ?? '0 0 200 150';
  // Parse viewBox to get dimensions for the SVG element
  const [,, vbW, vbH] = (vb.split(' ')).map(Number);

  // Marker radius scaled to ~2% of the smaller dimension for visibility
  const markerR = Math.min(vbW, vbH) * 0.022;
  const fontSize = markerR * 1.1;
  const strokeW  = markerR * 0.2;

  return (
    <div
      className="w-full h-full overflow-hidden bg-[#f0ede8] select-none"
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Transformed container - fills the div, then scale/pan */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px,${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.08s ease-out',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={vb}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'block',
          }}
        >
          {/* ── Background floor map ── */}
          {svgInner ? (
            <g dangerouslySetInnerHTML={{ __html: svgInner }} />
          ) : (
            <>
              <rect width={vbW} height={vbH} fill="#fafafa" />
              <text x={vbW/2} y={vbH/2} textAnchor="middle" fill="#ccc" fontSize={fontSize * 2}>
                {floorMap ? 'Loading map…' : 'No map available'}
              </text>
            </>
          )}

          {/* ── Path lines ── */}
          {pathSegsCurrent.map((seg, i) => (
            <line key={i}
              x1={seg.from.x} y1={seg.from.y}
              x2={seg.to.x}   y2={seg.to.y}
              stroke="#A82227" strokeWidth={strokeW * 2}
              strokeLinecap="round" strokeDasharray={`${markerR} ${markerR * 0.5}`}
              opacity="0.85"
            />
          ))}

          {/* ── Path waypoint dots ── */}
          {pathNodesCurrent.map(n => (
            <circle key={n.id} cx={n.x} cy={n.y} r={markerR * 0.6}
              fill="#A82227" stroke="white" strokeWidth={strokeW} opacity="0.9" />
          ))}

          {/* ── Room node markers with label ── */}
          {filteredNodes.filter(n => n.roomId).map(node => {
            const room = filteredRooms.find(r => r.id === node.roomId);
            if (!room) return null;
            const isSelected  = selectedRoom?.id === room.id;
            const isHighStart = highlightedRooms[0] === room.id;
            const isHighDest  = highlightedRooms[1] === room.id;
            const isHighlighted = isHighStart || isHighDest;

            const bgColor = isHighDest  ? '#A82227'
                          : isHighStart ? '#A5968A'
                          : isSelected  ? '#D93943'
                          : '#ffffff';
            const textColor = (isHighlighted || isSelected) ? '#ffffff' : '#1a1a1a';
            const borderColor = isHighlighted ? 'white'
                              : isSelected    ? '#A82227'
                              : '#A82227';

            // Badge pill width based on room number length
            const label = room.number;
            const pillW = Math.max(markerR * 2.5, label.length * fontSize * 0.65 + markerR);
            const pillH = markerR * 1.6;

            return (
              <g key={node.id}
                onClick={e => handleRoomClickInternal(room, e)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring for selected */}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r={markerR * 2.2}
                    fill="none" stroke="#A82227" strokeWidth={strokeW}
                    opacity="0.4">
                    <animate attributeName="r" values={`${markerR*1.8};${markerR*2.8};${markerR*1.8}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Room badge pill */}
                <rect
                  x={node.x - pillW / 2}
                  y={node.y - pillH / 2}
                  width={pillW} height={pillH}
                  rx={pillH / 2}
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={strokeW * 0.8}
                  filter={isSelected ? 'url(#shadow)' : undefined}
                />

                {/* Room number */}
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={textColor}
                  fontSize={fontSize * 0.8}
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                  pointerEvents="none"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* ── Debug mode: show all nodes with ID and coords ── */}
          {debugNodes && filteredNodes.map(node => {
            const color =
              node.type === 'entrance'  ? '#22c55e' :  // green
              node.type === 'staircase' ? '#3b82f6' :  // blue
              node.type === 'hallway'   ? '#f97316' :  // orange
                                         '#8b5cf6';    // purple = room node
            return (
              <g key={`dbg-${node.id}`}>
                {/* Dot */}
                <circle cx={node.x} cy={node.y} r={markerR * 0.8}
                  fill={color} stroke="white" strokeWidth={strokeW * 0.5} opacity={0.9} />
                {/* Node ID above */}
                <text x={node.x} y={node.y - markerR - fontSize * 0.1}
                  textAnchor="middle" fill={color}
                  fontSize={fontSize * 0.5} fontWeight="bold"
                  stroke="white" strokeWidth={fontSize * 0.12} paintOrder="stroke"
                  pointerEvents="none">
                  {node.id}
                </text>
                {/* Coordinates below */}
                <text x={node.x} y={node.y + markerR + fontSize * 0.6}
                  textAnchor="middle" fill="#374151"
                  fontSize={fontSize * 0.42}
                  stroke="white" strokeWidth={fontSize * 0.1} paintOrder="stroke"
                  pointerEvents="none">
                  ({node.x}, {node.y})
                </text>
              </g>
            );
          })}

          {/* Drop shadow filter */}
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
