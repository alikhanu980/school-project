"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useVisible } from "./useVisible";
import { CuboidCollider, Physics, RigidBody, type RapierRigidBody } from "@react-three/rapier";

const COLORS = ["#FF6B5B", "#FFC83D", "#3CC8A0", "#5AB4F0", "#B79CFF", "#FF8FC7"];
const MAX = 70;
const W = 5; // half-width of the tub
const D = 3; // half-depth

type B = { id: number; p: [number, number, number]; c: string; r: number };

function Ball({ b, onPop }: { b: B; onPop: () => void }) {
  const rb = useRef<RapierRigidBody>(null);
  return (
    <RigidBody ref={rb} colliders="ball" restitution={0.75} friction={0.4} position={b.p}>
      <mesh
        castShadow
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          rb.current?.applyImpulse({ x: (Math.random() - 0.5) * 3, y: 7 + Math.random() * 3, z: (Math.random() - 0.5) * 2 }, true);
          rb.current?.applyTorqueImpulse({ x: Math.random(), y: Math.random(), z: Math.random() }, true);
          onPop();
        }}
      >
        <sphereGeometry args={[b.r, 32, 32]} />
        <meshStandardMaterial color={b.c} roughness={0.25} metalness={0.05} />
      </mesh>
    </RigidBody>
  );
}

function Tub() {
  const wall = "#FFFFFF";
  return (
    <RigidBody type="fixed" restitution={0.4}>
      <CuboidCollider args={[W, 0.2, D]} position={[0, -0.2, 0]} />
      <CuboidCollider args={[0.2, 4, D]} position={[-W - 0.2, 4, 0]} />
      <CuboidCollider args={[0.2, 4, D]} position={[W + 0.2, 4, 0]} />
      <CuboidCollider args={[W, 4, 0.2]} position={[0, 4, -D - 0.2]} />
      <CuboidCollider args={[W, 4, 0.2]} position={[0, 4, D + 0.2]} />
      <RoundedBox args={[W * 2 + 0.8, 0.4, D * 2 + 0.8]} position={[0, -0.2, 0]} radius={0.15} receiveShadow>
        <meshStandardMaterial color="#FFF3C4" />
      </RoundedBox>
      <RoundedBox args={[0.4, 1.2, D * 2 + 0.8]} position={[-W - 0.2, 0.4, 0]} radius={0.15}>
        <meshStandardMaterial color={wall} />
      </RoundedBox>
      <RoundedBox args={[0.4, 1.2, D * 2 + 0.8]} position={[W + 0.2, 0.4, 0]} radius={0.15}>
        <meshStandardMaterial color={wall} />
      </RoundedBox>
      <RoundedBox args={[W * 2 + 0.8, 1.2, 0.4]} position={[0, 0.4, -D - 0.2]} radius={0.15}>
        <meshStandardMaterial color={wall} />
      </RoundedBox>
    </RigidBody>
  );
}

/** Bump `nonce` to fire a command from outside the canvas. */
export type PitSignal = { kind: "rain" | "clear"; n?: number; nonce: number };

export default function BallPit({ signal, onCount, onPop }: { signal?: PitSignal; onCount?: (n: number) => void; onPop?: () => void }) {
  const [box, visible] = useVisible<HTMLDivElement>();
  const [balls, setBalls] = useState<B[]>([]);
  const id = useRef(0);

  const add = (x: number, z: number) =>
    setBalls((bs) => {
      const next = [
        ...bs,
        { id: id.current++, p: [x, 6 + Math.random() * 2, z] as [number, number, number], c: COLORS[id.current % COLORS.length], r: 0.35 + Math.random() * 0.25 },
      ].slice(-MAX);
      onCount?.(next.length);
      return next;
    });

  useEffect(() => {
    if (!signal) return;
    if (signal.kind === "clear") {
      setBalls([]);
      onCount?.(0);
      return;
    }
    const timers = Array.from({ length: signal.n ?? 20 }, (_, i) =>
      setTimeout(() => add((Math.random() - 0.5) * W * 1.6, (Math.random() - 0.5) * D * 1.6), i * 60),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal?.nonce]);

  const seed = useMemo(() => {
    // a few balls already waiting so the tub isn't empty
    return Array.from({ length: 12 }, (_, i) => ({
      id: -i - 1,
      p: [(Math.random() - 0.5) * 6, 1 + i * 0.6, (Math.random() - 0.5) * 3] as [number, number, number],
      c: COLORS[i % COLORS.length],
      r: 0.4 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <div ref={box} className="h-full w-full">
    <Canvas frameloop={visible ? "always" : "never"} shadows dpr={[1, 1.5]} camera={{ position: [0, 7, 10], fov: 42 }} style={{ touchAction: "pan-y" }} onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 6]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment resolution={64}>
        <Lightformer form="ring" intensity={2} position={[0, 5, 5]} scale={6} />
      </Environment>
      <Physics gravity={[0, -12, 0]}>
        <Tub />
        {[...seed, ...balls].map((b) => (
          <Ball key={b.id} b={b} onPop={() => onPop?.()} />
        ))}
        {/* invisible catch-plane: tap anywhere above the tub to drop a ball */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={(e) => add(Math.max(-W + 0.5, Math.min(W - 0.5, e.point.x)), Math.max(-D + 0.5, Math.min(D - 0.5, e.point.z)))} visible={false}>
          <planeGeometry args={[W * 2, D * 2]} />
        </mesh>
      </Physics>
      <ContactShadows position={[0, -0.39, 0]} opacity={0.35} scale={16} blur={2.5} />
    </Canvas>
    </div>
  );
}
