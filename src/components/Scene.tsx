import { Environment, Lightformer, MeshDistortMaterial } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { input } from '../store'

const noise = /* glsl */ `
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float ridged(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(snoise(p));
    s += a * n * n;
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}`

const vertex = /* glsl */ `
uniform float uTime;
varying float vH;
varying float vDist;
${noise}
void main(){
  vec3 p = position;
  vec2 q = vec2(p.x, p.y + uTime) * 0.085;
  float valley = smoothstep(1.0, 15.0, abs(p.x));
  float h = ridged(q) * (0.5 + valley * 7.0);
  p.z += h;
  vH = h / 7.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}`

const fragment = /* glsl */ `
uniform float uWire;
uniform vec3 uBg;
uniform vec3 uLow;
uniform vec3 uHigh;
varying float vH;
varying float vDist;
void main(){
  float fog = smoothstep(46.0, 6.0, vDist);
  vec3 line = mix(uLow, uHigh, smoothstep(0.08, 0.6, vH));
  line = mix(line, vec3(1.0), smoothstep(0.7, 1.0, vH) * 0.7);
  vec3 col = mix(uBg + line * 0.05 * fog, line, uWire * fog);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

function Terrain({ still }: { still: boolean }) {
  const geometry = useMemo(() => new THREE.PlaneGeometry(80, 70, 150, 130), [])
  const [fill, wire] = useMemo(() => {
    const make = (isWire: boolean) =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        wireframe: isWire,
        polygonOffset: !isWire,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        uniforms: {
          uTime: { value: 0 },
          uWire: { value: isWire ? 1 : 0 },
          uBg: { value: new THREE.Color('#07080c') },
          uLow: { value: new THREE.Color('#3b63ff') },
          uHigh: { value: new THREE.Color('#ff3355') },
        },
      })
    return [make(false), make(true)]
  }, [])

  useFrame((_, dt) => {
    if (still) return
    const t = fill.uniforms.uTime.value + Math.min(dt, 0.05) * 1.1
    fill.uniforms.uTime.value = t
    wire.uniforms.uTime.value = t
  })

  return (
    <group rotation-x={-Math.PI / 2} position={[0, -1.2, -22]}>
      <mesh geometry={geometry} material={fill} />
      <mesh geometry={geometry} material={wire} />
    </group>
  )
}

function Orb({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const shell = useRef<THREE.Mesh>(null!)
  const aspect = useThree((s) => s.viewport.aspect)
  const narrow = aspect < 1

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const s = input.scroll
    const baseX = narrow ? 0 : 3.1
    const baseY = narrow ? 5.4 : 3.6
    group.current.position.set(baseX + s * (narrow ? 0 : 0.6), baseY + s * 1.6 + (still ? 0 : Math.sin(t * 0.7) * 0.15), -3)
    const k = (narrow ? 0.72 : 1) * (1 + Math.min(s, 2) * 0.12)
    group.current.scale.setScalar(k)
    if (still) return
    group.current.rotation.y += dt * 0.15
    shell.current.rotation.x -= dt * 0.22
    shell.current.rotation.z += dt * 0.12
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.25, 24]} />
        <MeshDistortMaterial color="#0b0d16" metalness={1} roughness={0.22} distort={still ? 0.25 : 0.38} speed={still ? 0 : 1.6} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.95, 1]} />
        <meshBasicMaterial color="#8aa2ff" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function Stars({ still }: { still: boolean }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(1400 * 3)
    for (let i = 0; i < 1400; i++) {
      const r = 38 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.95)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi) - 4
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])
  useFrame((_, dt) => {
    if (!still) ref.current.rotation.y += dt * 0.008
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#cfd8ff" size={0.14} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}

function Rig() {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }, dt) => {
    const s = Math.min(input.scroll, 4)
    const k = 1 - Math.exp(-dt * 3)
    camera.position.x += (input.px * 0.7 - camera.position.x) * k
    camera.position.y += (2.6 + s * 1.3 - input.py * 0.25 - camera.position.y) * k
    target.set(camera.position.x * 0.3, 2.6 + s * 0.5, -10)
    camera.lookAt(target)
  })
  return null
}

export default function Scene() {
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.6, 9], fov: 50, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Rig />
      <Terrain still={still} />
      <Orb still={still} />
      <Stars still={still} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#0a0d1c']} />
        <Lightformer form="rect" intensity={5} color="#ff3355" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[14, 10, 1]} />
        <Lightformer form="rect" intensity={5} color="#4d7cff" position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[14, 10, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="ring" intensity={6} color="#ffffff" position={[1, 2, 7]} scale={2} />
      </Environment>
    </Canvas>
  )
}
