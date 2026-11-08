/**
 * 3D starfield background (Three.js via React Three Fiber).
 * - The camera slowly pushes forward as you scroll (reads window scroll progress).
 * - Rendering pauses when the browser tab is hidden.
 * Loaded lazily so it never blocks the first paint.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const STAR_COUNT = 2200;

function Stars() {
  const ref = useRef<THREE.Points>(null);
  // Random star positions + gold/violet/white tints, built once.
  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(STAR_COUNT * 3);
    const c = new Float32Array(STAR_COUNT * 3);
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#FFB454"), new THREE.Color("#b9a4ff")];
    for (let i = 0; i < STAR_COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = -Math.random() * 120 + 10;
      const col = palette[Math.random() < 0.7 ? 0 : Math.random() < 0.5 ? 1 : 2];
      c.set([col.r, col.g, col.b], i * 3);
    }
    return [p, c];
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const max = document.documentElement.scrollHeight - window.innerHeight || 1;
    const progress = window.scrollY / max;
    // Camera push: from z=5 to z=-60 across the whole page (smoothed).
    const targetZ = 5 - progress * 65;
    state.camera.position.z += (targetZ - state.camera.position.z) * (1 - Math.exp(-4 * dt));
    // Subtle mouse parallax.
    state.camera.position.x += (state.pointer.x * 1.2 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.8 - state.camera.position.y) * 0.03;
    if (ref.current) ref.current.rotation.z += dt * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function Starfield() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={[1, 2]} /* cap pixel ratio at 2 */
      camera={{ position: [0, 0, 5], fov: 70 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#0d0b14", 20, 70]} />
      <Stars />
    </Canvas>
  );
}
