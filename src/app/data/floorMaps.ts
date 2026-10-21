import { FloorMap } from '../types/map';

export const floorMaps: FloorMap[] = [
  // ── Building 1 (Administratīvais korpuss) ───────────────────────────────
  {
    building: 'building1', floor: 1,
    svgPath: '/maps/first_floor.svg',
    viewBox: '0 0 193.38676 142.85999',
    width: 820, height: 607,
    label: 'Pirmais stāvs',
  },
  {
    building: 'building1', floor: 2,
    svgPath: '/maps/second_floor.svg',
    viewBox: '0 0 147.70946 102.16218',
    width: 820, height: 567,
    label: 'Otrais stāvs',
  },
  {
    building: 'building1', floor: 3,
    svgPath: '/maps/third_floor.svg',
    viewBox: '0 0 196.10695 132.3205',
    width: 820, height: 553,
    label: 'Trešais stāvs',
  },
  // ── Building 2 (Laboratorijas korpuss) ──────────────────────────────────
  {
    building: 'building2', floor: 1,
    svgPath: '/maps/main_entrance_floor.svg',
    viewBox: '0 0 163.93431 128.06915',
    width: 820, height: 640,
    label: 'Laboratorijas pirmais stāvs',
  },
  {
    building: 'building2', floor: 2,
    svgPath: '/maps/2_second_floor.svg',
    viewBox: '0 0 204.06416 50.183506',
    width: 820, height: 201,
    label: 'Laboratorijas otrais stāvs',
  },
  {
    building: 'building2', floor: 3,
    svgPath: '/maps/2_third_floor.svg',
    viewBox: '0 0 204.06454 41.882462',
    width: 820, height: 168,
    label: 'Laboratorijas trešais stāvs',
  },
  {
    building: 'building2', floor: 4,
    svgPath: '/maps/2_fourth_floor.svg',
    viewBox: '0 0 204.05577 41.879887',
    width: 820, height: 168,
    label: 'Laboratorijas ceturtais stāvs',
  },
  {
    building: 'building2', floor: 5,
    svgPath: '/maps/2_fifth_floor.svg',
    viewBox: '0 0 204.05576 41.879757',
    width: 820, height: 168,
    label: 'Laboratorijas piektais stāvs',
  },
  {
    building: 'building2', floor: 6,
    svgPath: '/maps/2_sixth_floor.svg',
    viewBox: '0 0 204.05612 42.122841',
    width: 820, height: 169,
    label: 'Laboratorijas sestais stāvs',
  },
  // ── Building 3 (Darbnīcas korpuss) ──────────────────────────────────────
  {
    building: 'building3', floor: 1,
    svgPath: '/maps/workshop_floor.svg',
    viewBox: '0 0 172.02931 203.28624',
    width: 560, height: 660,
    label: 'Darbnīcas',
  },
];

export function getFloorMap(building: string, floor: number): FloorMap | undefined {
  return floorMaps.find(m => m.building === building && m.floor === floor);
}

export const buildings = [
  { id: 'building1', name: 'Administratīvais korpuss', shortName: 'A', floors: [1, 2, 3], floorLabels: ['Pirmais stāvs', 'Otrais stāvs', 'Trešais stāvs'] },
  { id: 'building2', name: 'Laboratorijas korpuss',    shortName: 'B', floors: [1, 2, 3, 4, 5, 6], floorLabels: ['Pirmais stāvs', 'Otrais stāvs', 'Trešais stāvs', 'Ceturtais stāvs', 'Piektais stāvs', 'Sestais stāvs'] },
  { id: 'building3', name: 'Darbnīcas korpuss',        shortName: 'D', floors: [1], floorLabels: ['Darbnīcas'] },
];

export function getFloorLabel(building: string, floor: number): string {
  const b = buildings.find(x => x.id === building);
  if (!b) return `Floor ${floor}`;
  const idx = b.floors.indexOf(floor);
  return idx >= 0 ? b.floorLabels[idx] : `Floor ${floor}`;
}
