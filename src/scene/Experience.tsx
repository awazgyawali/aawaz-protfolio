import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { MorphParticles } from "./MorphParticles";
import { morphState } from "./morphState";
import { kathmanduPosition } from "./targets";
import { perfTier } from "./perf";

function CameraRig() {
  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const k = 1 - Math.exp(-d * 2.5);
    state.camera.position.x += (morphState.pointerX * 0.45 - state.camera.position.x) * k;
    state.camera.position.y += (morphState.pointerY * 0.3 - state.camera.position.y) * k;
    const targetZ = 8 + morphState.scatter * 0.9 + Math.min(0.8, Math.abs(morphState.scrollVel) * 0.012);
    state.camera.position.z += (targetZ - state.camera.position.z) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Per-target ambient spin speed — zero on typography targets so glyphs stay
// legible and face the camera; lively on swarm/helix/globe.
const SPIN = [0, 0.05, 0.03, 0.05, 0.28, 0, 0.3, 0.34];

function Spinner({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const i = THREE.MathUtils.clamp(morphState.index, 0, 7);
    const fl = Math.floor(i);
    const speed = THREE.MathUtils.lerp(SPIN[fl], SPIN[Math.min(fl + 1, 7)], i - fl);
    const g = group.current;
    if (speed < 0.02) {
      // ease back to face the camera (shortest path to 0 mod 2π)
      let r = g.rotation.y % (Math.PI * 2);
      if (r > Math.PI) r -= Math.PI * 2;
      if (r < -Math.PI) r += Math.PI * 2;
      g.rotation.y = r * Math.exp(-d * 3);
    } else {
      g.rotation.y += d * speed;
    }
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.04 * (speed > 0.02 ? 1 : 0.2);
    // park the formation in the viz panel: right of the content on desktop,
    // upper half on portrait screens — content and animation never collide
    const vw = state.viewport.width;
    const desktop = vw > 7;
    const baseX = desktop ? vw * 0.225 : 0;
    const baseY = desktop ? 0 : 1.25;
    const scale = desktop ? 0.85 : 0.58;
    morphState.offsetX += (morphState.offsetXTarget + baseX - morphState.offsetX) * (1 - Math.exp(-d * 3));
    g.position.x = morphState.offsetX;
    g.position.y += (baseY - g.position.y) * (1 - Math.exp(-d * 3));
    g.scale.setScalar(g.scale.x + (scale - g.scale.x) * (1 - Math.exp(-d * 3)));
  });
  return <group ref={group}>{children}</group>;
}

function KathmanduPing() {
  const mesh = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const pos = kathmanduPosition();
  useFrame((state) => {
    const vis = Math.max(0, Math.min(1, morphState.index - 6)) * morphState.alpha;
    const t = state.clock.elapsedTime;
    (mesh.current.material as THREE.MeshBasicMaterial).opacity = vis;
    const pulse = (t % 1.6) / 1.6;
    ring.current.scale.setScalar(1 + pulse * 3);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = vis * (1 - pulse) * 0.8;
  });
  return (
    <group position={pos}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#ff2e63" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color="#ff2e63" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Chromatic aberration spikes mid-morph and with scroll velocity.
function Aberration() {
  const ref = useRef<{ offset: THREE.Vector2 }>(null!);
  useFrame(() => {
    const trans = 1 - Math.abs((morphState.index % 1) * 2 - 1);
    const drift = Math.abs(morphState.target - morphState.index);
    const vel = Math.min(1, Math.abs(morphState.scrollVel) * 0.015);
    const amt = 0.0004 + Math.min(0.005, trans * trans * 0.0015 + drift * 0.003 + vel * 0.0035);
    ref.current?.offset.set(amt, amt * 0.6);
  });
  return <ChromaticAberration ref={ref as never} offset={new THREE.Vector2(0.0004, 0.0002)} />;
}

export function Experience() {
  const tier = perfTier();
  return (
    <div className="canvas-wrap" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={tier.dpr}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050507"]} />
        <CameraRig />
        <Spinner>
          <MorphParticles count={tier.particles} />
          <KathmanduPing />
        </Spinner>
        {tier.effects && (
          <EffectComposer>
            <Bloom intensity={0.42} luminanceThreshold={0.28} mipmapBlur radius={0.62} />
            <Aberration />
            <Vignette eskil={false} offset={0.18} darkness={0.88} />
          </EffectComposer>
        )}
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
