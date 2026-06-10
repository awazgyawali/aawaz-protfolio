import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hero } from "../content";
import { scrollToScene } from "../lib/scroll";

function RotatingRoles() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % hero.roles.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hero-roles sc-fade">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block" }}
        >
          ▸ {hero.roles[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  return (
    <>
      <p className="sc-kicker">{hero.kicker}</p>
      <h1 className="sc-title">{hero.title}</h1>
      <RotatingRoles />
      <p className="sc-body sc-fade">{hero.body}</p>
      <div className="hero-ctas">
        {hero.ctas.map((c) =>
          "href" in c && c.href ? (
            <a
              key={c.label}
              className="btn sc-item"
              href={c.href}
              target="_blank"
              rel="noreferrer"
            >
              {c.label}
            </a>
          ) : (
            <button
              key={c.label}
              className={`btn sc-item ${"primary" in c && c.primary ? "solid" : ""}`}
              onClick={() => scrollToScene(c.target!)}
            >
              {c.label}
            </button>
          )
        )}
      </div>
    </>
  );
}
