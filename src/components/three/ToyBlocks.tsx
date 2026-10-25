"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Float, Lightformer, Environment, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useVisible } from "./useVisible";
import { burst } from "@/components/kids/confetti";

const COLORS = ["#FF6B5B", "#FFC83D", "#3CC8A0", "#5AB4F0", "#B79CFF", "#FF8FC7"];
const FONT = "/fonts/Fredoka.ttf";

/** One toy block: bobs on its own, spins + squashes when poked. */
function Block({ ch, position, color, delay }: { ch: string; position: [number, number, number]; color: string; delay: number }) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ spin: 0, squash: 0 });
  const [hover, setHover] = useState(false);
  const born = useRef(-1);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    if (born.current < 0) born.current = state.clock.elapsedTime;
    // drop-in entrance, staggered per letter
    const t = Math.min(1, Math.max(0, (state.clock.elapsedTime - born.current - delay) / 0.9));
    const e = 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 1.6);
    g.position.y = THREE.MathUtils.lerp(position[1] + 6, position[1], e);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target.current.spin, 5, dt);
    // pointer lean
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.35, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.12, 3, dt);
    target.current.squash = THREE.MathUtils.damp(target.current.squash, 0, 6, dt);
    const s = (hover ? 1.12 : 1) + target.current.squash;
    g.scale.set(
      THREE.MathUtils.damp(g.scale.x, s + target.current.squash * 0.4, 8, dt),
      THREE.MathUtils.damp(g.scale.y, s - target.current.squash * 0.6, 8, dt),
      THREE.MathUtils.damp(g.scale.z, s, 8, dt),
    );
  });

  const poke = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    target.current.spin += Math.PI * 2;
    target.current.squash = 0.5;
    burst(e.nativeEvent.clientX, e.nativeEvent.clientY, [color, "#ffffff", "#FFC83D"]);
  };

  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.9} floatingRange={[-0.12, 0.12]}>
      <group
        ref={ref}
        position={position}
        onPointerDown={poke}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
      >
        <RoundedBox args={[1, 1, 1]} radius={0.16} smoothness={4} castShadow>
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
        </RoundedBox>
        {[0, Math.PI].map((r, i) => (
          <group key={i} rotation={[0, r, 0]}>
            <Text font={FONT} position={[0, -0.04, 0.505]} fontSize={0.72} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#00000022">
              {ch}
            </Text>
          </group>
        ))}
      </group>
    </Float>
  );
}

/** Little background toys: rings, balls, a pencil, all drifting. */
function Toys() {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        kind: i % 4,
        pos: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 7, -2 - Math.random() * 5] as [number, number, number],
        color: COLORS[i % COLORS.length],
        scale: 0.3 + Math.random() * 0.45,
        speed: 0.5 + Math.random() * 1.5,
      })),
    [],
  );
  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={it.speed} rotationIntensity={2} floatIntensity={2}>
          <mesh position={it.pos} scale={it.scale}>
            {it.kind === 0 && <torusGeometry args={[0.7, 0.28, 16, 40]} />}
            {it.kind === 1 && <sphereGeometry args={[0.7, 32, 32]} />}
            {it.kind === 2 && <octahedronGeometry args={[0.8]} />}
            {it.kind === 3 && <coneGeometry args={[0.6, 1.4, 6]} />}
            <meshStandardMaterial color={it.color} roughness={0.4} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Shrinks the word to fit narrow canvases. */
function Fit({ width, children }: { width: number; children: React.ReactNode }) {
  const vw = useThree((s) => s.viewport.width);
  const k = Math.min(1, (vw * 0.92) / width);
  return <group scale={k}>{children}</group>;
}

function Rig() {
  useFrame((state, dt) => {
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.8, 2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.3 + state.pointer.y * 0.4, 2, dt);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ToyBlocks({ words = ["THINK", "WELL"], compact = false, startDelay = 0 }: { words?: string[]; compact?: boolean; startDelay?: number }) {
  const [box, visible] = useVisible<HTMLDivElement>();
  const blocks = useMemo(() => {
    const out: { ch: string; position: [number, number, number]; color: string; delay: number }[] = [];
    let n = 0;
    words.forEach((w, row) => {
      const gap = 1.22;
      [...w].forEach((ch, i) => {
        out.push({
          ch,
          position: [(i - (w.length - 1) / 2) * gap, (words.length - 1) * 0.68 - row * 1.36, (i % 2) * 0.25],
          color: COLORS[n % COLORS.length],
          delay: startDelay + n * 0.09,
        });
        n++;
      });
    });
    return out;
  }, [words, startDelay]);

  return (
    <div ref={box} className="h-full w-full">
    <Canvas frameloop={visible ? "always" : "never"}
      dpr={[1, 1.5]}
      shadows
      camera={{ position: [0, 0.3, compact ? 9.5 : 8], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment resolution={64}>
        <Lightformer form="ring" intensity={2.2} position={[0, 3, 4]} scale={5} />
        <Lightformer form="rect" intensity={1.4} color="#FFC83D" position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#5AB4F0" position={[5, 0, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Fit width={Math.max(...words.map((w) => w.length)) * 1.22 + 0.4}>
        <group position={[0, 0.2, 0]}>
          {blocks.map((b, i) => (
            <Block key={i} {...b} />
          ))}
        </group>
      </Fit>
      <Toys />
      <ContactShadows position={[0, -2.1, 0]} opacity={0.3} scale={14} blur={2.6} far={4} />
      <Rig />
    </Canvas>
    </div>
  );
}
