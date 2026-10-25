"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useVisible } from "./useVisible";
import type { OrbitControls as OrbitImpl } from "three-stdlib";

import { SPOTS, type Spot } from "@/data/spots";

const NAVY = "#14284a";
const GOLD = "#C9A24B";

function Tree({ p, s = 1 }: { p: [number, number, number]; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.5, 6]} />
        <meshStandardMaterial color="#7A4E2D" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#4CAF6A" flatShading />
      </mesh>
    </group>
  );
}

function SchoolBuilding() {
  return (
    <group position={[0, 0.3, -0.8]}>
      <RoundedBox args={[3, 1.6, 1.3]} radius={0.06} position={[0, 0.8, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={NAVY} />
      </RoundedBox>
      {/* gold trim + roof */}
      <mesh position={[0, 1.64, 0]} castShadow>
        <boxGeometry args={[3.15, 0.1, 1.45]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* windows */}
      {[-1.1, -0.55, 0.55, 1.1].map((x) =>
        [0.5, 1.15].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.66]}>
            <boxGeometry args={[0.3, 0.34, 0.02]} />
            <meshStandardMaterial color="#FFE7A3" emissive="#FFC83D" emissiveIntensity={0.6} />
          </mesh>
        )),
      )}
      {/* crest above door */}
      <mesh position={[0, 1.15, 0.67]}>
        <circleGeometry args={[0.2, 24]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.35, 0.66]}>
        <boxGeometry args={[0.4, 0.7, 0.03]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* flag */}
      <mesh position={[1.3, 2.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
      <Flag />
    </group>
  );
}

function Flag() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 3) * 0.25;
  });
  return (
    <mesh ref={ref} position={[1.5, 2.42, 0]}>
      <boxGeometry args={[0.4, 0.24, 0.01]} />
      <meshStandardMaterial color={GOLD} />
    </mesh>
  );
}

function Labs() {
  return (
    <group position={[-3.2, 0.3, -1.4]}>
      <RoundedBox args={[1.4, 0.9, 1.1]} radius={0.05} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#EDE6D6" />
      </RoundedBox>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5AB4F0" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* little robot */}
      <Float speed={4} floatIntensity={0.6}>
        <group position={[0.85, 0.35, 0.55]} scale={0.6}>
          <RoundedBox args={[0.4, 0.4, 0.3]} radius={0.06}>
            <meshStandardMaterial color="#B0BEC5" metalness={0.6} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.3, 0.25, 0.25]} />
            <meshStandardMaterial color="#B0BEC5" metalness={0.6} roughness={0.3} />
          </mesh>
          {[-0.07, 0.07].map((x) => (
            <mesh key={x} position={[x, 0.37, 0.13]}>
              <sphereGeometry args={[0.035]} />
              <meshStandardMaterial color="#3CC8A0" emissive="#3CC8A0" emissiveIntensity={2} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

function Farm() {
  const crops = useMemo(() => Array.from({ length: 12 }, (_, i) => [(i % 4) * 0.32 - 0.5, Math.floor(i / 4) * 0.35 - 0.35] as const), []);
  const bunny = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bunny.current) {
      bunny.current.position.y = 0.42 + Math.abs(Math.sin(t * 4)) * 0.18;
      bunny.current.position.x = 3.6 + Math.sin(t * 0.8) * 0.5;
      bunny.current.rotation.y = Math.cos(t * 0.8) > 0 ? -Math.PI / 2 : Math.PI / 2;
    }
  });
  return (
    <group>
      <group position={[2.9, 0.32, 1.7]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.6, 0.04, 1.3]} />
          <meshStandardMaterial color="#8D5A3B" />
        </mesh>
        {crops.map(([x, z], i) => (
          <mesh key={i} position={[x, 0.15, z]} castShadow>
            <coneGeometry args={[0.09, 0.28, 5]} />
            <meshStandardMaterial color={i % 3 ? "#7BC86C" : "#FF9F43"} flatShading />
          </mesh>
        ))}
        {/* fence */}
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[-0.8 + i * 0.2, 0.15, 0.7]}>
            <boxGeometry args={[0.04, 0.3, 0.04]} />
            <meshStandardMaterial color="#F7F3EA" />
          </mesh>
        ))}
      </group>
      {/* bouncing bunny */}
      <group ref={bunny} position={[3.6, 0.42, 2.7]} scale={0.7}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0.15, 0.12, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {[-0.04, 0.04].map((z) => (
          <mesh key={z} position={[0.15, 0.3, z]} rotation={[0, 0, -0.2]}>
            <capsuleGeometry args={[0.03, 0.16]} />
            <meshStandardMaterial color="#FFD5DC" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Sport() {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ball.current) {
      ball.current.position.x = -2.6 + Math.sin(t * 1.4) * 0.9;
      ball.current.position.y = 0.42 + Math.abs(Math.sin(t * 2.8)) * 0.35;
      ball.current.rotation.z -= 0.08;
    }
  });
  return (
    <group>
      <mesh position={[-2.6, 0.31, 2.4]} receiveShadow>
        <boxGeometry args={[2.4, 0.03, 1.5]} />
        <meshStandardMaterial color="#3FA34D" />
      </mesh>
      <mesh position={[-2.6, 0.33, 2.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.32, 32]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {[-3.75, -1.45].map((x) => (
        <mesh key={x} position={[x, 0.5, 2.4]}>
          <boxGeometry args={[0.05, 0.35, 0.6]} />
          <meshStandardMaterial color="#fff" wireframe />
        </mesh>
      ))}
      <mesh ref={ball} position={[-2.6, 0.42, 2.4]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}

function Market() {
  const colors = ["#FF6B5B", "#FFC83D", "#3CC8A0"];
  return (
    <group position={[3.3, 0.3, -1.8]}>
      {colors.map((c, i) => (
        <group key={c} position={[(i - 1) * 0.65, 0, (i % 2) * 0.3]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.4]} />
            <meshStandardMaterial color="#C8945F" />
          </mesh>
          {[-0.22, 0.22].map((x) => (
            <mesh key={x} position={[x, 0.55, 0.17]}>
              <cylinderGeometry args={[0.015, 0.015, 0.4]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
          ))}
          <mesh position={[0, 0.8, 0.05]} rotation={[0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.04, 0.55]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Library() {
  const books = ["#FF6B5B", "#5AB4F0", "#FFC83D", "#3CC8A0", "#B79CFF"];
  return (
    <group position={[0.6, 0.3, 2.5]}>
      <RoundedBox args={[1.3, 0.7, 0.8]} radius={0.05} position={[0, 0.35, 0]} castShadow>
        <meshStandardMaterial color="#F7F3EA" />
      </RoundedBox>
      <mesh position={[0, 0.82, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.85, 0.35, 4]} />
        <meshStandardMaterial color={GOLD} />
      </mesh>
      {/* giant open book on the lawn */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0.95, 0.35, 0.3]} rotation={[0, -0.6, 0]}>
          {books.map((c, i) => (
            <mesh key={c} position={[0, i * 0.07, 0]} rotation={[0, i * 0.2, 0]} castShadow>
              <boxGeometry args={[0.32, 0.06, 0.22]} />
              <meshStandardMaterial color={c} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

function Island() {
  const trees: [number, number, number][] = [
    [-1.8, 0.3, -2.4], [-0.6, 0.3, -2.6], [1.6, 0.3, -2.5], [-4.2, 0.3, 0.6], [4.4, 0.3, 0.2], [-1.2, 0.3, 3.6], [2.2, 0.3, 3.5], [-4, 0.3, -0.6], [1.9, 0.3, 0.7],
  ];
  return (
    <group>
      {/* grass top + earthy cliff */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.2, 0.3, 48]} />
        <meshStandardMaterial color="#8BD17C" />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[5.2, 3.6, 1.2, 48]} />
        <meshStandardMaterial color="#C98B5B" flatShading />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <coneGeometry args={[3.6, 1.6, 9]} />
        <meshStandardMaterial color="#A86E45" flatShading />
      </mesh>
      {/* paths */}
      <mesh position={[0, 0.305, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2, 48]} />
        <meshStandardMaterial color="#F2E3C2" />
      </mesh>
      {trees.map((p, i) => (
        <Tree key={i} p={p} s={0.8 + (i % 3) * 0.15} />
      ))}
      <SchoolBuilding />
      <Labs />
      <Farm />
      <Sport />
      <Market />
      <Library />
    </group>
  );
}

/** Projects each hotspot to screen space and moves its DOM pin there (no extra React roots). */
function Projector({ pins }: { pins: React.RefObject<(HTMLElement | null)[]> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size, clock }) => {
    SPOTS.forEach((s, i) => {
      const el = pins.current?.[i];
      if (!el) return;
      v.set(s.pos[0], s.pos[1] + Math.sin(clock.elapsedTime * 2 + s.pos[0]) * 0.08, s.pos[2]).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      el.style.opacity = v.z < 1 ? "1" : "0";
    });
  });
  return null;
}

function CameraFly({ target, controls }: { target: Spot | null; controls: React.RefObject<OrbitImpl | null> }) {
  const goal = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const c = controls.current;
    if (!c) return;
    if (target) {
      look.set(target.pos[0], 0.6, target.pos[2]);
      const dir = new THREE.Vector3(target.pos[0], 0, target.pos[2]).normalize();
      goal.set(target.pos[0] + dir.x * 4.4, 3.6, target.pos[2] + dir.z * 4.4 + (dir.lengthSq() < 0.1 ? 5 : 0));
      state.camera.position.lerp(goal, 1 - Math.exp(-dt * 2.5));
      c.target.lerp(look, 1 - Math.exp(-dt * 2.5));
    }
    c.update();
  });
  return null;
}

export default function CampusIsland({ active, onPick, pins }: { active: Spot | null; onPick: (s: Spot | null) => void; pins: React.RefObject<(HTMLElement | null)[]> }) {
  const [box, visible] = useVisible<HTMLDivElement>();
  const controls = useRef<OrbitImpl | null>(null);
  return (
    <div ref={box} className="h-full w-full">
    <Canvas frameloop={visible ? "always" : "never"} shadows dpr={[1, 1.5]} camera={{ position: [9, 7, 9], fov: 38 }} style={{ touchAction: "pan-y" }}>
      <color attach="background" args={["#BFE6FF"]} />
      <fog attach="fog" args={["#BFE6FF", 18, 34]} />
      <hemisphereLight args={["#ffffff", "#8BD17C", 0.9]} />
      <directionalLight position={[6, 10, 4]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} />
      <Float speed={1} rotationIntensity={0} floatIntensity={0.4}>
        <group onPointerMissed={() => onPick(null)} onClick={(e: ThreeEvent<MouseEvent>) => e.stopPropagation()}>
          <Island />
        </group>
      </Float>
      {/* puffy clouds */}
      {[[-6.5, -1.6, -3], [6.5, -1.2, -2.5], [-3.5, -2, 6], [4.5, -1.8, 5.5], [0, -2.2, -7]].map((p, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={2}>
          <group position={p as [number, number, number]}>
            {[0, 0.5, -0.5].map((x, j) => (
              <mesh key={j} position={[x, j ? -0.1 : 0.1, 0]}>
                <sphereGeometry args={[j ? 0.5 : 0.7, 16, 16]} />
                <meshStandardMaterial color="#fff" />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
      <Sparkles count={40} scale={[10, 4, 10]} position={[0, 2, 0]} size={3} color="#FFC83D" speed={0.4} />
      <ContactShadows position={[0, -2.4, 0]} opacity={0.25} scale={14} blur={3} far={5} />
      <OrbitControls ref={controls} enablePan={false} enableZoom={false} minPolarAngle={0.5} maxPolarAngle={1.25} autoRotate={!active} autoRotateSpeed={0.6} enableDamping />
      <CameraFly target={active} controls={controls} />
      <Projector pins={pins} />
    </Canvas>
    </div>
  );
}
