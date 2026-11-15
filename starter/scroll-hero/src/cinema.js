// Cinematic scroll: the camera flies a fixed path through a dusk Alfama scene as the page scrolls.
// The page scrolls normally; the stage is pinned while the shot plays. The nav "Book your stay"
// button stays visible the whole time. Reduced motion or no WebGL: poster + every line, nothing hidden.
// Interaction: a lantern follows the pointer over the roofs (desktop); click or tap a house to switch its lights.
import './form.js'
import './lamp.js'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const hero = document.getElementById('hero'), stage = document.getElementById('stage')
const beats = [...stage.querySelectorAll('.beat')], hint = stage.querySelector('.hint'), tapHint = stage.querySelector('.tap-hint')
const nav = document.querySelector('.nav'), main = document.getElementById('main')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const phone = matchMedia('(max-width: 800px)').matches
const hover = matchMedia('(hover: hover) and (pointer: fine)').matches
function webgl() { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }

// The nav gets a solid background once the light sections reach it, so its text stays readable.
function navState() { nav.classList.toggle('solid', main.getBoundingClientRect().top < nav.offsetHeight) }
addEventListener('scroll', navState, { passive: true }); navState()

if (reduce || !webgl()) hero.classList.add('static')
else start()

function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: !phone, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.85
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  stage.querySelector('.still').remove()
  stage.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const HAZE = new THREE.Color(0x5e4c46)
  scene.fog = new THREE.FogExp2(HAZE, 0.012)
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 600)
  const M = 'media/cinema/'
  const tl = new THREE.TextureLoader()
  const tex = (f, rep, srgb = true) => { const t = tl.load(M + f); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t }

  // Fallback sky (shown until the real sky photo loads, or if it fails).
  const fallbackSky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x0b0d14) }, mid: { value: new THREE.Color(0x3b2a2c) }, low: { value: new THREE.Color(0xd08a3c) } },
    vertexShader: 'varying vec3 w; void main(){ w = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top,mid,low; varying vec3 w; void main(){ float h = w.y; vec3 c = mix(low, mid, smoothstep(-0.02, 0.12, h)); c = mix(c, top, smoothstep(0.12, 0.55, h)); gl_FragColor = vec4(c,1.); }'
  }))
  scene.add(fallbackSky)
  // Real sky: Poly Haven "Qwantani Sunset (Pure Sky)", CC0, tonemapped JPG (lighter than a 4 MB .hdr).
  const SKY_TURN = 1.9 // turns the photographed sun to sit behind the hill
  const pmrem = new THREE.PMREMGenerator(renderer)
  tl.load(M + (phone ? 'sky-1k.jpg' : 'sky-2k.jpg'), sky => {
    sky.colorSpace = THREE.SRGBColorSpace
    sky.mapping = THREE.EquirectangularReflectionMapping
    scene.background = sky
    scene.environment = pmrem.fromEquirectangular(sky).texture
    scene.backgroundIntensity = 0.62; scene.environmentIntensity = 0.7
    scene.backgroundRotation.y = scene.environmentRotation.y = SKY_TURN
    fallbackSky.visible = false
  })

  scene.add(new THREE.HemisphereLight(0x9aa6c0, 0x2a1a14, 0.3))
  // Low sun raking in from the left: long shadows across the roofs.
  const sun = new THREE.DirectionalLight(0xffa860, 3.0)
  sun.target.position.set(0, 8, -40); sun.position.set(-70, 32, -12)
  sun.castShadow = true
  sun.shadow.mapSize.set(phone ? 1024 : 2048, phone ? 1024 : 2048)
  Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 55, bottom: -55, near: 1, far: 220 })
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04
  scene.add(sun, sun.target)
  const fill = new THREE.DirectionalLight(0xb8c4d8, 0.55); fill.position.set(20, 30, 60); scene.add(fill)

  // River: mirror-like water reflecting the real sky.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(600, 160), new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.08, metalness: 0.95 }))
  river.rotation.x = -Math.PI / 2; river.position.set(0, -0.4, 76); scene.add(river)
  const bank = new THREE.Mesh(new THREE.BoxGeometry(400, 1, 4), new THREE.MeshStandardMaterial({ color: 0x8a7a6a, map: tex('cobbles.jpg', [80, 1]) }))
  bank.position.set(0, 0, -2); bank.receiveShadow = true; scene.add(bank)

  // Alfama hillside.
  const hill = z => Math.max(0, -z) * 0.26 + Math.sin(-z * 0.08) * 0.8
  const groundGeo = new THREE.PlaneGeometry(146, 88, 50, 36); groundGeo.rotateX(-Math.PI / 2); groundGeo.translate(0, 0, -47)
  const gp = groundGeo.attributes.position
  for (let i = 0; i < gp.count; i++) gp.setY(i, hill(gp.getZ(i)) - 0.05)
  groundGeo.computeVertexNormals()
  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x9a8a7a, roughness: 1, map: tex('cobbles.jpg', [60, 36]) }))
  ground.receiveShadow = true; scene.add(ground)

  // Houses. One facade tile is 2 x 2 units (2 windows x 2 floors), so sizes snap to whole
  // windows and whole floors: no window is ever cut in half at a corner or under a roof.
  const rng = mulberry(7)
  const step = phone ? 3.4 : 2.8
  const houses = []
  for (let x = -70; x <= 70; x += step) for (let z = -6; z >= -90; z -= step) {
    if (rng() < 0.16) continue // lanes and stairways
    houses.push({ x: x + (rng() - 0.5) * 0.5, z: z + (rng() - 0.5) * 0.5, w: rng() < 0.6 ? 2 : 3, d: 2, h: 2 + ((rng() * 4) | 0) })
  }
  const HOTEL = { x: 6, z: -30 }
  const hy = hill(HOTEL.z)
  const built = houses.filter(b => Math.hypot(b.x - HOTEL.x, b.z - HOTEL.z) > 4)
  built.push({ x: HOTEL.x, z: HOTEL.z, w: 4, d: 4, h: 5, hotel: true })

  // Walls: facade atlas made from a real plaster photo (Poly Haven "beige_wall_001", CC0).
  // The shader adds weathering, contact shadow at the street and a darker band under the eaves.
  const facadeMap = tex('facades.jpg'), glowMap = tex('facades-glow.jpg')
  const glowGain = { value: 1.2 }
  const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.92, envMapIntensity: 0.6 })
  wallMat.onBeforeCompile = sh => {
    sh.uniforms.facadeMap = { value: facadeMap }; sh.uniforms.glowMap = { value: glowMap }; sh.uniforms.glowGain = glowGain
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aVar; attribute float aLit; attribute float aOff;\nvarying vec2 vFac; varying float vVar; varying float vLit; varying float vTop; varying float vH; varying vec3 vW;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vec2 span = abs(normal.x) > 0.5 ? sc.zy : (abs(normal.z) > 0.5 ? sc.xy : sc.xz);
        vFac = uv * span / 2.0 + vec2(aOff, 0.0); vVar = aVar; vLit = aLit; vTop = step(0.5, normal.y); vH = sc.y;
        vW = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;`)
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D facadeMap; uniform sampler2D glowMap; uniform float glowGain;
        varying vec2 vFac; varying float vVar; varying float vLit; varying float vTop; varying float vH; varying vec3 vW;
        float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`)
      .replace('#include <map_fragment>', `
        vec2 cellXY = vec2(mod(vVar, 4.0), 1.0 - floor(vVar / 4.0));
        vec2 auv = (cellXY + mix(vec2(0.003), vec2(0.997), fract(vFac))) / vec2(4.0, 2.0);
        vec2 gx = dFdx(vFac) / vec2(4.0, 2.0), gy = dFdy(vFac) / vec2(4.0, 2.0); // continuous gradients: no seams at tile edges
        vec3 fac = textureGrad(facadeMap, auv, gx, gy).rgb;
        float y = vFac.y * 2.0;
        float weather = 0.82 + 0.3 * vnoise(vW.xz * 0.35 + vW.y * 0.6) * vnoise(vW.xy * 1.7 + vW.z);
        float ao = mix(0.5, 1.0, smoothstep(0.0, 0.9, y)) * mix(0.72, 1.0, smoothstep(0.0, 0.3, vH - y));
        diffuseColor.rgb *= mix(fac * weather * ao, vec3(0.5, 0.44, 0.4), vTop);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += textureGrad(glowMap, auv, gx, gy).rgb * vLit * glowGain * (1.0 - vTop);`)
  }
  const walls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), wallMat, built.length)
  walls.castShadow = walls.receiveShadow = true
  const roofTex = tex('roof.jpg', [3, 1]), roofN = tex('roof-n.jpg', [3, 1], false)
  const roofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.78, 0.55, 4, 1, true), new THREE.MeshStandardMaterial({ map: roofTex, normalMap: roofN, roughness: 0.85, color: 0xd8b0a0, side: THREE.DoubleSide }), built.length)
  roofs.castShadow = roofs.receiveShadow = true
  const aVar = new Float32Array(built.length), aLit = new Float32Array(built.length), aOff = new Float32Array(built.length)
  const m = new THREE.Matrix4(), col = new THREE.Color(), q0 = new THREE.Quaternion()
  const qr = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0))
  built.forEach((b, i) => {
    const y = hill(b.z)
    m.compose(new THREE.Vector3(b.x, y + b.h / 2, b.z), q0, new THREE.Vector3(b.w, b.h, b.d))
    walls.setMatrixAt(i, m); walls.setColorAt(i, col.setScalar(0.85 + rng() * 0.15))
    aVar[i] = b.hotel ? 0 : (rng() * 8) | 0
    aLit[i] = b.hotel ? 1.6 : (rng() < 0.5 ? 0.5 + rng() * 0.8 : 0)
    aOff[i] = rng() < 0.5 ? 0 : 0.5
    if (b.hotel) m.compose(new THREE.Vector3(b.x, y + b.h, b.z), q0, new THREE.Vector3(0.001, 0.001, 0.001)) // flat roof terrace
    else m.compose(new THREE.Vector3(b.x, y + b.h + 0.27, b.z), qr, new THREE.Vector3(b.w * 0.98, 1, b.d * 0.98))
    roofs.setMatrixAt(i, m); roofs.setColorAt(i, col.setScalar(0.8 + rng() * 0.2))
  })
  const litAttr = new THREE.InstancedBufferAttribute(aLit, 1)
  walls.geometry.setAttribute('aVar', new THREE.InstancedBufferAttribute(aVar, 1))
  walls.geometry.setAttribute('aLit', litAttr)
  walls.geometry.setAttribute('aOff', new THREE.InstancedBufferAttribute(aOff, 1))
  scene.add(walls, roofs)

  // Casa Alba's roof terrace: parapet, cobbled deck, warm light and a string of bulbs.
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.35, 4.1), new THREE.MeshStandardMaterial({ color: 0xe8dfd0 }))
  parapet.position.set(HOTEL.x, hy + 5.17, HOTEL.z); parapet.castShadow = true; scene.add(parapet)
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.8), new THREE.MeshStandardMaterial({ map: tex('cobbles.jpg', [3, 3]), color: 0xc8b49a }))
  deck.rotation.x = -Math.PI / 2; deck.position.set(HOTEL.x, hy + 5.36, HOTEL.z); deck.receiveShadow = true; scene.add(deck)
  const terraceLight = new THREE.PointLight(0xffb060, 14, 9, 1.6); terraceLight.position.set(HOTEL.x, hy + 6.1, HOTEL.z + 0.5); scene.add(terraceLight)
  const ptPos = [], ptCol = []
  for (let k = 0; k < 18; k++) {
    const t = k / 17
    ptPos.push(HOTEL.x - 1.9 + t * 3.8, hy + 6.2 - Math.sin(t * Math.PI) * 0.35, HOTEL.z + 1.8); ptCol.push(1, 0.75, 0.4)
  }
  for (let x = -90; x <= 90; x += 3) { ptPos.push(x, 1.1, -0.2); ptCol.push(1, 0.7, 0.35) } // river lamps
  const bulbs = new THREE.BufferGeometry()
  bulbs.setAttribute('position', new THREE.Float32BufferAttribute(ptPos, 3))
  bulbs.setAttribute('color', new THREE.Float32BufferAttribute(ptCol, 3))
  scene.add(new THREE.Points(bulbs, new THREE.PointsMaterial({ size: 0.42, map: radial(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, sizeAttenuation: true })))

  // Lantern that follows the pointer over the roofs.
  const lantern = new THREE.PointLight(0xffb070, 0, 14, 1.7); scene.add(lantern)
  const lanternGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial(), color: 0xffc070, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
  lanternGlow.scale.setScalar(1.6); scene.add(lanternGlow)
  const lanternTo = new THREE.Vector3(), ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
  let lanternOn = 0
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, cam)
    return ray.intersectObjects([walls, ground], false)[0]
  }
  function place(hit) {
    const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 1, 0)
    lanternTo.copy(hit.point).addScaledVector(n, 1.3); lanternTo.y += 0.6
  }
  if (hover) {
    stage.addEventListener('pointermove', e => { const h = pick(e); if (h) { place(h); lanternOn = 1 } })
    stage.addEventListener('pointerleave', () => { lanternOn = 0 })
  }
  // Click or tap a house: its windows switch on or off.
  stage.addEventListener('click', e => {
    if (e.target.closest('a,button')) return
    const h = pick(e)
    if (!h || h.object !== walls || h.instanceId === undefined) return
    const i = h.instanceId
    aLit[i] = aLit[i] > 0.05 ? 0 : 1.3
    litAttr.needsUpdate = true
    place(h); lanternOn = hover ? 1 : 0.8
    if (!hover) setTimeout(() => { lanternOn = 0 }, 1400)
    tapHint?.classList.add('used')
  })

  // The shot list: wide over the river, crane down over the roofs, push in on the terrace.
  // Portrait screens end a little further back so the terrace still fits the frame.
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  const tall = innerWidth / innerHeight < 0.8
  const endCam = tall ? V(HOTEL.x + 0.6, hy + 10.5, HOTEL.z + 12.5) : V(HOTEL.x + 0.8, hy + 8.2, HOTEL.z + 9.5)
  const path = new THREE.CatmullRomCurve3([V(-6, 20, 62), V(-16, 17, 34), V(-4, 14, 10), V(9, 13.5, -12), endCam], false, 'catmullrom', 0.4)
  const look = new THREE.CatmullRomCurve3([V(0, 13, -40), V(0, 11, -40), V(4, 10, -34), V(HOTEL.x, hy + 5, HOTEL.z), V(HOTEL.x - 0.4, hy + 5.4, HOTEL.z)], false, 'catmullrom', 0.4)
  const fovStart = tall ? 62 : 50, fovEnd = tall ? 52 : 34

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
  let visible = true
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }).observe(stage)

  renderer.setAnimationLoop(t => {
    if (!visible) return
    const p = s.p, k = ease(p), time = t * 0.001
    path.getPointAt(k, pos); look.getPointAt(k, tgt)
    pos.x += Math.sin(time * 0.35) * 0.25; pos.y += Math.sin(time * 0.5) * 0.12 // handheld drift
    cam.position.copy(pos); cam.lookAt(tgt)
    cam.fov = fovStart - k * (fovStart - fovEnd); cam.updateProjectionMatrix() // slow lens push
    scene.fog.density = 0.012 - k * 0.004
    terraceLight.intensity = 6 + k * 6
    glowGain.value = 0.8 + k * 0.8
    lantern.position.lerp(lanternTo, 0.15)
    lantern.intensity += (lanternOn * 22 - lantern.intensity) * 0.1
    lanternGlow.position.copy(lantern.position)
    lanternGlow.material.opacity = lantern.intensity / 22 * (0.85 + Math.sin(time * 9) * 0.08) // flicker
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
    if (tapHint) tapHint.classList.toggle('show', p > 0.22 && p < 0.97)
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
