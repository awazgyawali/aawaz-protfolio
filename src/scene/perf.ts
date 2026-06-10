export const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function perfTier(): { particles: number; dpr: [number, number]; effects: boolean } {
  const cores = navigator.hardwareConcurrency ?? 4;
  if (isTouch || cores <= 4) return { particles: 16000, dpr: [1, 1.5], effects: cores > 4 };
  if (cores <= 8) return { particles: 32000, dpr: [1, 1.5], effects: true };
  return { particles: 48000, dpr: [1, 2], effects: true };
}
