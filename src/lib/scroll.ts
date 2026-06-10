import type Lenis from "lenis";

export const SCENE_ANCHOR = 0.45;

export const lenisRef: { current: Lenis | null } = { current: null };

let sceneIds: string[] = [];
let sceneCount = 1;

export function registerScenes(ids: string[]) {
  sceneIds = ids;
  sceneCount = ids.length || 1;
}

export function sceneProgress(index: number, total = sceneCount) {
  return index === 0 ? 0 : (index + SCENE_ANCHOR) / total;
}

export function sceneSnapPoints(total = sceneCount) {
  return Array.from({ length: total }, (_, i) => sceneProgress(i, total));
}

export function nearestSnapPoint(value: number, total = sceneCount) {
  const points = sceneSnapPoints(total);
  return points.reduce((best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best));
}

export function scrollToScene(idOrIndex: string | number) {
  const N = sceneCount;
  const i = typeof idOrIndex === "number" ? idOrIndex : Math.max(0, sceneIds.indexOf(idOrIndex));
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = sceneProgress(i, N) * max;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, {
      duration: 1.35,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  } else if (document.documentElement.classList.contains("reduced")) {
    document.getElementById(sceneIds[i])?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
