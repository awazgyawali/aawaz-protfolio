import { useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { work } from "../content";
import { prefersReducedMotion } from "../scene/perf";

// Flick-spinnable ring of client-review chips — the Muzdo wheel, recreated.
function Wheel({ items }: { items: string[] }) {
  const wheel = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const vel = useRef(prefersReducedMotion ? 0 : 18);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      vel.current *= Math.exp(-dt * 1.1);
      angle.current += vel.current * dt + (prefersReducedMotion ? 0 : 4 * dt);
      if (wheel.current) wheel.current.style.transform = `rotate(${angle.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const bind = useDrag(
    ({ delta: [dx], velocity: [vx], direction: [dirx], last }) => {
      if (last) vel.current = Math.min(Math.abs(vx) * 320, 1400) * dirx;
      else vel.current = dx * 26;
    },
    { axis: "x", filterTaps: true }
  );

  return (
    <div className="wheel-wrap sc-item" {...bind()}>
      <div className="wheel" ref={wheel}>
        {items.map((label, i) => {
          const a = (360 / items.length) * i;
          return (
            <span
              key={label}
              className="chip"
              style={{
                transform: `translate(-50%, -50%) rotate(${a}deg) translateY(calc(min(280px, 56vw) * -0.42))`,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="wheel-core">
        flick<br />the wheel
      </div>
    </div>
  );
}

export function WorkScene({ slide }: { slide: number }) {
  const s = work.slides[slide];
  return (
    <>
      <p className="sc-kicker">{s.kicker}</p>
      <h2 className="sc-title">{s.title}</h2>
      <p className="sc-body sc-fade">{s.body}</p>
      <div className="slide-metrics">
        {s.metrics.map((m) => (
          <div className="slide-metric sc-item" key={m.label}>
            <b>{m.value}</b>
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="slide-tags">
        {s.tags.map((t) => (
          <span className="chip sc-item" key={t}>
            {t}
          </span>
        ))}
      </div>
      {s.wheel && <Wheel items={s.wheel} />}
    </>
  );
}
