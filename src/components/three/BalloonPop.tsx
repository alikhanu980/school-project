"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useVisible } from "./useVisible";

const COLORS = ["#FF6B5B", "#FFC83D", "#3CC8A0", "#5AB4F0", "#B79CFF", "#FF8FC7", "#FF9F43"];
const TOP = 6;

type B = { id: number; x: number; z: number; speed: number; color: string; gold: boolean; wob: number };
type P = { id: number; pos: THREE.Vector3; color: string };

let audio: AudioContext | null = null;
function popSound(gold: boolean) {
  try {
    audio ??= new AudioContext();
    const a = audio;
    const t = a.currentTime;
    // short noise burst = "pop"
    const buf = a.createBuffer(1, a.sampleRate * 0.08, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    const src = a.createBufferSource();
    const g = a.createGain();
    src.buffer = buf;
    g.gain.value = 0.5;
    src.connect(g).connect(a.destination);
    src.start(t);
    if (gold) {
      [880, 1320, 1760].forEach((f, i) => {
        const o = a.createOscillator();
        const og = a.createGain();
        o.frequency.value = f;
        og.gain.setValueAtTime(0.0001, t + i * 0.07);
        og.gain.exponentialRampToValueAtTime(0.15, t + i * 0.07 + 0.01);
        og.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.25);
        o.connect(og).connect(a.destination);
        o.start(t + i * 0.07);
        o.stop(t + i * 0.07 + 0.3);
      });
    }
  } catch {}
}

function Balloon({ b, onPop, onEscape }: { b: B; onPop: (b: B, p: THREE.Vector3) => void; onEscape: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  const y = useRef(-4.5);
  const [hover, setHover] = useState(false);
  useFrame((s, dt) => {
    const g = ref.current;
    if (!g) return;
    y.current += b.speed * dt;
    g.position.set(b.x + Math.sin(s.clock.elapsedTime * 1.5 + b.wob) * 0.25, y.current, b.z);
    g.rotation.z = Math.sin(s.clock.elapsedTime * 2 + b.wob) * 0.12;
    const k = THREE.MathUtils.damp(g.scale.x, hover ? 1.12 : 1, 10, dt);
    g.scale.setScalar(k);
    if (y.current > TOP) onEscape(b.id);
  });
  return (
    <group
      ref={ref}
      position={[b.x, -4.5, b.z]}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onPop(b, ref.current!.position.clone());
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh scale={[1, 1.18, 1]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial color={b.gold ? "#FFD54A" : b.color} roughness={0.15} clearcoat={1} metalness={b.gold ? 0.6 : 0} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <coneGeometry args={[0.08, 0.14, 8]} />
        <meshStandardMaterial color={b.gold ? "#FFD54A" : b.color} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {b.gold && (
        <mesh position={[0, 0, 0.56]}>
          <circleGeometry args={[0.16, 5]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      )}
    </group>
  );
}

/** Confetti-ish shards flying out from a popped balloon. */
function Burst({ p, onDone }: { p: P; onDone: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  const dirs = useMemo(() => Array.from({ length: 14 }, () => new THREE.Vector3().randomDirection().multiplyScalar(2 + Math.random() * 3)), []);
  useFrame((_, dt) => {
    t.current += dt;
    const g = ref.current;
    if (!g) return;
    g.children.forEach((c, i) => {
      c.position.copy(dirs[i]).multiplyScalar(t.current);
      c.position.y -= 4 * t.current * t.current;
      c.rotation.x += dt * 8;
      c.scale.setScalar(Math.max(0, 1 - t.current / 0.7));
    });
    if (t.current > 0.7) onDone(p.id);
  });
  return (
    <group ref={ref} position={p.pos}>
      {dirs.map((_, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.12, 0.12, 0.02]} />
          <meshBasicMaterial color={i % 3 ? p.color : "#ffffff"} />
        </mesh>
      ))}
    </group>
  );
}

function Game({ playing, onScore }: { playing: boolean; onScore: (n: number) => void }) {
  const [balloons, setBalloons] = useState<B[]>([]);
  const [bursts, setBursts] = useState<P[]>([]);
  const id = useRef(0);

  useEffect(() => {
    if (!playing) {
      setBalloons([]);
      return;
    }
    const spawn = setInterval(() => {
      setBalloons((bs) =>
        bs.length > 18
          ? bs
          : [
              ...bs,
              {
                id: id.current++,
                x: (Math.random() - 0.5) * 9,
                z: (Math.random() - 0.5) * 2,
                speed: 1.4 + Math.random() * 1.6 + id.current * 0.01,
                color: COLORS[id.current % COLORS.length],
                gold: Math.random() < 0.1,
                wob: Math.random() * 6,
              },
            ],
      );
    }, 420);
    return () => clearInterval(spawn);
  }, [playing]);

  return (
    <>
      {balloons.map((b) => (
        <Balloon
          key={b.id}
          b={b}
          onEscape={(i) => setBalloons((bs) => bs.filter((x) => x.id !== i))}
          onPop={(bb, pos) => {
            popSound(bb.gold);
            onScore(bb.gold ? 5 : 1);
            setBalloons((bs) => bs.filter((x) => x.id !== bb.id));
            setBursts((ps) => [...ps, { id: bb.id, pos, color: bb.gold ? "#FFD54A" : bb.color }]);
          }}
        />
      ))}
      {bursts.map((p) => (
        <Burst key={p.id} p={p} onDone={(i) => setBursts((ps) => ps.filter((x) => x.id !== i))} />
      ))}
    </>
  );
}

export default function BalloonPop({ playing, onScore }: { playing: boolean; onScore: (n: number) => void }) {
  const [box, visible] = useVisible<HTMLDivElement>();
  return (
    <div ref={box} className="h-full w-full">
    <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.5, 9], fov: 50 }} style={{ touchAction: "pan-y" }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 5]} intensity={1.4} />
      <Environment resolution={64}>
        <Lightformer form="ring" intensity={3} position={[2, 3, 5]} scale={3} />
        <Lightformer form="rect" intensity={1.5} position={[-4, 0, 3]} scale={[2, 5, 1]} />
      </Environment>
      <Game playing={playing} onScore={onScore} />
    </Canvas>
    </div>
  );
}
