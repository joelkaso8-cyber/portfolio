// Cinematic scroll: the camera flies a fixed path through a dusk Alfama scene as the page scrolls.
// The page scrolls normally; the stage is pinned while the shot plays. The nav "Book your stay"
// button stays visible the whole time. Reduced motion or no WebGL: poster + every line, nothing hidden.
import './form.js'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const hero = document.getElementById('hero'), stage = document.getElementById('stage')
const beats = [...stage.querySelectorAll('.beat')], hint = stage.querySelector('.hint')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const phone = matchMedia('(max-width: 800px)').matches
function webgl() { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }

if (reduce || !webgl()) hero.classList.add('static')
else start()

function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: !phone, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  stage.querySelector('.still').remove()
  stage.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const HAZE = new THREE.Color(0x3a2a24)
  scene.fog = new THREE.FogExp2(HAZE, 0.013)
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 400)

  // Sky: obsidian overhead fading to an amber horizon.
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x0b0d14) }, mid: { value: new THREE.Color(0x3b2a2c) }, low: { value: new THREE.Color(0xd08a3c) } },
    vertexShader: 'varying vec3 w; void main(){ w = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top,mid,low; varying vec3 w; void main(){ float h = w.y; vec3 c = mix(low, mid, smoothstep(-0.02, 0.12, h)); c = mix(c, top, smoothstep(0.12, 0.55, h)); gl_FragColor = vec4(c,1.); }'
  })))
  // Low sun glow on the horizon, behind the hill.
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial(), color: 0xffb35c, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }))
  glow.position.set(-60, 14, -220); glow.scale.set(160, 90, 1); scene.add(glow)

  scene.add(new THREE.HemisphereLight(0x8090b0, 0x2a1a14, 0.55))
  const sun = new THREE.DirectionalLight(0xffa65a, 2.2); sun.position.set(-40, 20, -60); scene.add(sun)
  const rim = new THREE.DirectionalLight(0xc8b8a8, 1.5); rim.position.set(20, 30, 60); scene.add(rim) // soft fill on the river-facing walls

  // River: dark, glossy, catching the sky.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(400, 140), new THREE.MeshStandardMaterial({ color: 0x1a1d24, roughness: 0.15, metalness: 0.85 }))
  river.rotation.x = -Math.PI / 2; river.position.set(0, -0.4, 66); scene.add(river)
  const bank = new THREE.Mesh(new THREE.BoxGeometry(400, 1, 4), new THREE.MeshStandardMaterial({ color: 0x5a4a40 }))
  bank.position.set(0, 0, -2); scene.add(bank)

  // Alfama: a hillside of whitewashed and ochre houses with terracotta roofs.
  const hill = z => Math.max(0, -z) * 0.26 + Math.sin(-z * 0.08) * 0.8
  const rng = mulberry(7)
  const step = phone ? 3.4 : 2.6
  const houses = []
  for (let x = -70; x <= 70; x += step) for (let z = -6; z >= -90; z -= step) {
    if (rng() < 0.18) continue // lanes and stairways
    const w = step * (0.75 + rng() * 0.2), d = step * (0.75 + rng() * 0.2), h = 2 + rng() * 3.8
    houses.push({ x: x + (rng() - 0.5) * 0.8, z: z + (rng() - 0.5) * 0.8, w, d, h })
  }
  // Hillside ground under the houses, so no sky shows through the lanes.
  const ground = new THREE.PlaneGeometry(146, 88, 50, 36); ground.rotateX(-Math.PI / 2); ground.translate(0, 0, -47)
  const gp = ground.attributes.position
  for (let i = 0; i < gp.count; i++) gp.setY(i, hill(gp.getZ(i)) - 0.05)
  ground.computeVertexNormals()
  scene.add(new THREE.Mesh(ground, new THREE.MeshStandardMaterial({ color: 0x4a3c34, roughness: 1 })))
  const HOTEL = { x: 6, z: -30 }
  const walls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.9 }), houses.length)
  const roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.75, 0.55, 4), new THREE.MeshStandardMaterial({ color: 0x9a4a2c, roughness: 0.85 }), houses.length)
  const m = new THREE.Matrix4(), col = new THREE.Color()
  const qr = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0))
  const PAL = [0xefe6d8, 0xe6d3b3, 0xd9b98a, 0xf2ece2, 0xc9a27a, 0xb8c2c6]
  const winPos = [], winCol = []
  houses.forEach((b, i) => {
    if (Math.hypot(b.x - HOTEL.x, b.z - HOTEL.z) < 4) b.h = 0.01 // clear the plot for the hotel
    const y = hill(b.z)
    m.compose(new THREE.Vector3(b.x, y + b.h / 2, b.z), new THREE.Quaternion(), new THREE.Vector3(b.w, b.h, b.d))
    walls.setMatrixAt(i, m); walls.setColorAt(i, col.setHex(PAL[(rng() * PAL.length) | 0]))
    m.compose(new THREE.Vector3(b.x, y + b.h + 0.27, b.z), qr, new THREE.Vector3(b.w * 0.95, b.h > 0.1 ? 1 : 0.001, b.d * 0.95))
    roofs.setMatrixAt(i, m)
    // Windows on the river-facing side; about a third are lit.
    if (b.h > 0.1) for (let k = 0; k < 3; k++) if (rng() < 0.38) {
      winPos.push(b.x + (rng() - 0.5) * b.w * 0.7, y + 0.8 + rng() * (b.h - 1.2), b.z + b.d / 2 + 0.02)
      const warm = 0.7 + rng() * 0.3; winCol.push(1, 0.62 * warm, 0.28 * warm)
    }
  })
  scene.add(walls, roofs)

  // Casa Alba: a taller white house with a lit roof terrace and a string of lights.
  const hy = hill(HOTEL.z)
  const hotel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.2, 3.6), new THREE.MeshStandardMaterial({ color: 0xf6f1e8, roughness: 0.8 }))
  hotel.position.set(HOTEL.x, hy + 2.6, HOTEL.z); scene.add(hotel)
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.35, 3.7), new THREE.MeshStandardMaterial({ color: 0xe8dfd0 }))
  parapet.position.set(HOTEL.x, hy + 5.37, HOTEL.z); scene.add(parapet)
  const terraceLight = new THREE.PointLight(0xffb060, 14, 9, 1.6); terraceLight.position.set(HOTEL.x, hy + 6.2, HOTEL.z + 0.5); scene.add(terraceLight)
  for (let k = 0; k < 18; k++) { // string lights draped across the terrace
    const t = k / 17
    winPos.push(HOTEL.x - 2 + t * 4, hy + 6.4 - Math.sin(t * Math.PI) * 0.35, HOTEL.z + 1.6); winCol.push(1, 0.75, 0.4)
  }
  for (let k = 0; k < 6; k++) { winPos.push(HOTEL.x - 1.4 + (k % 3) * 1.4, hy + 1.6 + ((k / 3) | 0) * 1.8, HOTEL.z + 1.82); winCol.push(1, 0.66, 0.3) }
  // Street lamps along the river.
  for (let x = -90; x <= 90; x += 3) { winPos.push(x, 1.1, -0.2); winCol.push(1, 0.7, 0.35) }

  const lights = new THREE.BufferGeometry()
  lights.setAttribute('position', new THREE.Float32BufferAttribute(winPos, 3))
  lights.setAttribute('color', new THREE.Float32BufferAttribute(winCol, 3))
  scene.add(new THREE.Points(lights, new THREE.PointsMaterial({ size: 0.42, map: radial(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, sizeAttenuation: true })))

  // The shot list: establishing wide over the river, crane down over the roofs, push in on the terrace.
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  const path = new THREE.CatmullRomCurve3([V(-6, 20, 62), V(-16, 17, 34), V(-4, 14, 10), V(9, 13.5, -12), V(HOTEL.x + 0.8, hy + 8.2, HOTEL.z + 9.5)], false, 'catmullrom', 0.4)
  const look = new THREE.CatmullRomCurve3([V(0, 13, -40), V(0, 11, -40), V(4, 10, -34), V(HOTEL.x, hy + 5, HOTEL.z), V(HOTEL.x - 0.4, hy + 5.8, HOTEL.z)], false, 'catmullrom', 0.4)

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix()
  }
  addEventListener('resize', resize); resize()

  const lenis = new Lenis({ lerp: 0.08 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)

  const s = { p: 0 }
  gsap.to(s, { p: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=320%', scrub: 1.2, pin: true } })

  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  const fade = (p, a, b) => Math.min(smooth(a, a + 0.06, p), 1 - smooth(b - 0.06, b, p))
  const tgt = new THREE.Vector3(), pos = new THREE.Vector3()

  renderer.setAnimationLoop(t => {
    const p = s.p, k = ease(p), time = t * 0.001
    path.getPointAt(k, pos); look.getPointAt(k, tgt)
    pos.x += Math.sin(time * 0.35) * 0.25; pos.y += Math.sin(time * 0.5) * 0.12 // handheld drift
    cam.position.copy(pos); cam.lookAt(tgt)
    cam.fov = 50 - k * 16; cam.updateProjectionMatrix() // slow lens push
    scene.fog.density = 0.013 - k * 0.005
    terraceLight.intensity = 6 + k * 6
    renderer.render(scene, cam)

    stage.style.setProperty('--bar', smooth(0, 0.08, p).toFixed(3))
    stage.style.setProperty('--p', p.toFixed(4))
    beats.forEach((b, i) => {
      const o = i === 0 ? 1 - smooth(0.12, 0.2, p) : fade(p, +b.dataset.in, +b.dataset.out)
      b.style.opacity = o.toFixed(3)
      b.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`
      b.style.visibility = o < 0.01 ? 'hidden' : 'visible'
    })
    if (hint) hint.classList.toggle('gone', p > 0.02)
  })
}

function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function radial() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}
