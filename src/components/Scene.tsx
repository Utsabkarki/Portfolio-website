import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { input } from '../store'

// Full-screen "action panel" backdrop: drifting red/cyan energy, flickering
// manga speed lines and a halftone screen, all drawn in one shader.
const backdropFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uScroll;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.02 + 3.1; a *= 0.5; }
  return s;
}

void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 c = p - vec2(uMouse.x * 0.04, 0.12 - uMouse.y * 0.03);
  float t = uTime;

  // Base: near-black navy.
  vec3 col = vec3(0.016, 0.024, 0.05);

  // Energy clouds — cyan from the upper right, red from the lower left.
  vec2 q = p * 1.6 + vec2(t * 0.03, -t * 0.05 - uScroll * 0.2);
  float warp = fbm(q + fbm(q * 1.3 + t * 0.04));
  float cyanMask = smoothstep(0.15, 1.1, p.x * 0.8 + p.y * 0.6 + warp * 0.9);
  float redMask = smoothstep(0.2, 1.15, -p.x * 0.85 - p.y * 0.55 + warp * 0.95);
  col += vec3(0.06, 0.45, 1.0) * pow(cyanMask, 3.0) * 0.6;
  col += vec3(1.0, 0.03, 0.1) * pow(redMask, 3.0) * 0.6;

  // Manga speed lines radiating from behind the content, flickering.
  float ang = atan(c.y, c.x);
  float r = length(c);
  float frame = floor(t * 7.0);
  float n = noise(vec2(ang * 38.0, frame * 1.7));
  float lines = smoothstep(0.72, 0.98, n) * smoothstep(0.35, 1.1, r);
  float burst = 0.55 + 0.45 * sin(t * 0.8);
  col += vec3(0.85, 0.92, 1.0) * lines * 0.16 * burst;

  // Halftone screen that picks up the light, like printed manga tone.
  float lum = dot(col, vec3(0.3, 0.5, 0.2));
  vec2 g = fract(uv * uRes / 7.0) - 0.5;
  float dotR = sqrt(clamp(lum * 1.6, 0.0, 1.0)) * 0.45;
  float halftone = smoothstep(dotR, dotR - 0.08, length(g));
  col = mix(col, col * 1.45 + 0.02, halftone * 0.35);

  // Keep the middle calm for reading; darken the edges.
  float vign = smoothstep(1.25, 0.3, length(p * vec2(0.9, 1.1)));
  col *= mix(0.55, 1.0, vign);
  col *= 1.0 - smoothstep(0.55, 0.0, r) * 0.35;

  // Subtle film grain.
  col += (hash(uv * uRes + fract(t) * 100.0) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

function Backdrop({ still }: { still: boolean }) {
  const size = useThree((s) => s.size)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: backdropFragment,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
        },
      }),
    [],
  )
  useFrame((_, dt) => {
    const u = material.uniforms
    u.uRes.value.set(size.width, size.height)
    u.uMouse.value.x += (input.px - u.uMouse.value.x) * 0.05
    u.uMouse.value.y += (input.py - u.uMouse.value.y) * 0.05
    u.uScroll.value = input.scroll
    if (!still) u.uTime.value += Math.min(dt, 0.05)
  })
  return (
    <mesh material={material} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

// Embers rising and ash drifting, mostly red with some cyan sparks.
const emberVertex = /* glsl */ `
uniform float uTime;
uniform float uPixel;
attribute float aSeed;
varying float vAlpha;
varying float vSeed;
void main(){
  vec3 p = position;
  float speed = 0.35 + aSeed * 0.8;
  p.y = mod(p.y + uTime * speed, 18.0) - 9.0;
  p.x += sin(uTime * (0.3 + aSeed * 0.6) + aSeed * 50.0) * 0.8 + uTime * 0.15 * (aSeed - 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPixel * (0.8 + aSeed * aSeed * 4.5) * (12.0 / -mv.z);
  float flicker = 0.6 + 0.4 * sin(uTime * (2.0 + aSeed * 5.0) + aSeed * 30.0);
  vAlpha = flicker * smoothstep(9.0, 5.0, abs(p.y)) * (0.5 + aSeed * 0.5);
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}`

const emberFragment = /* glsl */ `
varying float vAlpha;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  vec3 red = vec3(1.0, 0.25, 0.22);
  vec3 cyan = vec3(0.45, 0.85, 1.0);
  vec3 ash = vec3(0.75, 0.78, 0.85);
  vec3 col = vSeed > 0.86 ? cyan : (vSeed > 0.45 ? red : ash);
  gl_FragColor = vec4(col, a);
}`

function Embers({ still }: { still: boolean }) {
  const count = 900
  const dpr = useThree((s) => s.viewport.dpr)
  const [positions, seeds] = useMemo(() => {
    const p = new Float32Array(count * 3)
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 26
      p[i * 3 + 1] = (Math.random() - 0.5) * 18
      p[i * 3 + 2] = -Math.random() * 14
      s[i] = Math.random()
    }
    return [p, s]
  }, [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: emberVertex,
        fragmentShader: emberFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
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

// Slight camera drift with the pointer and scroll for parallax on the embers.
function Rig() {
  useFrame(({ camera }, dt) => {
    const k = 1 - Math.exp(-dt * 2.5)
    camera.position.x += (input.px * 0.6 - camera.position.x) * k
    camera.position.y += (-input.py * 0.4 - Math.min(input.scroll, 4) * 0.6 - camera.position.y) * k
    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, -6)
  })
  return null
}

export default function Scene() {
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 60 }} gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}>
      <Backdrop still={still} />
      <Embers still={still} />
      <Rig />
    </Canvas>
  )
}
