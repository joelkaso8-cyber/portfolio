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
  renderer.toneMappingExposure = 0.82
  stage.querySelector('.still').remove()
  stage.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const HAZE = new THREE.Color(0x5e4c46)
  scene.fog = new THREE.FogExp2(HAZE, 0.013)
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 600)
  const M = 'media/cinema/'
  const tl = new THREE.TextureLoader()
  const tex = (f, rep, srgb = true) => { const t = tl.load(M + f); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }

  // Fallback sky (shown until the real sky photo loads, or if it fails).
  const fallbackSky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x0b0d14) }, mid: { value: new THREE.Color(0x3b2a2c) }, low: { value: new THREE.Color(0xd08a3c) } },
    vertexShader: 'varying vec3 w; void main(){ w = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top,mid,low; varying vec3 w; void main(){ float h = w.y; vec3 c = mix(low, mid, smoothstep(-0.02, 0.12, h)); c = mix(c, top, smoothstep(0.12, 0.55, h)); gl_FragColor = vec4(c,1.); }'
  }))
  scene.add(fallbackSky)
  // Real sky: Poly Haven "Qwantani Sunset (Pure Sky)", CC0, tonemapped JPG (artifact hosts and phones prefer it to a 4 MB .hdr). Lights the scene and fills the reflections.
  const pmrem = new THREE.PMREMGenerator(renderer)
  tl.load(M + (phone ? 'sky-1k.jpg' : 'sky-2k.jpg'), hdr => {
    hdr.colorSpace = THREE.SRGBColorSpace
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.background = hdr
    scene.environment = pmrem.fromEquirectangular(hdr).texture
    scene.backgroundIntensity = 0.62; scene.environmentIntensity = 0.75
    scene.backgroundRotation.y = scene.environmentRotation.y = SKY_TURN
    fallbackSky.visible = false
  })
  const SKY_TURN = 1.9 // turns the photographed sun to sit behind the hill

  scene.add(new THREE.HemisphereLight(0x9aa6c0, 0x2a1a14, 0.35))
  const sun = new THREE.DirectionalLight(0xffa65a, 2.4); sun.position.set(-40, 20, -60); scene.add(sun)
  const rim = new THREE.DirectionalLight(0xc8b8a8, 1.1); rim.position.set(20, 30, 60); scene.add(rim)

  // River: mirror-like water reflecting the real sky.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(600, 160), new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.08, metalness: 0.95 }))
  river.rotation.x = -Math.PI / 2; river.position.set(0, -0.4, 76); scene.add(river)
  const bank = new THREE.Mesh(new THREE.BoxGeometry(400, 1, 4), new THREE.MeshStandardMaterial({ color: 0x8a7a6a, map: tex('cobbles.jpg', [80, 1]) }))
  bank.position.set(0, 0, -2); scene.add(bank)

  // Alfama hillside.
  const hill = z => Math.max(0, -z) * 0.26 + Math.sin(-z * 0.08) * 0.8
  const ground = new THREE.PlaneGeometry(146, 88, 50, 36); ground.rotateX(-Math.PI / 2); ground.translate(0, 0, -47)
  const gp = ground.attributes.position
  for (let i = 0; i < gp.count; i++) gp.setY(i, hill(gp.getZ(i)) - 0.05)
  ground.computeVertexNormals()
  scene.add(new THREE.Mesh(ground, new THREE.MeshStandardMaterial({ color: 0x9a8a7a, roughness: 1, map: tex('cobbles.jpg', [60, 36]) })))

  const rng = mulberry(7)
  const step = phone ? 3.4 : 2.6
  const houses = []
  for (let x = -70; x <= 70; x += step) for (let z = -6; z >= -90; z -= step) {
    if (rng() < 0.18) continue // lanes and stairways
    const w = step * (0.75 + rng() * 0.2), d = step * (0.75 + rng() * 0.2), h = 2 + rng() * 3.8
    houses.push({ x: x + (rng() - 0.5) * 0.8, z: z + (rng() - 0.5) * 0.8, w, d, h })
  }
  const HOTEL = { x: 6, z: -30 }
  const hy = hill(HOTEL.z)
  houses.forEach(b => { if (Math.hypot(b.x - HOTEL.x, b.z - HOTEL.z) < 4) b.h = 0 }) // clear the plot
  const built = houses.filter(b => b.h > 0)
  built.push({ x: HOTEL.x, z: HOTEL.z, w: 4.2, d: 3.6, h: 5.2, hotel: true })

  // House walls: one facade atlas made from a real plaster photo (Poly Haven "beige_wall_001", CC0),
  // mapped by world size so windows keep their proportions on every house. Lit windows glow at dusk.
  const facadeMap = tex('facades.jpg'), glowMap = tex('facades-glow.jpg')
  const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.92, envMapIntensity: 0.6 })
  wallMat.onBeforeCompile = sh => {
    sh.uniforms.facadeMap = { value: facadeMap }; sh.uniforms.glowMap = { value: glowMap }; sh.uniforms.glowGain = glowGain
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aVar; attribute float aLit; varying vec2 vFac; varying float vVar; varying float vLit; varying float vTop;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vec2 span = abs(normal.x) > 0.5 ? sc.zy : (abs(normal.z) > 0.5 ? sc.xy : sc.xz);
        vFac = uv * span / vec2(2.0, 2.0); vVar = aVar; vLit = aLit; vTop = step(0.5, normal.y);`)
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D facadeMap; uniform sampler2D glowMap; uniform float glowGain; varying vec2 vFac; varying float vVar; varying float vLit; varying float vTop;')
      .replace('#include <map_fragment>', `
        vec2 cellXY = vec2(mod(vVar, 4.0), 1.0 - floor(vVar / 4.0));
        vec2 f = mix(vec2(0.004), vec2(0.996), fract(vFac));
        vec2 auv = (cellXY + f) / vec2(4.0, 2.0);
        vec3 fac = texture2D(facadeMap, auv).rgb;
        diffuseColor.rgb *= mix(fac, vec3(0.55, 0.48, 0.42), vTop);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += texture2D(glowMap, auv).rgb * vLit * glowGain * (1.0 - vTop);`)
  }
  const glowGain = { value: 1.2 }
  const walls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), wallMat, built.length)
  const roofTex = tex('roof.jpg', [3, 1]), roofN = tex('roof-n.jpg', [3, 1], false)
  const roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.75, 0.55, 4, 1, true), new THREE.MeshStandardMaterial({ map: roofTex, normalMap: roofN, roughness: 0.85, color: 0xd8b0a0, side: THREE.DoubleSide }), built.length)
  const aVar = new Float32Array(built.length), aLit = new Float32Array(built.length)
  const m = new THREE.Matrix4(), col = new THREE.Color(), q0 = new THREE.Quaternion()
  const qr = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0))
  built.forEach((b, i) => {
    const y = hill(b.z)
    m.compose(new THREE.Vector3(b.x, y + b.h / 2, b.z), q0, new THREE.Vector3(b.w, b.h, b.d))
    walls.setMatrixAt(i, m); walls.setColorAt(i, col.setScalar(0.82 + rng() * 0.18))
    aVar[i] = b.hotel ? 0 : (rng() * 8) | 0
    aLit[i] = b.hotel ? 1.6 : (rng() < 0.55 ? 0.4 + rng() * 0.8 : 0)
    if (b.hotel) { m.compose(new THREE.Vector3(b.x, y + b.h, b.z), q0, new THREE.Vector3(0.001, 0.001, 0.001)) } // flat roof terrace
    else m.compose(new THREE.Vector3(b.x, y + b.h + 0.27, b.z), qr, new THREE.Vector3(b.w * 0.97, 1, b.d * 0.97))
    roofs.setMatrixAt(i, m); roofs.setColorAt(i, col.setScalar(0.8 + rng() * 0.2))
  })
  walls.geometry.setAttribute('aVar', new THREE.InstancedBufferAttribute(aVar, 1))
  walls.geometry.setAttribute('aLit', new THREE.InstancedBufferAttribute(aLit, 1))
  scene.add(walls, roofs)

  // Casa Alba's roof terrace: parapet, warm light and a string of bulbs.
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.35, 3.7), new THREE.MeshStandardMaterial({ color: 0xe8dfd0 }))
  parapet.position.set(HOTEL.x, hy + 5.37, HOTEL.z); scene.add(parapet)
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.4), new THREE.MeshStandardMaterial({ map: tex('cobbles.jpg', [3, 3]), color: 0xc8b49a }))
  deck.rotation.x = -Math.PI / 2; deck.position.set(HOTEL.x, hy + 5.56, HOTEL.z); scene.add(deck)
  const terraceLight = new THREE.PointLight(0xffb060, 14, 9, 1.6); terraceLight.position.set(HOTEL.x, hy + 6.2, HOTEL.z + 0.5); scene.add(terraceLight)
  const winPos = [], winCol = []
  for (let k = 0; k < 18; k++) {
    const t = k / 17
    winPos.push(HOTEL.x - 2 + t * 4, hy + 6.4 - Math.sin(t * Math.PI) * 0.35, HOTEL.z + 1.6); winCol.push(1, 0.75, 0.4)
  }
  for (let x = -90; x <= 90; x += 3) { winPos.push(x, 1.1, -0.2); winCol.push(1, 0.7, 0.35) } // river lamps

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
    scene.fog.density = 0.011 - k * 0.004
    terraceLight.intensity = 6 + k * 6
    glowGain.value = 0.8 + k * 0.8
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
