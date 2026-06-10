import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { openSource } from "../content";
import { isTouch } from "../scene/perf";

function TiltCard({ name, stars, desc, link }: (typeof openSource.cards)[number]) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 22 });

  return (
    <motion.a
      className="os-card sc-item"
      href={link}
      target="_blank"
      rel="noreferrer"
      style={isTouch ? undefined : { rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      <h4>
        {name} <span className="stars">{stars}</span>
      </h4>
      <p>{desc}</p>
    </motion.a>
  );
}

export function OpenSource() {
  return (
    <>
      <p className="sc-kicker">Open Source</p>
      <h2 className="sc-title">{openSource.title}</h2>
      <p className="sc-body sc-fade">{openSource.body}</p>
      <div className="os-grid" style={{ perspective: 800 }}>
        {openSource.cards.map((c) => (
          <TiltCard key={c.name} {...c} />
        ))}
      </div>
      <div className="os-badges">
        {openSource.badges.map((b) => (
          <span className="chip hot sc-item" key={b}>
            {b}
          </span>
        ))}
        <a className="chip sc-item" href={openSource.medium.link} target="_blank" rel="noreferrer">
          {openSource.medium.label}
        </a>
      </div>
    </>
  );
}
