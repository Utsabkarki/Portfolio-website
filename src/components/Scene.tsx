import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { input } from '../store'

const SUN = new THREE.Vector3(0.78, 0.2, -0.6).normalize()

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
}`

// Shared atmosphere so the mountains fade into exactly the sky behind them.
const sky = /* glsl */ `
uniform vec3 uSun;
vec3 skyColor(vec3 d){
  float y = max(d.y, 0.0);
  vec3 zenith = vec3(0.004, 0.008, 0.022);
  vec3 mid = vec3(0.02, 0.035, 0.08);
  vec3 horizon = vec3(0.55, 0.26, 0.13);
  vec3 col = mix(mid, zenith, smoothstep(0.08, 0.6, y));
  float az = max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0);
  col = mix(col, horizon * (0.35 + 0.65 * az * az), exp(-y * 7.0));
  float s = max(dot(d, uSun), 0.0);
  col += vec3(1.0, 0.55, 0.28) * (pow(s, 24.0) * 0.35 + pow(s, 300.0) * 1.2);
  return col;
}`

const terrainVertex = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vH;
varying vec2 vUv2;
${noise}
float height(vec2 xy){
  vec2 q = vec2(xy.x, xy.y + uTime) * 0.036;
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 6; i++) {
    float n = 1.0 - abs(snoise(q));
    s += a * n * n;
    q = q * 2.03 + 11.7;
    a *= 0.46;
  }
  float valley = smoothstep(1.5, 20.0, abs(xy.x));
  float far = smoothstep(-5.0, 34.0, xy.y);
  return s * (0.3 + valley * 7.0 + far * 13.0);
}
void main(){
  vec3 p = position;
  float e = 0.3;
  float h = height(p.xy);
  vec3 n = normalize(vec3(height(p.xy - vec2(e, 0.0)) - height(p.xy + vec2(e, 0.0)), height(p.xy - vec2(0.0, e)) - height(p.xy + vec2(0.0, e)), 2.0 * e));
  p.z += h;
  vH = h / 14.0;
  vUv2 = vec2(position.x, position.y + uTime);
  vNormal = vec3(n.x, n.z, -n.y);
  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`

const terrainFragment = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormal;
varying float vH;
varying vec2 vUv2;
${noise}
${sky}
void main(){
  float d1 = snoise(vUv2 * 0.9);
  float d2 = snoise(vUv2 * 3.7);
  vec3 n = normalize(vNormal + vec3(d2, 0.0, d1) * 0.12);
  float slope = n.y;
  float snowAmt = smoothstep(0.16, 0.34, vH + d1 * 0.04) * smoothstep(0.32, 0.62, slope + d2 * 0.06);
  vec3 rock = mix(vec3(0.035, 0.035, 0.042), vec3(0.11, 0.095, 0.085), 0.5 + 0.5 * d1);
  vec3 albedo = mix(rock, vec3(0.78, 0.82, 0.9), snowAmt);
  float diff = max(dot(n, uSun), 0.0);
  vec3 light = diff * vec3(1.0, 0.5, 0.26) * 4.5 + vec3(0.05, 0.08, 0.17) * (0.45 + 0.55 * slope);
  vec3 col = albedo * light;
  vec3 view = vWorld - cameraPosition;
  float dist = length(view);
  float fog = 1.0 - exp(-pow(dist * 0.0125, 1.9));
  fog = max(fog, (1.0 - smoothstep(-1.2, 1.4, vWorld.y)) * smoothstep(10.0, 45.0, dist) * 0.6);
  col = mix(col, skyColor(normalize(view * vec3(1.0, 0.0, 1.0) + vec3(0.0, 0.04 * dist, 0.0))), fog);
  col = col / (1.0 + col * 0.6);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
  gl_Position = p.xyww;
}`

const skyFragment = /* glsl */ `
varying vec3 vDir;
${sky}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec3 d = normalize(vDir);
  vec3 col = skyColor(d);
  vec2 g = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0))) * 240.0;
  vec2 cell = floor(g);
  float star = step(0.992, hash(cell)) * smoothstep(0.3, 0.0, length(fract(g) - 0.5));
  col += star * smoothstep(0.12, 0.5, d.y) * (0.4 + 0.6 * hash(cell + 3.0));
  col = col / (1.0 + col * 0.6);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

function Landscape({ still }: { still: boolean }) {
  const geometry = useMemo(() => new THREE.PlaneGeometry(110, 84, 260, 210), [])
  const terrain = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        uniforms: { uTime: { value: 0 }, uSun: { value: SUN } },
      }),
    [],
  )
  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uSun: { value: SUN } },
      }),
    [],
  )

  useFrame((_, dt) => {
    if (!still) terrain.uniforms.uTime.value += Math.min(dt, 0.05) * 0.45
  })

  return (
    <>
      <mesh material={skyMat} frustumCulled={false} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>
      <mesh geometry={geometry} material={terrain} rotation-x={-Math.PI / 2} position={[0, -1.2, -28]} frustumCulled={false} />
    </>
  )
}

function Rig() {
  const target = useMemo(() => new THREE.Vector3(), [])
  const page = useRef(0)
  useFrame(({ camera }, dt) => {
    const s = Math.min(input.scroll, 3)
    const k = 1 - Math.exp(-dt * 2.5)
    page.current += (input.page - page.current) * k
    const lift = page.current * 2.2
    camera.position.x += (input.px * 0.5 - camera.position.x) * k
    camera.position.y += (2.4 + lift + s * 0.9 - input.py * 0.2 - camera.position.y) * k
    target.set(camera.position.x * 0.4 + page.current * 6, 2.9 + lift * 1.5 + s * 0.4, -14)
    camera.lookAt(target)
  })
  return null
}

export default function Scene() {
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.4, 9], fov: 48, near: 0.1, far: 200 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <Rig />
      <Landscape still={still} />
    </Canvas>
  )
}
