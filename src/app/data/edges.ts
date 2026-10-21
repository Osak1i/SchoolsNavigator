import { Edge } from '../types/map';

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION EDGES
//
// Each edge connects two nodes with a walking distance (cost).
// Dijkstra uses these costs to find the shortest path.
// Edges are undirected — adding one edge covers both directions.
//
// Naming conventions:
//   entrance / stair-*   — special connection points
//   h1-v* / h2-*         — vertical / horizontal hallway chains (floor 1)
//   h1-c* / h1-b*        — corridor-above and bottom-corridor chains (floor 1)
//   hall-b*              — hallway nodes on floors 2, 3
//   hall-b2-*            — hallway nodes in Laboratorijas korpuss
// ─────────────────────────────────────────────────────────────────────────────

// Shorthand helper — keeps edge definitions compact
function edge(from: string, to: string, distance: number): Edge {
  return { from, to, distance }; // uz, no, nez par to distance???
}

export const edges: Edge[] = [

  //sakums (junc) 1 stavs
  edge('entrance','h1-junc',12),

  // b hallway (right)
  edge('h1-junc','h1-b1',10),
  edge('h1-b1','n-b1-info',12),
  edge('h1-b1','n-b1-114',12),
  edge('h1-b1','h1-b2',10),
  edge('h1-b2','n-b1-115',12),
  edge('h1-b2','h1-b3',10),
  edge('h1-b3','n-b1-116',12),
  edge('h1-b3','h1-b4',10),
  edge('h1-b4','n-b1-117',12),
  edge('h1-b4','h1-b5',10),
  edge('h1-b5','n-b1-118',12),
  edge('h1-b5','h1-b6',10),
  edge('h1-b6','n-b1-119',12),
  edge('h1-b6','h1-b7',10),
  edge('h1-b7','n-b1-120',12),
  edge('h1-b7','n-b1-WC1',12),
  edge('h1-b7','h1-upper-r1',10),
  edge('h1-upper-r1','stair-b1-1-right',12),
  // a hallway (up)
  edge('h1-junc','h1-a1',12),
  edge('h1-a1', 'stair-b1-main',12),
  edge('h1-a1','h1-a2',27),
  edge('h1-a2','n-b1-101',12),
  edge('h1-a2','n-b1-113',12),
  edge('h1-a2','h1-a3',22),
  edge('h1-a3','n-b1-102',12),
  edge('h1-a3','h1-a4',23),
  edge('h1-a4','n-b1-103',12),
  edge('h1-a4','n-b1-112',12),
  edge('h1-a4','h1-a5',25),
  edge('h1-a5','n-b1-104',27),
  edge('h1-a5','n-b1-110',27),
  edge('h1-a5','h1-a6',27),
  edge('h1-a6','n-b1-105',27),
  edge('h1-a6','n-b1-111',27),
  edge('h1-a6','h1-a7',27),
  edge('h1-a7','n-b1-106',27),
  edge('h1-a7','h1-a8',27),
  edge('h1-a8','n-b1-107',27),
  edge('h1-a8','h1-top',12),
  edge('h1-top','stair-b1-1',12),

  //2. stavs
  //stairway
  edge('stair-b1-main','stair-b1-main2',12),
  edge('stair-b1-1-right','stair-b1-2-right',12),
  edge('stair-b1-2-right','glass-bridge',12),
  //hallway
  edge('stair-b1-main2','h2-junc',12),
  // a hallway (up)
  edge('h2-junc','h2-a1',12),
  edge('h2-a1', 'h2-a2',12),
  // b hallway (right)
  edge('h2-junc','h2-b1',12),
  edge('h2-b1','n-b1-261',12),
  edge('h2-b1','h2-b2',12),
  edge('h2-b2','h2-b3',12),
  edge('h2-b3','n-b1-266',12),
  edge('h2-b3','h2-b4',12),
  edge('h2-b4','n-b1-269',12),
  edge('h2-b4','h2-b5',12),
  edge('h2-b5','stair-b1-2-right',12),
  edge('h2-b5','glass-bridge',12),
  //edge('h2-b4','h2-b5',12),

  //3. stavs
  //stairway
  edge('stair-b1-main2','stair-b1-main3',12),
  edge('stair-b1-2-right','stair-b1-3-right',12),
  //hallway
  edge('stair-b1-main3','h3-junc',12),
  // b hallway (right)
  edge('h3-junc','h3-b1',12),
  edge('h3-junc','h3-b2-2',12),
  edge('h3-b2-2','n-b1-351',12),
  edge('h3-b1','h3-b2-1',12),
  edge('h3-b1','n-b1-358',12),
  edge('h3-b2-1','n-b1-356',12),
  edge('h3-b1','h3-b2',12),
  edge('h3-b2','n-b1-362',12),
  edge('h3-b2','h3-b3',12),
  edge('h3-b3','n-b1-363',12),
  edge('h3-b3','h3-b4',12),
  edge('h3-b4','n-b1-364',12),
  edge('h3-b4','h3-b5',12),
  edge('h3-b5','n-b1-365',12),
  edge('h3-b5','h3-b6',12),
  edge('h3-b6','n-b1-366',12),
  edge('h3-b6','h3-b7',12),
  edge('h3-b7','stair-b1-3-right',12),




  
 
  // B2 F1
  //
  // B2 F2
  edge('glass-bridge','glass-bridge-2',12),
  edge('glass-bridge-2','h4-b1',12),
  edge('h4-b1','stair-b2-2',12),
  edge('h4-b1','h4-b2',12),
  edge('h4-b2','h4-b2-1',12), edge('h4-b2-1','n-b2-202',12),
  edge('h4-b2','h4-b2-2',12), edge('h4-b2-2','n-b2-230',12),
  edge('h4-b2','h4-b3',12),
  edge('h4-b3','h4-b3-1',12), edge('h4-b3-1','n-b2-203',12),
  edge('h4-b3','h4-b3-2',12), edge('h4-b3-2','n-b2-229',12),
  edge('h4-b3','h4-b4',12),
  edge('h4-b4','h4-b4-1',12), edge('h4-b4-1','n-b2-204',12),
  edge('h4-b4','h4-b5',12),
  edge('h4-b5','h4-b5-1',12), edge('h4-b5-1','n-b2-205',12),
  edge('h4-b5','h4-b6',12),
  edge('h4-b6','h4-b6-1',12), edge('h4-b6-1','n-b2-227',12),
  edge('h4-b6','h4-b7',12),
  edge('h4-b7','h4-b7-1',12), edge('h4-b7-1','n-b2-208',12),
  edge('h4-b7','h4-b8',12),
  edge('h4-b8','h4-b8-1',12), edge('h4-b8-1','n-b2-209',12),
  edge('h4-b8','h4-b9',12),
  edge('h4-b9','h4-b9-1',12), edge('h4-b9-1','n-b2-210',12),
  edge('h4-b9','h4-b10',12),
  edge('h4-b10','h4-b10-1',12), edge('h4-b10-1','n-b2-224',12),
  edge('h4-b10','h4-b10-2',12), edge('h4-b10-2','n-b2-223',12),
  edge('h4-b10','h4-b11',12),
  edge('h4-b11','h4-b11-1',12), edge('h4-b11-1','n-b2-211',12),
  edge('h4-b11','h4-b11-2',12), edge('h4-b11-2','n-b2-222',12),
  edge('h4-b11','h4-b12',12),
  edge('h4-b12','h4-b12-1',12), edge('h4-b12-1','n-b2-212',12),
  edge('h4-b12','h4-b13',12),
  edge('h4-b13','h4-b13-1',12), edge('h4-b13-1','n-b2-213',12),
  edge('h4-b13','h4-b13-2',12), edge('h4-b13-2','n-b2-221',12),
  edge('h4-b13','h4-b13-3',12), edge('h4-b13-3','n-b2-220',12),
  edge('h4-b13','h4-b14',12),
  edge('h4-b14','h4-b15',12),
  edge('h4-b15','h4-b15-1',12), edge('h4-b15-1','n-b2-219',12),
  edge('h4-b15','h4-b15-2',12), edge('h4-b15-2','n-b2-218',12),
  edge('h4-b15','h4-b16',12),
  edge('h4-b16','h4-b16-1',12), edge('h4-b16-1','n-b2-215',12),
  edge('h4-b16','h4-b17',12),
  edge('h4-b17','n-b2-216',12),

  
  // B2 F3
  edge('stair-b2-3','hall-b2-3-a',12),
  edge('hall-b2-3-a','n-b2-302',10), edge('hall-b2-3-a','n-b2-303',8), edge('hall-b2-3-a','n-b2-307',8),
  edge('hall-b2-3-a','n-b2-308',8), edge('hall-b2-3-a','n-b2-309',12), edge('hall-b2-3-a','n-b2-310',10),
  edge('hall-b2-3-a','n-b2-315',10), edge('hall-b2-3-a','n-b2-316',15), edge('hall-b2-3-a','n-b2-317',8),
  edge('hall-b2-3-a','n-b2-318',20), edge('hall-b2-3-a','n-b2-319',18), edge('hall-b2-3-a','n-b2-320',15),
  edge('hall-b2-3-a','n-b2-321',8), edge('hall-b2-3-a','n-b2-323',12), edge('hall-b2-3-a','n-b2-324',12),
  edge('hall-b2-3-a','n-b2-325',15), edge('stair-b2-3','stair-b2-4',20),
  // B2 F4
  edge('stair-b2-4','hall-b2-4-a',12),
  edge('hall-b2-4-a','n-b2-402',15), edge('hall-b2-4-a','n-b2-403',8), edge('hall-b2-4-a','n-b2-404',12),
  edge('hall-b2-4-a','n-b2-408',8), edge('hall-b2-4-a','n-b2-409',8), edge('hall-b2-4-a','n-b2-410',12),
  edge('hall-b2-4-a','n-b2-411',15), edge('hall-b2-4-a','n-b2-412',8), edge('hall-b2-4-a','n-b2-415',45),
  edge('hall-b2-4-a','n-b2-416',25), edge('hall-b2-4-a','n-b2-417',12), edge('hall-b2-4-a','n-b2-418',30),
  edge('hall-b2-4-a','n-b2-419',8), edge('hall-b2-4-a','n-b2-420',8), edge('hall-b2-4-a','n-b2-421',8),
  edge('hall-b2-4-a','n-b2-422',12), edge('hall-b2-4-a','n-b2-423',25), edge('hall-b2-4-a','n-b2-424',8),
  edge('hall-b2-4-a','n-b2-425',12), edge('hall-b2-4-a','n-b2-426',10), edge('hall-b2-4-a','n-b2-427',18),
  edge('stair-b2-4','stair-b2-5',20),
  // B2 F5
  edge('stair-b2-5','hall-b2-5-a',12),
  edge('hall-b2-5-a','n-b2-502',8), edge('hall-b2-5-a','n-b2-503',8), edge('hall-b2-5-a','n-b2-504',8),
  edge('hall-b2-5-a','n-b2-506',8), edge('hall-b2-5-a','n-b2-507',8), edge('hall-b2-5-a','n-b2-509',10),
  edge('hall-b2-5-a','n-b2-510',10), edge('hall-b2-5-a','n-b2-511',22), edge('hall-b2-5-a','n-b2-512',8),
  edge('hall-b2-5-a','n-b2-515',10), edge('hall-b2-5-a','n-b2-516',28), edge('hall-b2-5-a','n-b2-517',10),
  edge('hall-b2-5-a','n-b2-518',8), edge('hall-b2-5-a','n-b2-519',12), edge('hall-b2-5-a','n-b2-520',38),
  edge('hall-b2-5-a','n-b2-521',8), edge('hall-b2-5-a','n-b2-522',25), edge('hall-b2-5-a','n-b2-523',35),
  edge('hall-b2-5-a','n-b2-524',8), edge('hall-b2-5-a','n-b2-525',8), edge('hall-b2-5-a','n-b2-526',12),
  edge('hall-b2-5-a','n-b2-527',15), edge('stair-b2-5','stair-b2-6',20),
  // B2 F6
  edge('stair-b2-6','hall-b2-6-a',10),
  edge('hall-b2-6-a','n-b2-602',15), edge('hall-b2-6-a','n-b2-603',8), edge('hall-b2-6-a','n-b2-604',15),
  edge('hall-b2-6-a','n-b2-605',8), edge('hall-b2-6-a','n-b2-606',8), edge('hall-b2-6-a','n-b2-608',12),
  edge('hall-b2-6-a','n-b2-609',15), edge('hall-b2-6-a','n-b2-610',12), edge('hall-b2-6-a','n-b2-611',8),
  edge('hall-b2-6-a','n-b2-614',48), edge('hall-b2-6-a','n-b2-615',25), edge('hall-b2-6-a','n-b2-616',12),
  edge('hall-b2-6-a','n-b2-617',20), edge('hall-b2-6-a','n-b2-618',10), edge('hall-b2-6-a','n-b2-619',8),
  edge('hall-b2-6-a','n-b2-620',8), edge('hall-b2-6-a','n-b2-621',15), edge('hall-b2-6-a','n-b2-622',8),
  edge('hall-b2-6-a','n-b2-623',12), edge('hall-b2-6-a','n-b2-624',10), edge('hall-b2-6-a','n-b2-625',20),
  edge('hall-b2-6-a','n-b2-626',8),

   // B1 Workshop
   edge('stair-b1-4','hall-b1-4-a',10),
   edge('hall-b1-4-a','n-b1-w1',10), edge('hall-b1-4-a','n-b1-w4',8), edge('hall-b1-4-a','n-b1-w5',10),
   edge('hall-b1-4-a','n-b1-w6',8), edge('hall-b1-4-a','n-b1-w7',20), edge('hall-b1-4-a','n-b1-w8',10),
   edge('hall-b1-4-a','n-b1-w10',10), edge('hall-b1-4-a','n-b1-w11',15), edge('hall-b1-4-a','n-b1-w12',20),
   edge('hall-b1-4-a','n-b1-w13',40), edge('hall-b1-4-a','n-b1-w14',15), edge('hall-b1-4-a','n-b1-w15',40),
   edge('hall-b1-4-a','n-b1-w17',50), edge('hall-b1-4-a','n-b1-w2',30),

];
