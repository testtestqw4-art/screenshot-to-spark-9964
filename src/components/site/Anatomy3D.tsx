import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import type { JSX } from "react";
import { Quaternion, Vector3 } from "three";
import { organs } from "@/lib/data";

type Id = (typeof organs)[number]["id"];

function Organ({ id, sel, onSel }: { id: Id; sel: Id; onSel: (i: Id) => void }) {
  const o = organs.find((x) => x.id === id)!;
  const active = sel === id;
  const mat = <meshPhysicalMaterial color={o.color} emissive={active ? o.color : "#000"} emissiveIntensity={active ? 0.6 : 0} transparent opacity={sel === "skeleton" && id !== "skeleton" ? 0.35 : active ? 1 : 0.75} roughness={0.4} clearcoat={0.6} />;
  const click = (e: { stopPropagation: () => void }) => { e.stopPropagation(); onSel(id); };
  const p = o.pos as unknown as [number, number, number];
  if (id === "brain") return <mesh position={p} scale={[0.25, 0.22, 0.28]} onClick={click}><sphereGeometry args={[1, 32, 32]} />{mat}</mesh>;
  if (id === "heart") return <mesh position={p} scale={0.22} onClick={click}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>;
  if (id === "lungs") return <group onClick={click}>{[-0.32, 0.32].map((x) => <mesh key={x} position={[x, p[1], p[2]]} scale={[0.25, 0.45, 0.2]}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>)}</group>;
  if (id === "liver") return <mesh position={p} scale={[0.4, 0.18, 0.22]} onClick={click}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>;
  if (id === "kidneys") return <group onClick={click}>{[-0.25, 0.25].map((x) => <mesh key={x} position={[x, p[1], p[2]]} scale={[0.1, 0.16, 0.08]}><sphereGeometry args={[1, 16, 16]} />{mat}</mesh>)}</group>;
  return <group onClick={click}><Skeleton mat={mat} /></group>;
}

type V = [number, number, number];
function Bone({ a, b, r = 0.045, mat }: { a: V; b: V; r?: number; mat: JSX.Element }) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]] as V;
  const len = Math.hypot(...d);
  const mid: V = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(...d).normalize());
  return (
    <group>
      <mesh position={mid} quaternion={q}><capsuleGeometry args={[r, Math.max(len - r * 2, 0.01), 6, 12]} />{mat}</mesh>
      <mesh position={a} scale={r * 1.5}><sphereGeometry args={[1, 12, 12]} />{mat}</mesh>
      <mesh position={b} scale={r * 1.5}><sphereGeometry args={[1, 12, 12]} />{mat}</mesh>
    </group>
  );
}
function Skeleton({ mat }: { mat: JSX.Element }) {
  const limbs: [V, V, number][] = [];
  for (const s of [-1, 1]) {
    limbs.push([[s * 0.08, 1.42, 0.12], [s * 0.5, 1.48, 0.02], 0.03]); // clavicle
    limbs.push([[s * 0.55, 1.42, 0], [s * 0.68, 0.55, 0], 0.05]); // humerus
    limbs.push([[s * 0.68, 0.55, 0], [s * 0.76, -0.25, 0.08], 0.035]); // forearm
    limbs.push([[s * 0.76, -0.25, 0.08], [s * 0.78, -0.5, 0.1], 0.04]); // hand
    limbs.push([[s * 0.24, -0.9, 0], [s * 0.22, -2.0, 0.02], 0.065]); // femur
    limbs.push([[s * 0.22, -2.05, 0.02], [s * 0.2, -3.0, -0.02], 0.05]); // tibia
    limbs.push([[s * 0.2, -3.05, 0], [s * 0.2, -3.08, 0.22], 0.05]); // foot
  }
  return (
    <group position={[0, 0.54, -0.05]} scale={0.75}>
      <mesh position={[0, 2.15, 0]} scale={[0.36, 0.42, 0.42]}><sphereGeometry args={[1, 32, 32]} />{mat}</mesh>
      <mesh position={[0, 1.85, 0.1]} scale={[0.24, 0.13, 0.22]}><sphereGeometry args={[1, 20, 20]} />{mat}</mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[0, 1.7 - i * 0.12, -0.18 + Math.sin(i / 3.5) * 0.05]} scale={[0.07, 0.045, 0.07]}><sphereGeometry args={[1, 12, 10]} />{mat}</mesh>)}
      <mesh position={[0, 1.08, 0.15]} scale={[0.05, 0.32, 0.03]}><boxGeometry args={[1, 1, 1]} />{mat}</mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, 1.36 - i * 0.085, -0.02]} rotation={[Math.PI / 2 - 0.25, 0, 0]} scale={[1, 0.7, 1]}><torusGeometry args={[0.22 + Math.sin(((i + 1) / 11) * Math.PI) * 0.16, 0.018, 8, 36, Math.PI * 1.75]} />{mat}</mesh>)}
      <mesh position={[0, -0.75, -0.02]} rotation={[Math.PI / 2 - 0.3, 0, 0]} scale={[1, 0.8, 1]}><torusGeometry args={[0.28, 0.08, 10, 28]} />{mat}</mesh>
      {limbs.map(([a, b, r], i) => <Bone key={i} a={a} b={b} r={r} mat={mat} />)}
    </group>
  );
}

export default function Anatomy3D({ sel, onSel }: { sel: Id; onSel: (i: Id) => void }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 7], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 4]} intensity={2} />
      <Environment resolution={64}><Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} /></Environment>
      <mesh position={[0, 0.2, 0]} scale={[0.85, 1.5, 0.45]}><capsuleGeometry args={[0.8, 1, 8, 24]} /><meshPhysicalMaterial color="#37C6E8" transparent opacity={0.08} roughness={0.1} depthWrite={false} /></mesh>
      <mesh position={[0, 2.15, 0]} scale={0.42}><sphereGeometry args={[1, 32, 32]} /><meshPhysicalMaterial color="#37C6E8" transparent opacity={0.08} depthWrite={false} /></mesh>
      {organs.map((o) => <Organ key={o.id} id={o.id} sel={sel} onSel={onSel} />)}
      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} />
    </Canvas>
  );
}
