// 3D hero: a lit glass-like form turns and the camera glides as the page scrolls (page scrolls normally).
// Reduced motion or no WebGL: the poster image stays, nothing is hidden.
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const stage = document.getElementById('stage')
const hint = document.querySelector('.hint')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
function webgl() { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }

if (!reduce && webgl()) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x0f1012)
  stage.querySelector('img')?.remove()
  stage.prepend(renderer.domElement)
  const scene = new THREE.Scene()
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam.position.set(0, 0, 7)
  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const key = new THREE.PointLight(0xe8b04b, 90, 30); key.position.set(4, 3, 5); scene.add(key)
  const fill = new THREE.PointLight(0x6d8aa8, 40, 30); fill.position.set(-5, -2, 3); scene.add(fill)
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.48, 220, 28),
    new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.22, metalness: 0.6 }))
  scene.add(knot)
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight
    renderer.setSize(w, h, false); cam.aspect = w / h
    knot.position.x = w > 800 ? 1.8 : 0; cam.updateProjectionMatrix()
  }
  addEventListener('resize', resize); resize()

  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)

  const p = { v: 0 }
  gsap.to(p, { v: 1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=700', scrub: 0.5, pin: true } })
  renderer.setAnimationLoop(t => {
    knot.rotation.set(p.v * Math.PI * 1.2 + t * 0.00006, p.v * Math.PI * 2, 0)
    cam.position.z = 7 - p.v * 2.2
    renderer.render(scene, cam)
    if (hint) hint.classList.toggle('gone', p.v > 0.02)
  })
}
