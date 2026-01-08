import { ref } from 'vue';

export interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  size: number;
  opacity: number;

  baseSpeedY: number;
  baseSpeedX: number;
  swayAmp: number;
  swayFreq: number;
  timeOffset: number;

  // State
  isDragging: boolean;
  isLanded: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
}

let nextId = 0;

// Pile grid for bottom stacking
const pileBaselineY = ref<number>(typeof window !== 'undefined' ? window.innerHeight : 1080);
const colWidth = ref<number>(36); // approximate petal width + margin
let pileHeights: number[] = [];

const ensureGrid = () => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const cols = Math.max(1, Math.floor(w / colWidth.value));
  if (pileHeights.length !== cols) {
    const old = pileHeights.slice();
    pileHeights = new Array(cols).fill(0);
    // carry over approximate heights
    for (let i = 0; i < Math.min(old.length, cols); i++) pileHeights[i] = old[i];
  }
};

const smoothColumnHeight = (idx: number) => {
  const left = pileHeights[Math.max(0, idx - 1)] || 0;
  const right = pileHeights[Math.min(pileHeights.length - 1, idx + 1)] || 0;
  pileHeights[idx] = (pileHeights[idx] * 0.7) + ((left + right) * 0.15);
};

export const createPetal = (yStart = -50): Petal => {
  const size = Math.random() * 10 + 12;
  return {
    id: nextId++,
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
    y: yStart,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.8,
    size,
    opacity: Math.random() * 0.4 + 0.6,

    baseSpeedY: (Math.random() * 1 + 1),
    baseSpeedX: (Math.random() - 0.5) * 1,
    swayAmp: Math.random() * 2,
    swayFreq: Math.random() * 0.02 + 0.01,
    timeOffset: Math.random() * 1000,

    isDragging: false,
    isLanded: false,
    dragOffsetX: 0,
    dragOffsetY: 0
  };
};

export function updatePetals(petals: Petal[], opts: { speedMultiplier: number; isDark: boolean; }) {
  const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
  pileBaselineY.value = h;
  ensureGrid();

  // Spawn
  const MAX_PETALS = 50;
  const MAX_LANDED = 300;
  const activeCount = petals.filter(p => !p.isLanded).length;
  if (activeCount < MAX_PETALS && Math.random() < 0.05) petals.push(createPetal());

  // Physics
  for (const p of petals) {
    if (p.isDragging) continue;

    if (p.isLanded) continue; // landed positions managed by grid

    p.timeOffset++;
    const sway = Math.sin(p.timeOffset * p.swayFreq) * p.swayAmp;
    p.x += (p.baseSpeedX + sway) * opts.speedMultiplier * 0.5;
    p.y += p.baseSpeedY * opts.speedMultiplier;
    p.rotation += (p.baseSpeedX + sway) * 2;

    // wrap X
    if (p.x > w + 20) p.x = -20;
    if (p.x < -20) p.x = w + 20;

    // landing via grid
    if (p.y > h - p.size) {
      const idx = Math.max(0, Math.min(pileHeights.length - 1, Math.floor(p.x / colWidth.value)));
      const landingY = pileBaselineY.value - pileHeights[idx] - p.size * 1.0;
      p.y = landingY;
      p.isLanded = true;
      p.rotation = Math.random() * 360;
      pileHeights[idx] += p.size * 0.85; // accumulate
      smoothColumnHeight(idx);
    }
  }

  // cleanup fallen
  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    if (p.y > h + 100) petals.splice(i, 1);
  }

  // trim landed if too many
  const landed = petals.filter(p => p.isLanded);
  if (landed.length > MAX_LANDED) {
    const over = landed.length - MAX_LANDED;
    for (let i = 0; i < over; i++) {
      const oldest = landed[i];
      const idx = petals.indexOf(oldest);
      if (idx > -1) petals.splice(idx, 1);
    }
  }
}
