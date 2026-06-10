import { useEffect, useState } from "react";
import { SCENES } from "../stage/Stage";
import { sceneState } from "../stage/store";
import { scrollToScene } from "../lib/scroll";

export function NavDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setActive((p) => (p === sceneState.active ? p : sceneState.active));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="nav-dots" role="navigation" aria-label="Scenes">
      {SCENES.map((s, i) => (
        <button
          key={s.id}
          className={active === i ? "active" : ""}
          aria-label={s.label}
          title={s.label}
          onClick={() => scrollToScene(i)}
        />
      ))}
    </div>
  );
}

export function SceneCounter() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setActive((p) => (p === sceneState.active ? p : sceneState.active));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="scene-counter" aria-hidden>
      <b>{String(active + 1).padStart(2, "0")}</b>
      <span>/ {String(SCENES.length).padStart(2, "0")}</span>
      <span>— {SCENES[active].label}</span>
    </div>
  );
}
