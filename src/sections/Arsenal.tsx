import { useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { arsenal } from "../content";
import { prefersReducedMotion } from "../scene/perf";

// Three concentric 3D orbit rings of skill chips.
// Drag X flings the spin, drag Y tips the whole gyroscope — both with inertia
// and a rubber-band that eases the tilt back home. Chips bob on their orbits,
// scale up as they swing to the front, and the front-most chip runs hot.
export function Arsenal() {
  const chipRefs = useRef<(HTMLSpanElement | null)[][]>(arsenal.rings.map(() => []));
  const angles = useRef(arsenal.rings.map((_, i) => i * 40));
  const spinVel = useRef(0);
  const tilt = useRef(0);
  const tiltVel = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      const t = now / 1000;
      last = now;

      spinVel.current *= Math.exp(-dt * 1.6);
      tiltVel.current *= Math.exp(-dt * 2.2);
      // rubber-band the tilt back toward level
      tilt.current += tiltVel.current * dt - tilt.current * dt * 1.4;
      tilt.current = Math.max(-42, Math.min(42, tilt.current));

      arsenal.rings.forEach((ring, ri) => {
        const auto = prefersReducedMotion ? 0 : ring.speed * (1 + Math.sin(t * 0.3 + ri * 2) * 0.25);
        angles.current[ri] += (auto + spinVel.current * Math.sign(ring.speed)) * dt;
        const a0 = angles.current[ri];
        const ringTilt = ring.tilt + tilt.current + Math.sin(t * 0.5 + ri * 1.7) * 5;
        const n = ring.skills.length;
        ring.skills.forEach((_, si) => {
          const el = chipRefs.current[ri][si];
          if (!el) return;
          const a = a0 + (360 / n) * si;
          const rad = (a * Math.PI) / 180;
          const depth = (Math.cos(rad) + 1) / 2; // 1 = front, 0 = back
          const bob = Math.sin(t * 1.4 + si * 2.1 + ri) * 7;
          const scale = 0.78 + depth * 0.5;
          el.style.transform =
            `translate(-50%, -50%) rotateX(${ringTilt}deg) rotateY(${a}deg)` +
            ` translateZ(${ring.radius + bob}px) rotateY(${-a}deg) rotateX(${-ringTilt}deg) scale(${scale})`;
          el.style.opacity = String(0.25 + depth * 0.75);
          el.style.zIndex = String(Math.round(depth * 20));
          // the chip swinging through the front runs hot
          if (depth > 0.96) {
            el.style.background = "rgba(5,5,7,0.95)";
            el.style.boxShadow = `0 0 18px ${arsenal.rings[ri].color}55`;
          } else {
            el.style.background = "rgba(5,5,7,0.78)";
            el.style.boxShadow = "none";
          }
        });
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const bind = useDrag(
    ({ delta: [dx, dy], velocity: [vx, vy], direction: [dirx, diry], last }) => {
      if (last) {
        spinVel.current = Math.min(Math.abs(vx) * 260, 1200) * dirx;
        tiltVel.current = Math.min(Math.abs(vy) * 160, 500) * diry;
      } else {
        spinVel.current = dx * 16;
        tiltVel.current = dy * 9;
      }
    },
    { filterTaps: true }
  );

  return (
    <>
      <p className="sc-kicker">The Arsenal</p>
      <h2 className="sc-title">{arsenal.title}</h2>
      <p className="sc-body sc-fade">{arsenal.body}</p>
      <div className="constellation sc-item" {...bind()}>
        <div className="constellation-stage">
          {arsenal.rings.map((ring, ri) =>
            ring.skills.map((skill, si) => (
              <span
                key={skill}
                className="skill-chip"
                style={{ borderColor: ring.color + "66", color: ring.color }}
                ref={(el) => {
                  chipRefs.current[ri][si] = el;
                }}
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>
      <p className="drag-hint sc-fade">⟵ flick to spin · drag ↕ to tip ⟶</p>
    </>
  );
}
