import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../scene/perf";

// Per-scene progress written by the Stage master timeline every scroll update.
// Components poll it with rAF instead of IntersectionObserver — scenes are
// stacked full-screen layers, so geometric observers are useless here.
export const sceneState = {
  active: 0,
  // raw master-timeline time (1 unit per scene)
  time: 0,
};

/** True while `index` is the scene the viewer is on (always true in reduced-motion mode). */
export function useSceneActive(index: number): boolean {
  const [active, setActive] = useState(prefersReducedMotion || index === 0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf = 0;
    const tick = () => {
      const a = sceneState.active === index;
      setActive((prev) => (prev === a ? prev : a));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);
  return active;
}
