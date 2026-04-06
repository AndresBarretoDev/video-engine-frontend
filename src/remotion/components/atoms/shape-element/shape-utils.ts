/**
 * SVG path generators for ShapeElement atom.
 * All generators are deterministic — no Math.random() calls inside render.
 */

/**
 * Generates a 5-point star polygon path.
 * cx/cy = center, outerR = outer radius, innerR = inner radius (default: 0.4 × outerR)
 */
export function getStarPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR?: number
): string {
  const inner = innerR ?? outerR * 0.4;
  const points: string[] = [];

  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : inner;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(' ');
}

/**
 * Generates a sine-wave SVG path using cubic bezier approximation.
 * frequency: how many full waves across the width (default: 2)
 */
export function getWavePath(
  width: number,
  height: number,
  frequency = 2
): string {
  const amplitude = height * 0.35;
  const midY = height / 2;
  const segmentWidth = width / (frequency * 4);

  let d = `M 0,${midY.toFixed(2)}`;

  for (let i = 0; i < frequency * 2; i++) {
    const x0 = i * 2 * segmentWidth;
    const x1 = x0 + segmentWidth;
    const x2 = x1 + segmentWidth;
    const cp1x = x0 + segmentWidth * 0.5;
    const cp2x = x1 + segmentWidth * 0.5;
    const peakY = i % 2 === 0 ? midY - amplitude : midY + amplitude;

    d += ` C ${cp1x.toFixed(2)},${peakY.toFixed(2)} ${cp2x.toFixed(2)},${peakY.toFixed(2)} ${x2.toFixed(2)},${midY.toFixed(2)}`;
  }

  return d;
}

/**
 * Generates a deterministic blob SVG path from a seed string.
 * The blob is a closed cubic bezier path with 6 control points.
 * Seed is used to deterministically vary the shape — no per-frame randomness.
 */
export function getBlobPath(
  width: number,
  height: number,
  seed: string
): string {
  // Deterministic pseudo-random from seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.42;
  const ry = height * 0.42;
  const numPoints = 6;
  const points: Array<{ x: number; y: number; cpX: number; cpY: number }> = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    // Use hash to offset radius per point (±15% variation)
    const hashOffset = ((hash * (i + 1) * 2654435761) >>> 0) / 0xffffffff;
    const radiusX = rx * (0.85 + hashOffset * 0.3);
    const radiusY = ry * (0.85 + (1 - hashOffset) * 0.3);
    const x = cx + radiusX * Math.cos(angle);
    const y = cy + radiusY * Math.sin(angle);
    const cpX = cx + radiusX * 1.15 * Math.cos(angle + Math.PI / numPoints);
    const cpY = cy + radiusY * 1.15 * Math.sin(angle + Math.PI / numPoints);
    points.push({ x, y, cpX, cpY });
  }

  const first = points[0];
  let d = `M ${first.x.toFixed(2)},${first.y.toFixed(2)}`;

  for (let i = 0; i < numPoints; i++) {
    const curr = points[i];
    const next = points[(i + 1) % numPoints];
    d += ` Q ${curr.cpX.toFixed(2)},${curr.cpY.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }

  d += ' Z';
  return d;
}

/**
 * Approximate total path length for a wave path at given dimensions.
 * Used for stroke-dasharray animation in draw-in.
 * This is a geometric approximation — not pixel-perfect, but visually accurate.
 */
export function getWavePathLength(
  width: number,
  height: number,
  frequency = 2
): number {
  const amplitude = height * 0.35;
  // Approximate arc length of a sine wave: ≈ width * sqrt(1 + (A*2π*f/W)²) per period
  const angularFreq = (2 * Math.PI * frequency) / width;
  const arcLength = width * Math.sqrt(1 + (amplitude * angularFreq) ** 2);
  return arcLength;
}

/**
 * Approximate total path length for a blob path at given dimensions.
 */
export function getBlobPathLength(width: number, height: number): number {
  // Approximation: perimeter of an ellipse × 1.1 (blob variance)
  const a = width * 0.42;
  const b = height * 0.42;
  // Ramanujan's approximation for ellipse perimeter
  const h = ((a - b) / (a + b)) ** 2;
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h))) * 1.1;
}
