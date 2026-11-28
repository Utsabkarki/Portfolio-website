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
          uBg: { value: new THREE.Color('#07110e') },
          uLow: { value: new THREE.Color('#2e8f5e') },
          uHigh: { value: new THREE.Color('#dfeee6') },
        },
      })
    return [make(false), make(true)]
  }, [])

  useFrame((_, dt) => {
    if (still) return
    const t = fill.uniforms.uTime.value + Math.min(dt, 0.05) * 0.6
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

// A soft radial glow texture, drawn once on a canvas.
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,246,220,0.85)')
  grad.addColorStop(0.35, 'rgba(242,193,78,0.25)')
  grad.addColorStop(1, 'rgba(242,193,78,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

// A pale winter moon.
function Moon({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const aspect = useThree((s) => s.viewport.aspect)
  const glow = useMemo(() => glowTexture(), [])
  useFrame(({ clock }) => {
    const narrow = aspect < 1
    group.current.position.set(narrow ? 2.2 : 7.5, narrow ? 9 : 7.6, -24)
    if (!still) group.current.position.y += Math.sin(clock.elapsedTime * 0.3) * 0.15
  })
  return (
    <group ref={group}>
      <sprite scale={[9, 9, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshBasicMaterial color="#fff6dc" />
      </mesh>
    </group>
  )
}

// GPU snowfall: each flake falls and sways in the vertex shader, wrapping around.
const snowVertex = /* glsl */ `
uniform float uTime;
uniform float uPixel;
attribute float aSeed;
varying float vAlpha;
void main(){
  vec3 p = position;
  float speed = 0.6 + aSeed * 0.9;
  p.y = mod(p.y - uTime * speed, 22.0) - 4.0;
  p.x += sin(uTime * (0.4 + aSeed) + aSeed * 40.0) * 0.6;
  p.z += cos(uTime * 0.3 + aSeed * 17.0) * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPixel * (0.6 + aSeed * 1.4) * (14.0 / -mv.z);
  vAlpha = smoothstep(46.0, 4.0, -mv.z) * (0.45 + aSeed * 0.55);
  gl_Position = projectionMatrix * mv;
}`

const snowFragment = /* glsl */ `
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d) * vAlpha;
  gl_FragColor = vec4(vec3(1.0, 0.99, 0.96), a);
}`

function Snow({ still }: { still: boolean }) {
  const count = 2600
  const dpr = useThree((s) => s.viewport.dpr)
  const [positions, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3)
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 44
      p[i * 3 + 1] = Math.random() * 22
      p[i * 3 + 2] = -Math.random() * 40 + 6
      s[i] = Math.random()
    }
    return [p, s]
  }, [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: snowVertex,
        fragmentShader: snowFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uPixel: { value: 1 } },
      }),
    [],
  )
  useFrame((_, dt) => {
    material.uniforms.uPixel.value = dpr
    if (!still) material.uniforms.uTime.value += Math.min(dt, 0.05)
  })
  return (
    <points material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
    </points>
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
      <pointsMaterial color="#fff1cf" size={0.14} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
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
      <Moon still={still} />
      <Stars still={still} />
      <Snow still={still} />
    </Canvas>
  )
}
