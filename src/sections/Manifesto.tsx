import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { manifesto } from "../content";
import { useSceneActive } from "../stage/store";

function Stat({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    const ctrl = animate(0, value, {
      duration: 1.6,
      ease: "circOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [active, value]);
  return (
    <div className="sc-item">
      <div className="stat-num">
        {n}
        <i>{suffix}</i>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// renders **bold** spans from content strings
export function Bold({ text }: { text: string }) {
  return <>{text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}</>;
}

export function Manifesto({ sceneIndex }: { sceneIndex: number }) {
  const active = useSceneActive(sceneIndex);
  return (
    <>
      <p className="sc-kicker">The Manifesto</p>
      <h2 className="sc-title">{manifesto.title}</h2>
      <p className="sc-body sc-fade">{manifesto.body}</p>
      <div className="stats">
        {manifesto.stats.map((s) => (
          <Stat key={s.label} {...s} active={active} />
        ))}
      </div>
      <p className="sc-body sc-fade" style={{ marginTop: "1.6rem", fontSize: "0.82rem" }}>
        <Bold text={manifesto.brands} />
      </p>
    </>
  );
}
