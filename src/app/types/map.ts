export interface Room {
  id: string;
  number: string;
  name: string;
  teacher: string;
  purpose: string;
  nodeId: string;
  building: string;  // 'building1' | 'building2'
  floor: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  roomId?: string;
  building: string;
  floor: number;
  type?: 'room' | 'hallway' | 'staircase' | 'entrance';
}

export interface Edge {
  from: string;
  to: string;
  distance: number;
}

export interface PathSegment {
  from: Node;
  to: Node;
}

export interface FloorMap {
  building: string;
  floor: number;
  svgPath: string;
  viewBox: string;
  width: number;
  height: number;
  label: string;
}

export type Language = 'en' | 'lv';
