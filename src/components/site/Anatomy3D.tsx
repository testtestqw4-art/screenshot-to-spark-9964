import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { organs } from "@/lib/data";

type Id = (typeof organs)[number]["id"];

function Organ({ id, sel, onSel }: { id: Id; sel: Id; onSel: (i: Id) => void }) {
  const o = organs.find((x) => x.id === id)!;
  const active = sel === id;
  const mat = <meshPhysicalMaterial color={o.color} emissive={active ? o.color : "#000"} emissiveIntensity={active ? 0.6 : 0} transparent opacity={sel === "skeleton" && id !== "skeleton" ? 0.35 : active ? 1 : 0.75} roughness={0.4} clearcoat={0.6} />;
  const click = (e: { stopPropagation: () => void }) => { e.stopPropagation(); onSel(id); };
  const p = o.pos as unknown as [number, number, number];
  if (id === "brain") return <mesh position={p} scale={[0.55, 0.45, 0.6]} onClick={click}><sphereGeometry args={[1, 32, 32]} />{mat}</mesh>;
  if (id === "heart") return <mesh position={p} scale={0.22} onClick={click}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>;
  if (id === "lungs") return <group onClick={click}>{[-0.32, 0.32].map((x) => <mesh key={x} position={[x, p[1], p[2]]} scale={[0.25, 0.45, 0.2]}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>)}</group>;
  if (id === "liver") return <mesh position={p} scale={[0.4, 0.18, 0.22]} onClick={click}><sphereGeometry args={[1, 24, 24]} />{mat}</mesh>;
  if (id === "kidneys") return <group onClick={click}>{[-0.25, 0.25].map((x) => <mesh key={x} position={[x, p[1], p[2]]} scale={[0.1, 0.16, 0.08]}><sphereGeometry args={[1, 16, 16]} />{mat}</mesh>)}</group>;
  return (
    <group onClick={click}>
      <mesh position={[0, 0.3, -0.25]}><cylinderGeometry args={[0.05, 0.05, 2.6]} />{mat}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 1.15 - i * 0.16, -0.05]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]}><torusGeometry args={[0.42 - i * 0.015, 0.025, 8, 32]} />{mat}</mesh>)}
      <mesh position={[0, -0.75, -0.05]} scale={[0.5, 0.2, 0.3]}><torusGeometry args={[0.8, 0.12, 8, 24]} />{mat}</mesh>
      {[-0.22, 0.22].map((x) => <mesh key={x} position={[x, -1.75, 0]}><cylinderGeometry args={[0.06, 0.05, 1.8]} />{mat}</mesh>)}
      {[-0.65, 0.65].map((x) => <mesh key={x} position={[x, 0.4, 0]} rotation={[0, 0, x > 0 ? 0.15 : -0.15]}><cylinderGeometry args={[0.05, 0.04, 1.6]} />{mat}</mesh>)}
    </group>
  );
}

export default function Anatomy3D({ sel, onSel }: { sel: Id; onSel: (i: Id) => void }) {
  return (
    <Canvas camera={{ position: [0, 0.3, 5.5], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 4]} intensity={2} />
      <Environment resolution={64}><Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} /></Environment>
      <mesh position={[0, 0.2, 0]} scale={[0.85, 1.5, 0.45]}><capsuleGeometry args={[0.8, 1, 8, 24]} /><meshPhysicalMaterial color="#37C6E8" transparent opacity={0.08} roughness={0.1} /></mesh>
      <mesh position={[0, 2.15, 0]} scale={0.75}><sphereGeometry args={[1, 32, 32]} /><meshPhysicalMaterial color="#37C6E8" transparent opacity={0.08} /></mesh>
      {organs.map((o) => <Organ key={o.id} id={o.id} sel={sel} onSel={onSel} />)}
      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} />
    </Canvas>
  );
}
