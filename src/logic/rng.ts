/**
 * Seeded deterministic RNG (mulberry32) — makes all simulator outputs
 * reproducible per seed while remaining statistically sound.
 */
export type Rng = () => number;

export const createRng = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randomInt = (rng: Rng, min: number, maxInclusive: number): number =>
  min + Math.floor(rng() * (maxInclusive - min + 1));

export const pick = <T,>(rng: Rng, arr: T[]): T => arr[Math.floor(rng() * arr.length)];

export const sampleUniform = <T,>(rng: Rng, arr: T[], n: number): T[] => {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(pick(rng, arr));
  return out;
};
