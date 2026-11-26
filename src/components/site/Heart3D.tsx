import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, useGLTF, Center, Sparkles, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, Component, type ReactNode } from "react";
import { Box3, Vector3, type Group } from "three";
import { useMemo } from "react";
import heart from "@/assets/models/anatomical-heart.glb.asset.json";

function Model() {
  const { scene } = useGLTF(heart.url);
  const k = useMemo(() => { const v = new Box3().setFromObject(scene).getSize(new Vector3()); return 2.6 / Math.max(v.x, v.y, v.z, 0.001); }, [scene]);
  const ref = useRef<Group>(null);
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += Math.min(d, 0.05) * 0.3;
    ref.current.rotation.x += (s.pointer.y * 0.3 - ref.current.rotation.x) * 0.05;
  });
  return <group ref={ref}><Center><primitive object={scene} scale={k} /></Center></group>;
}

function FallbackHeart() {
  const ref = useRef<Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.4; });
  return (
    <group ref={ref}>
      <mesh><icosahedronGeometry args={[1.3, 3]} /><meshPhysicalMaterial color="#e2566b" roughness={0.3} clearcoat={1} /></mesh>
      <mesh scale={1.35}><icosahedronGeometry args={[1.3, 2]} /><meshBasicMaterial color="#37C6E8" wireframe transparent opacity={0.25} /></mesh>
    </group>
  );
}

class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? <FallbackHeart /> : this.props.children; }
}

function Fit({ children }: { children: ReactNode }) {
  return <group scale={1}>{children}</group>;
}

export default function Heart3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]} onCreated={(s) => s.gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "1")}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <pointLight position={[-3, -1, 2]} color="#37C6E8" intensity={20} />
      <Sparkles count={70} scale={6} size={2.5} color="#37C6E8" speed={0.3} />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color="#8bd" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Float speed={1.5} floatIntensity={0.6}>
        <Boundary><Suspense fallback={<FallbackHeart />}><Fit><AutoScale /></Fit></Suspense></Boundary>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

function AutoScale() {
  return <Model />;
}
