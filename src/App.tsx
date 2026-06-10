import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Experience } from "./scene/Experience";
import { morphState } from "./scene/morphState";
import { prefersReducedMotion, supportsWebGL } from "./scene/perf";
import { lenisRef, registerScenes, scrollProxyHeight, scrollToScene } from "./lib/scroll";
import { Stage, SCENES, SCENE_COUNT } from "./stage/Stage";
import { Preloader } from "./ui/Preloader";
import { Cursor } from "./ui/Cursor";
import { NavDots, SceneCounter } from "./ui/NavDots";

gsap.registerPlugin(ScrollTrigger);
registerScenes(SCENES.map((s) => s.id));

function useScrollSetup() {
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduced");
      return;
    }
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 1.35,
      touchMultiplier: 1.25,
      syncTouch: true,
      infinite: false,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let velSmooth = 0;
    lenis.on("scroll", (e: { velocity: number }) => {
      ScrollTrigger.update();
      velSmooth += (e.velocity - velSmooth) * 0.18;
      morphState.scrollVel = velSmooth;
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
}

function usePointer() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      morphState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      morphState.pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
      morphState.pointerActive = 1;
    };
    const down = (e: PointerEvent) => {
      morphState.pointerActive = 2.2;
      // fire a shockwave through the particle field at the click point
      morphState.shockX = (e.clientX / window.innerWidth) * 2 - 1;
      morphState.shockY = -(e.clientY / window.innerHeight) * 2 + 1;
      morphState.shockStamp++;
    };
    const up = () => (morphState.pointerActive = 1);
    const leave = () => (morphState.pointerActive = 0);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
}

// Glyph particle targets rasterize the display font — wait for it.
function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const ok = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    document.fonts?.ready.then(ok);
    const t = setTimeout(ok, 1100);
    return () => clearTimeout(t);
  }, []);
  return ready;
}

export default function App() {
  useScrollSetup();
  usePointer();
  const fontsReady = useFontsReady();

  return (
    <>
      <Preloader />
      {fontsReady && supportsWebGL() && <Experience />}
      <div className="content-scrim" aria-hidden />
      <header className="top-nav">
        <button className="logo" onClick={() => scrollToScene(0)} style={{ background: "none", border: 0, font: "inherit", letterSpacing: "inherit" }}>
          AVAAJ<i>_</i>
        </button>
        <nav>
          <button className="nav-link" onClick={() => scrollToScene("work")}>Work</button>
          <button className="nav-link" onClick={() => scrollToScene("arsenal")}>Skills</button>
          <a className="nav-link" href="https://www.linkedin.com/in/aawaz/" target="_blank" rel="noreferrer">LinkedIn</a>
          <button className="nav-link" onClick={() => scrollToScene("contact")}>Contact</button>
        </nav>
      </header>
      <div className="scroll-proxy" style={{ height: `${scrollProxyHeight(SCENE_COUNT)}vh` }} />
      <Stage />
      <SceneCounter />
      <NavDots />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
