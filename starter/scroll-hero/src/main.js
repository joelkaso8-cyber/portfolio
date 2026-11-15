// Normal page scroll (no lock). Film time follows scroll via GSAP ScrollTrigger; Lenis only smooths.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)

const hero = document.getElementById('hero')
const video = hero.querySelector('video')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const net = navigator.connection
const saver = net && (net.saveData || /^(slow-2g|2g|3g)$/.test(net.effectiveType))

if (!reduce && !saver) {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  const phone = matchMedia('(max-width: 900px) and (orientation: portrait)').matches
  video.preload = 'metadata'
  video.src = phone ? '/media/hero-m.mp4' : '/media/hero.mp4'
  video.addEventListener('loadedmetadata', () => {
    const proxy = { t: 0 }
    gsap.to(proxy, {
      t: video.duration - 0.05, ease: 'none',
      onUpdate: () => { video.currentTime = proxy.t },
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=600', scrub: 0.4, pin: true }
    })
    hero.querySelector('.hero-film').classList.add('ready')
  }, { once: true })
  video.addEventListener('error', () => video.remove()) // film failed: poster stays
}

addEventListener('scroll', () => hero.querySelector('.hint')?.classList.toggle('gone', scrollY > 20), { passive: true })
