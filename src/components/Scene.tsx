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
          uBg: { value: new THREE.Color('#0a0710') },
          uLow: { value: new THREE.Color('#7b2fe0') },
          uHigh: { value: new THREE.Color('#ff7518') },
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

// A soft radial glow texture, drawn once on a canvas.
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,190,120,0.9)')
  grad.addColorStop(0.35, 'rgba(255,120,40,0.35)')
  grad.addColorStop(1, 'rgba(255,90,20,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function batShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.12)
  s.quadraticCurveTo(0.18, 0.3, 0.42, 0.22)
  s.quadraticCurveTo(0.7, 0.16, 1, 0.32)
  s.quadraticCurveTo(0.86, 0.06, 0.92, -0.14)
  s.quadraticCurveTo(0.74, -0.04, 0.6, -0.16)
  s.quadraticCurveTo(0.48, -0.02, 0.34, -0.18)
  s.quadraticCurveTo(0.2, -0.04, 0.08, -0.12)
  s.lineTo(0, -0.2)
  s.lineTo(-0.08, -0.12)
  s.quadraticCurveTo(-0.2, -0.04, -0.34, -0.18)
  s.quadraticCurveTo(-0.48, -0.02, -0.6, -0.16)
  s.quadraticCurveTo(-0.74, -0.04, -0.92, -0.14)
  s.quadraticCurveTo(-0.86, 0.06, -1, 0.32)
  s.quadraticCurveTo(-0.7, 0.16, -0.42, 0.22)
  s.quadraticCurveTo(-0.18, 0.3, 0, 0.12)
  return new THREE.ShapeGeometry(s)
}

function Moon({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const aspect = useThree((s) => s.viewport.aspect)
  const narrow = aspect < 1
  const glow = useMemo(() => glowTexture(), [])
  const moonMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: /* glsl */ `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix * normal); vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `varying vec3 vN; varying vec3 vP;
          float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
          float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
            return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
          void main(){
            float craters = n(vP*2.2)*0.6 + n(vP*5.0)*0.3 + n(vP*11.0)*0.1;
            vec3 base = mix(vec3(1.0,0.55,0.2), vec3(1.0,0.86,0.6), smoothstep(0.35,0.7,craters));
            float rim = pow(1.0 - max(dot(vN, vec3(0,0,1)), 0.0), 2.0);
            gl_FragColor = vec4(base * (0.85 + 0.25*rim), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  const bats = useRef<THREE.Group>(null!)
  const batGeo = useMemo(() => batShape(), [])
  const batData = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ r: 2.2 + (i % 3) * 0.9, speed: 0.25 + (i % 4) * 0.07, phase: (i / 7) * Math.PI * 2, y: (i % 2 ? 0.6 : -0.4) + (i % 3) * 0.3, size: 0.32 + (i % 3) * 0.1 })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = input.scroll
    group.current.position.set(narrow ? 0.4 : 3.3, (narrow ? 5.6 : 4.0) + s * 1.6, -4)
    group.current.scale.setScalar((narrow ? 0.7 : 1) * (1 + Math.min(s, 2) * 0.1))
    if (still) return
    bats.current.children.forEach((bat, i) => {
      const d = batData[i]
      const a = t * d.speed + d.phase
      bat.position.set(Math.cos(a) * d.r, d.y + Math.sin(t * 1.3 + i) * 0.2, Math.sin(a) * d.r * 0.5 + 0.8)
      bat.rotation.z = Math.sin(a) * 0.2
      bat.scale.set(d.size, d.size * (0.7 + 0.3 * Math.abs(Math.sin(t * 8 + i))), d.size)
    })
  })

  return (
    <group ref={group}>
      <sprite scale={[7, 7, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh material={moonMat}>
        <sphereGeometry args={[1.25, 64, 64]} />
      </mesh>
      <group ref={bats}>
        {batData.map((d, i) => (
          <mesh key={i} geometry={batGeo} position={[Math.cos(d.phase) * d.r, d.y, 0.8]} scale={d.size}>
            <meshBasicMaterial color="#050308" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
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
      <pointsMaterial color="#ffd8b0" size={0.14} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
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
    </Canvas>
  )
}
