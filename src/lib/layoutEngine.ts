export interface LayoutPoint {
  id: string;
  type: 'table' | 'chair' | 'decor' | 'stage';
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
}

export interface EventConfig {
  guestCount: number;
  layoutType: 'grid' | 'banquet' | 'u-shape';
  style: 'luxury' | 'minimal' | 'rustic';
  spacing: number;
}

export function generateEventLayout(config: EventConfig): LayoutPoint[] {
  const points: LayoutPoint[] = [];
  const seatsPerTable = 8;
  const tableCount = Math.ceil(config.guestCount / seatsPerTable);
  const { spacing, layoutType } = config;
  
  // 1. Place the Stage (Focal Point) - Always 5 meters in front of the anchor
  points.push({
    id: 'stage-main',
    type: 'stage',
    position: [0, 0, -5],
    rotation: [0, 0, 0],
    scale: [4, 0.4, 2.5]
  });

  // 2. Generate Table Grid Logic
  const cols = layoutType === 'banquet' ? 2 : 3;
  const rows = Math.ceil(tableCount / cols);

  for (let i = 0; i < tableCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Center the grid around the anchor point
    const x = (col - (cols - 1) / 2) * spacing;
    const z = (row - (rows - 1) / 2) * spacing - 2; // Start tables 2m away from user

    const tableId = `table-${i}`;
    points.push({
      id: tableId,
      type: 'table',
      position: [x, 0, z],
      rotation: [0, 0, 0]
    });

    // 3. Place Decor on every table
    points.push({
      id: `decor-${i}`,
      type: 'decor',
      position: [x, 0.75, z], // On top of the table
      rotation: [0, Math.random() * Math.PI, 0]
    });

    // 4. Place Chairs around each table (Circular arrangement)
    for (let s = 0; s < seatsPerTable; s++) {
      const angle = (s / seatsPerTable) * Math.PI * 2;
      const radius = 0.85; // Distance from table center
      const cx = x + Math.cos(angle) * radius;
      const cz = z + Math.sin(angle) * radius;
      
      points.push({
        id: `chair-${i}-${s}`,
        type: 'chair',
        position: [cx, 0, cz],
        rotation: [0, -angle + Math.PI / 2, 0] // Face the table
      });
    }
  }

  return points;
}
