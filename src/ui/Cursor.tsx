import { useEffect, useRef } from "react";
import { isTouch, prefersReducedMotion } from "../scene/perf";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;
    document.body.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener("pointermove", move);
    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.11;
      ry += (y - ry) * 0.11;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isTouch || prefersReducedMotion) return null;
  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
