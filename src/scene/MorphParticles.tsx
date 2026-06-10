import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { morphState } from "./morphState";
import {
  textTarget,
  brainTarget,
  candlesTarget,
  phoneTarget,
  swarmTarget,
  helixTarget,
  globeTarget,
} from "./targets";

const vertex = /* glsl */ `
  attribute vec3 aBrain;
  attribute vec3 aCandles;
  attribute vec3 aPhone;
  attribute vec3 aSwarm;
  attribute vec3 aTenx;
  attribute vec3 aHelix;
  attribute vec3 aGlobe;
  attribute vec3 aRand;

  uniform float uTime;
  uniform float uIndex;
  uniform float uScatter;
  uniform float uSize;
  uniform float uVel;
  uniform vec3 uPointer;        // group-local space
  uniform float uPointerStrength;
  uniform vec4 uShock;          // xyz origin (local), w start time

  varying float vRand;
  varying float vGlow;

  void main() {
    // chained lerp through the eight targets (position holds the name glyphs)
    vec3 p = position;
    p = mix(p, aBrain,   clamp(uIndex,       0.0, 1.0));
    p = mix(p, aCandles, clamp(uIndex - 1.0, 0.0, 1.0));
    p = mix(p, aPhone,   clamp(uIndex - 2.0, 0.0, 1.0));
    p = mix(p, aSwarm,   clamp(uIndex - 3.0, 0.0, 1.0));
    p = mix(p, aTenx,    clamp(uIndex - 4.0, 0.0, 1.0));
    p = mix(p, aHelix,   clamp(uIndex - 5.0, 0.0, 1.0));
    p = mix(p, aGlobe,   clamp(uIndex - 6.0, 0.0, 1.0));

    // turbulence: ambient breath + scatter drift + morph swirl + scroll energy
    float trans = 1.0 - abs(fract(uIndex) * 2.0 - 1.0);
    trans = trans * trans;
    float amp = 0.028 + uScatter * 1.1 + trans * 0.6 + uVel * 0.5;
    float w = 0.25 + aRand.x * 0.75;
    p += amp * w * vec3(
      sin(uTime * 0.62 + aRand.x * 21.0 + p.y * 1.4),
      cos(uTime * 0.48 + aRand.y * 17.0 + p.x * 1.2),
      sin(uTime * 0.71 + aRand.z * 13.0 + p.z * 1.6)
    );

    // pointer repulsion (group-local space, soft falloff)
    vec3 toP = p - uPointer;
    float d2 = dot(toP, toP);
    p += normalize(toP + 0.0001) * uPointerStrength * exp(-d2 * 0.9);

    // click shockwave: expanding ring displacement, decays over ~2.5s
    float st = uTime - uShock.w;
    if (st > 0.0 && st < 2.5) {
      float d = distance(p, uShock.xyz);
      float ring = sin(d * 5.5 - st * 9.0) * exp(-d * 0.5) * exp(-st * 2.0);
      p += normalize(p - uShock.xyz + 0.0001) * ring * 0.75;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aRand.y) * (28.0 / -mv.z);

    vRand = aRand.x;
    vGlow = trans;
  }
`;

const fragment = /* glsl */ `
  uniform float uAlpha;
  uniform float uPalette;

  varying float vRand;
  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);

    // palette A: teal -> hot magenta · palette B: acid -> violet
    vec3 tealA  = vec3(0.000, 0.878, 0.776);
    vec3 magA   = vec3(1.000, 0.180, 0.388);
    vec3 acidB  = vec3(0.784, 1.000, 0.000);
    vec3 violB  = vec3(0.486, 0.227, 0.929);
    vec3 colA = mix(tealA, acidB, uPalette);
    vec3 colB = mix(magA, violB, uPalette);
    vec3 col = mix(colA, colB, vRand);
    // mid-morph flash leans acid, never white
    col = mix(col, vec3(0.85, 1.0, 0.55), vGlow * 0.3);
    // low alpha: dense glyph shapes must layer to color, not blow out to white
    gl_FragColor = vec4(col, a * 0.2 * uAlpha);
  }
`;

// Per-target alpha compensation: small dense glyphs ("10X") and bright
// palettes saturate additive blending much faster than diffuse shapes.
const ALPHA_COMP = [0.85, 1, 1, 1, 1, 0.5, 1, 1];

export function MorphParticles({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const pts = useRef<THREE.Points>(null!);
  const worldPointer = useMemo(() => new THREE.Vector3(), []);
  const localPointer = useMemo(() => new THREE.Vector3(), []);
  const shockLocal = useMemo(() => new THREE.Vector3(), []);
  const lastShock = useRef(0);

  const { geometry, name } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const name = textTarget(count, "AVAAJ", 6.6);
    g.setAttribute("position", new THREE.BufferAttribute(name, 3));
    g.setAttribute("aBrain", new THREE.BufferAttribute(brainTarget(count), 3));
    g.setAttribute("aCandles", new THREE.BufferAttribute(candlesTarget(count), 3));
    g.setAttribute("aPhone", new THREE.BufferAttribute(phoneTarget(count), 3));
    g.setAttribute("aSwarm", new THREE.BufferAttribute(swarmTarget(count), 3));
    g.setAttribute("aTenx", new THREE.BufferAttribute(textTarget(count, "10X", 4.6), 3));
    g.setAttribute("aHelix", new THREE.BufferAttribute(helixTarget(count), 3));
    g.setAttribute("aGlobe", new THREE.BufferAttribute(globeTarget(count), 3));
    const r = new Float32Array(count * 3);
    for (let i = 0; i < r.length; i++) r[i] = Math.random();
    g.setAttribute("aRand", new THREE.BufferAttribute(r, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);
    return { geometry: g, name };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIndex: { value: 0 },
      uScatter: { value: 0 },
      uSize: { value: 1.15 },
      uAlpha: { value: 1 },
      uVel: { value: 0 },
      uPalette: { value: 0 },
      uPointer: { value: new THREE.Vector3(99, 99, 99) },
      uPointerStrength: { value: 0 },
      uShock: { value: new THREE.Vector4(0, 0, 0, -10) },
    }),
    []
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const k = 1 - Math.exp(-d * 2.6);
    morphState.index += (morphState.target - morphState.index) * k;
    morphState.scatter += (morphState.scatterTarget - morphState.scatter) * k;
    morphState.alpha += (morphState.alphaTarget - morphState.alpha) * (1 - Math.exp(-d * 3.2));
    morphState.palette += (morphState.paletteTarget - morphState.palette) * k;

    const u = mat.current.uniforms;
    u.uSize.value = 0.95 * state.gl.getPixelRatio();
    u.uTime.value = state.clock.elapsedTime;
    u.uIndex.value = morphState.index;
    u.uScatter.value = morphState.scatter;
    const ci = THREE.MathUtils.clamp(morphState.index, 0, 7);
    const fl = Math.floor(ci);
    const comp = THREE.MathUtils.lerp(ALPHA_COMP[fl], ALPHA_COMP[Math.min(fl + 1, 7)], ci - fl);
    u.uAlpha.value = morphState.alpha * comp;
    u.uPalette.value = morphState.palette;
    u.uVel.value = Math.min(1, Math.abs(morphState.scrollVel) * 0.014);

    // project pointer NDC onto the z=0 plane in world space…
    worldPointer.set(morphState.pointerX, morphState.pointerY, 0.5).unproject(state.camera);
    const dir = worldPointer.sub(state.camera.position).normalize();
    const t = -state.camera.position.z / dir.z;
    worldPointer.copy(state.camera.position).addScaledVector(dir, t);
    // …then into THIS object's local space, so the interaction stays under the
    // cursor even after the parent group has rotated (was mirrored 180° before)
    localPointer.copy(worldPointer);
    pts.current.worldToLocal(localPointer);
    u.uPointer.value.lerp(localPointer, 1 - Math.exp(-d * 10));

    const targetStrength = morphState.pointerActive * 0.55;
    u.uPointerStrength.value += (targetStrength - u.uPointerStrength.value) * (1 - Math.exp(-d * 5));

    // consume pending click shockwave (origin also converted to local space)
    if (morphState.shockStamp !== lastShock.current) {
      lastShock.current = morphState.shockStamp;
      shockLocal.set(morphState.shockX, morphState.shockY, 0.5).unproject(state.camera);
      const sd = shockLocal.sub(state.camera.position).normalize();
      const st = -state.camera.position.z / sd.z;
      shockLocal.copy(state.camera.position).addScaledVector(sd, st);
      pts.current.worldToLocal(shockLocal);
      u.uShock.value.set(shockLocal.x, shockLocal.y, shockLocal.z, state.clock.elapsedTime);
    }
  });

  return (
    <group>
      <points ref={pts} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <Synapses positions={name} />
    </group>
  );
}

// Pulsing connection lines between glyph particles; visible in the hero only.
function Synapses({ positions }: { positions: Float32Array }) {
  const mat = useRef<THREE.LineBasicMaterial>(null!);

  const geometry = useMemo(() => {
    const segs: number[] = [];
    const n = positions.length / 3;
    const wanted = 380;
    let tries = 0;
    while (segs.length / 6 < wanted && tries < wanted * 60) {
      tries++;
      const a = Math.floor(Math.random() * n) * 3;
      const b = Math.floor(Math.random() * n) * 3;
      const dx = positions[a] - positions[b];
      const dy = positions[a + 1] - positions[b + 1];
      const dz = positions[a + 2] - positions[b + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > 0.04 && d2 < 0.5) {
        segs.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2]);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs), 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const hero = Math.max(0, 1 - morphState.index * 2) * (1 - morphState.scatter);
    const pulse = 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 2.1);
    mat.current.opacity = 0.14 * hero * pulse * morphState.alpha;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={mat}
        color="#00e0c6"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
