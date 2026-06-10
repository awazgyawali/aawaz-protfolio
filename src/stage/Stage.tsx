import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { morphState } from "../scene/morphState";
import { isTouch, prefersReducedMotion } from "../scene/perf";
import { nearestSnapPoint, sceneSnapPoints } from "../lib/scroll";
import { splitChars } from "../lib/split";
import { sceneState } from "./store";
import { Hero } from "../sections/Hero";
import { Manifesto } from "../sections/Manifesto";
import { Arsenal } from "../sections/Arsenal";
import { WorkScene } from "../sections/Work";
import { AgentOps } from "../sections/AgentOps";
import { OpenSource } from "../sections/OpenSource";
import { Journey } from "../sections/Journey";
import { Contact } from "../sections/Contact";

// morph: t = target shape (0 name · 1 brain · 2 candles · 3 phone · 4 swarm ·
// 5 tenx · 6 helix · 7 globe), s = scatter, a = alpha, p = palette blend
export const SCENES = [
  { id: "hero", label: "Home", ghost: "GYAWALI", morph: { t: 0, s: 0, a: 1, p: 0 } },
  { id: "manifesto", label: "Manifesto", ghost: "IMPACT", morph: { t: 1, s: 0, a: 1, p: 0.15 } },
  { id: "arsenal", label: "Arsenal", ghost: "STACK", morph: { t: 1, s: 0.9, a: 0.5, p: 0.5 } },
  { id: "work", label: "Nepal Share", ghost: "100K", morph: { t: 2, s: 0, a: 1, p: 0 } },
  { id: "work-2", label: "gStore", ghost: "RETAIL", morph: { t: 3, s: 0, a: 1, p: 0.3 } },
  { id: "work-3", label: "Brainants", ghost: "FOUNDER", morph: { t: 4, s: 0.12, a: 1, p: 0.55 } },
  { id: "work-4", label: "Toptal", ghost: "TOP 3%", morph: { t: 4, s: 0, a: 1, p: 0.15 } },
  { id: "work-5", label: "Highlights", ghost: "SHIPPED", morph: { t: 4, s: 0.55, a: 0.7, p: 0.7 } },
  { id: "agentops", label: "Workflow", ghost: "DELIVERY", morph: { t: 5, s: 0, a: 1, p: 1 } },
  { id: "opensource", label: "Open Source", ghost: "OSS", morph: { t: 5, s: 0.75, a: 0.5, p: 0.85 } },
  { id: "journey", label: "Journey", ghost: "15→25", morph: { t: 6, s: 0, a: 1, p: 0.45 } },
  { id: "contact", label: "Contact", ghost: "CONTACT", morph: { t: 7, s: 0, a: 1, p: 0.05 } },
] as const;

export const SCENE_COUNT = SCENES.length;

function renderScene(i: number) {
  switch (SCENES[i].id) {
    case "hero": return <Hero />;
    case "manifesto": return <Manifesto sceneIndex={i} />;
    case "arsenal": return <Arsenal />;
    case "work": return <WorkScene slide={0} />;
    case "work-2": return <WorkScene slide={1} />;
    case "work-3": return <WorkScene slide={2} />;
    case "work-4": return <WorkScene slide={3} />;
    case "work-5": return <WorkScene slide={4} />;
    case "agentops": return <AgentOps />;
    case "opensource": return <OpenSource />;
    case "journey": return <Journey />;
    case "contact": return <Contact />;
  }
}

export function Stage() {
  const stage = useRef<HTMLDivElement>(null);
  const sceneEls = useRef<(HTMLDivElement | null)[]>([]);
  const innerEls = useRef<(HTMLDivElement | null)[]>([]);
  const ghostEls = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const N = SCENES.length;
    const proxy = document.querySelector<HTMLElement>(".scroll-proxy");
    if (!proxy) return;

    const ctx = gsap.context(() => {
      const splits = sceneEls.current.map((el) => {
        const title = el?.querySelector<HTMLElement>(".sc-title");
        return title ? splitChars(title) : { chars: [], revert: () => {} };
      });

      // initial morph + scene 0 visible, its elements hidden for the intro
      const m0 = SCENES[0].morph;
      Object.assign(morphState, {
        target: m0.t, scatterTarget: m0.s, alphaTarget: m0.a, paletteTarget: m0.p,
      });
      gsap.set(sceneEls.current[0]!, { autoAlpha: 1 });
      gsap.set(ghostEls.current[0]!, { autoAlpha: 1 });

      const snapPoints = sceneSnapPoints(N);

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: proxy,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          snap: {
            snapTo: (value) => nearestSnapPoint(value, N),
            duration: { min: 0.45, max: 1.05 },
            delay: 0.08,
            ease: "power3.out",
            inertia: false,
          },
          onUpdate: (self) => {
            const time = self.progress * N;
            sceneState.time = time;
            sceneState.active = snapPoints.reduce((bestIdx, p, idx) => {
              const bestDist = Math.abs(snapPoints[bestIdx] - self.progress);
              return Math.abs(p - self.progress) < bestDist ? idx : bestIdx;
            }, 0);
          },
        },
      });

      SCENES.forEach((scene, i) => {
        const t0 = i;
        const root = sceneEls.current[i]!;
        const ghost = ghostEls.current[i]!;
        const chars = splits[i].chars;
        const fades = root.querySelectorAll(".sc-fade");
        const items = root.querySelectorAll(".sc-item");

        // ghost word drifts across its scene
        tl.fromTo(ghost, { xPercent: 5 }, { xPercent: -5, duration: 1.04, ease: "none" }, t0);
        if (i > 0) {
          tl.set(root, { autoAlpha: 1 }, t0 + 0.01);
          tl.fromTo(ghost, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power1.out" }, t0 + 0.02);
          tl.fromTo(
            chars,
            { yPercent: 108, rotateX: -58, opacity: 0, scale: 0.92 },
            { yPercent: 0, rotateX: 0, opacity: 1, scale: 1, duration: 0.32, stagger: { amount: 0.2, from: "random" }, ease: "power3.out" },
            t0 + 0.02
          );
          tl.fromTo(fades, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" }, t0 + 0.1);
          tl.fromTo(items, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.28, stagger: { amount: 0.14 }, ease: "power2.out" }, t0 + 0.14);
        }
        if (i < N - 1) {
          tl.fromTo(
            chars,
            { yPercent: 0, rotateX: 0, opacity: 1, scale: 1 },
            { yPercent: -72, rotateX: 42, opacity: 0, scale: 0.94, duration: 0.3, stagger: { amount: 0.12, from: "end" }, ease: "power2.inOut" },
            t0 + 0.72
          );
          tl.fromTo(
            [...fades, ...items],
            { y: 0, autoAlpha: 1 },
            { y: -16, autoAlpha: 0, duration: 0.28, ease: "power2.inOut" },
            t0 + 0.74
          );
          tl.to(ghost, { autoAlpha: 0, duration: 0.22, ease: "power1.in" }, t0 + 0.78);
          tl.set(root, { autoAlpha: 0 }, t0 + 1.05);
          const next = SCENES[i + 1].morph;
          tl.to(
            morphState,
            { target: next.t, scatterTarget: next.s, alphaTarget: next.a, paletteTarget: next.p, duration: 0.58, ease: "power2.inOut" },
            t0 + 0.68
          );
        }
      });

      // intro: scene 0 plays in after the preloader, un-scrubbed
      const root0 = sceneEls.current[0]!;
      const chars0 = splits[0].chars;
      const f0 = root0.querySelectorAll(".sc-fade");
      const i0 = root0.querySelectorAll(".sc-item");
      gsap.set(chars0, { yPercent: 108, rotateX: -58, opacity: 0, scale: 0.92 });
      gsap.set([...f0, ...i0], { y: 22, autoAlpha: 0 });
      const intro = gsap.timeline({ delay: 1.35, defaults: { ease: "power3.out" } });
      intro
        .to(chars0, { yPercent: 0, rotateX: 0, opacity: 1, scale: 1, duration: 0.85, stagger: { each: 0.018, from: "random" } })
        .to(f0, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06 }, 0.35)
        .to(i0, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05 }, 0.5);
    }, stage);

    return () => ctx.revert();
  }, []);

  // pointer-reactive layer: scene tilt, char magnetism, ghost parallax, skew
  useLayoutEffect(() => {
    if (prefersReducedMotion || isTouch) return;
    let raf = 0;
    let rects: { el: HTMLElement; x: number; y: number }[] = [];
    let rectScene = -1;
    let rectAt = 0;
    let tiltY = 0;
    let tiltX = 0;
    let ghostX = 0;
    let ghostY = 0;
    let skew = 0;

    const tick = () => {
      const now = performance.now();
      const active = sceneState.active;
      const inner = innerEls.current[active];
      const px = morphState.pointerX;
      const py = morphState.pointerY;

      tiltX += (px * 2.4 - tiltX) * 0.07;
      tiltY += (-py * 1.8 - tiltY) * 0.07;
      if (inner) {
        inner.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
      }

      ghostX += (px * -18 - ghostX) * 0.06;
      ghostY += (py * 10 - ghostY) * 0.06;
      const ghost = ghostEls.current[active];
      if (ghost) ghost.style.translate = `${ghostX}px ${ghostY}px`;

      // cache glyph centers shortly after a scene settles
      if (rectScene !== active || now - rectAt > 1200) {
        rectScene = active;
        rectAt = now;
        const title = sceneEls.current[active]?.querySelector<HTMLElement>(".sc-title");
        rects = title
          ? Array.from(title.querySelectorAll<HTMLElement>(".char")).map((el) => {
              const r = el.getBoundingClientRect();
              return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
            })
          : [];
      }
      // magnetic glyphs: push away from the cursor, spring home
      const cx = ((px + 1) / 2) * window.innerWidth;
      const cy = ((1 - py) / 2) * window.innerHeight;
      for (const r of rects) {
        const dx = r.x - cx;
        const dy = r.y - cy;
        const d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.01) {
          const f = (1 - d / 130) * 11;
          r.el.style.translate = `${(dx / d) * f}px ${(dy / d) * f}px`;
        } else if (r.el.style.translate && r.el.style.translate !== "0px 0px") {
          r.el.style.translate = "0px 0px";
        }
      }

      morphState.scrollVel *= 0.945;
      const targetSkew = Math.max(-0.85, Math.min(0.85, morphState.scrollVel * 0.0028));
      skew += (targetSkew - skew) * 0.12;
      if (stage.current) stage.current.style.transform = `skewY(${skew}deg)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="stage" ref={stage}>
      {SCENES.map((s, i) => (
        <div
          className="ghost"
          key={"g" + s.id}
          ref={(el) => {
            ghostEls.current[i] = el;
          }}
        >
          {s.ghost}
        </div>
      ))}
      {SCENES.map((s, i) => (
        <div
          className="scene"
          id={s.id}
          key={s.id}
          ref={(el) => {
            sceneEls.current[i] = el;
          }}
        >
          <div
            className="scene-inner"
            ref={(el) => {
              innerEls.current[i] = el;
            }}
          >
            {renderScene(i)}
          </div>
        </div>
      ))}
    </div>
  );
}
