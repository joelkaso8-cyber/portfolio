// The lounge lamp: a lava lamp drawn in one fragment shader (raw WebGL2, no library).
// Wax blobs heat at the bulb, rise, cool at the top and sink. Drag inside the lamp to stir the wax;
// tap, click, Space or Enter warms it so the blobs rise faster. Reduced motion: one still frame.
const canvas = document.getElementById('lamp')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const gl = canvas?.getContext('webgl2', { premultipliedAlpha: true, antialias: true })
if (canvas && !gl) canvas.closest('figure').hidden = true
if (gl) init()

function init() {
  const N = 8
  const vs = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`
  const fs = `#version 300 es
precision highp float;
uniform vec2 res; uniform vec3 blobs[${N}]; uniform float heat; uniform float time;
out vec4 o;
// Glass half-width at height y (lamp spans y -0.5..0.5, glass -0.30..0.32).
float glassW(float y) { return 0.058 + 0.082 * smoothstep(0.32, -0.16, y) - 0.022 * smoothstep(-0.16, -0.30, y); }
vec3 metal(float x, float w) { float s = x / w; return mix(vec3(0.16, 0.15, 0.15), vec3(0.62, 0.58, 0.54), pow(1. - abs(s + 0.35), 3.)); }
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / res.y;
  float px = 1.5 / res.y;
  float y = p.y; float ax = abs(p.x);
  vec3 col = vec3(0.); float alpha = 0.;
  // Base: a cone that widens to the table.
  if (y < -0.30) {
    float w = mix(0.17, 0.115, smoothstep(-0.5, -0.30, y));
    float a = smoothstep(px, -px, ax - w) * step(-0.5, y);
    col = metal(p.x, w) * (0.75 + 0.25 * smoothstep(-0.5, -0.3, y)); alpha = a;
  }
  // Cap: a short cone with a rounded top.
  else if (y > 0.32) {
    float w = mix(0.062, 0.03, smoothstep(0.32, 0.45, y));
    float a = smoothstep(px, -px, ax - w) * smoothstep(0.455 + px, 0.455 - px, y);
    col = metal(p.x, w); alpha = a;
  }
  // Glass: dark translucent liquid, wax blobs, bulb glow, glass highlights.
  else {
    float w = glassW(y);
    float inside = smoothstep(px, -px, ax - w);
    float f = 0.;
    for (int i = 0; i < ${N}; i++) { vec2 d = p - blobs[i].xy; f += blobs[i].z * blobs[i].z / (dot(d, d) + 1e-5); }
    f += 0.0016 / (pow(y + 0.305, 2.) + 0.0006); // the pool of wax resting on the bulb
    float bulb = exp(-pow((y + 0.30) * 7., 2.)) * (0.6 + heat * 0.8);
    vec3 liquid = mix(vec3(0.10, 0.03, 0.05), vec3(0.42, 0.10, 0.06), bulb + 0.15 * smoothstep(0.3, -0.3, y));
    float wax = smoothstep(0.9, 1.25, f);
    vec3 waxCol = mix(vec3(1.0, 0.33, 0.08), vec3(1.0, 0.72, 0.28), clamp(smoothstep(1.0, 6.0, f) * 0.55 + bulb * 0.6, 0., 1.));
    waxCol *= 0.75 + 0.35 * smoothstep(0.32, -0.3, y); // brighter near the bulb
    col = mix(liquid, waxCol, wax);
    float hl = smoothstep(-0.62, -0.5, p.x / w) * smoothstep(-0.25, -0.4, p.x / w); // glass reflection
    col += vec3(1.0, 0.92, 0.85) * hl * 0.22;
    col += vec3(1.0, 0.8, 0.6) * smoothstep(0.86, 1.0, ax / w) * 0.12; // rim
    alpha = inside;
  }
  // Warm halo on the wall behind the lamp.
  float hw = 0.5 * res.x / res.y;
  float halo = exp(-length(p * vec2(1.6, 1.0) - vec2(0., -0.05)) * 6.) * (0.3 + heat * 0.22)
    * smoothstep(hw, hw * 0.55, ax) * smoothstep(0.5, 0.3, abs(y)); // fades out before the canvas edge
  vec3 haloCol = vec3(1.0, 0.45, 0.15) * halo;
  o = vec4(col * alpha + haloCol * (1. - alpha), alpha + halo * (1. - alpha));
}`
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s }
  const prog = gl.createProgram()
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog)
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const U = n => gl.getUniformLocation(prog, n)
  const uRes = U('res'), uBlobs = U('blobs'), uHeat = U('heat'), uTime = U('time')
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

  const glassW = y => 0.058 + 0.082 * ss(0.32, -0.16, y) - 0.022 * ss(-0.16, -0.30, y)
  const blobs = Array.from({ length: N }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.12, y: -0.28 + Math.random() * 0.55, vx: 0, vy: 0,
    r: 0.022 + Math.random() * 0.018, t: Math.random()
  }))
  let heat = 0.2, stir = null, last = 0
  const data = new Float32Array(N * 3)

  function size() {
    const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2)
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d)
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  function toLamp(e) {
    const r = canvas.getBoundingClientRect()
    return { x: (e.clientX - r.left - r.width / 2) / r.height, y: -(e.clientY - r.top - r.height / 2) / r.height }
  }
  function step(dt) {
    heat += (0.2 - heat) * dt * 0.25
    for (const b of blobs) {
      // Temperature: warmed by the bulb, cooled near the top. Warm wax rises, cool wax sinks.
      const nearBulb = Math.exp(-((b.y + 0.29) ** 2) * 60)
      b.t += (nearBulb * (0.9 + heat) - 0.18 - Math.max(0, b.y - 0.15) * 1.5) * dt * 0.5
      b.t = Math.min(1.4, Math.max(0, b.t))
      b.vy += (b.t - 0.45) * dt * 0.06
      b.vx += -b.x * dt * 0.02 + Math.sin(performance.now() * 0.0004 + b.r * 300) * dt * 0.004
      if (stir) { // drag pulls nearby wax along with the finger
        const dx = stir.x - b.x, dy = stir.y - b.y, fall = Math.exp(-(dx * dx + dy * dy) * 90)
        b.vx += (dx * 2.2 + stir.dx * 9) * fall * dt; b.vy += (dy * 2.2 + stir.dy * 9) * fall * dt
      }
      b.vx *= 1 - dt * 1.6; b.vy *= 1 - dt * 1.1
      b.x += b.vx * dt; b.y += b.vy * dt
      if (b.y < -0.285) { b.y = -0.285; b.vy = Math.abs(b.vy) * 0.2 }
      if (b.y > 0.29) { b.y = 0.29; b.vy = -Math.abs(b.vy) * 0.2; b.t *= 0.8 }
      const lim = Math.max(0.005, glassW(b.y) - b.r * 0.8)
      if (Math.abs(b.x) > lim) { b.x = Math.sign(b.x) * lim; b.vx *= -0.3 }
    }
    if (stir) { stir.dx *= 0.6; stir.dy *= 0.6 }
  }
  function draw(time) {
    blobs.forEach((b, i) => { data[i * 3] = b.x; data[i * 3 + 1] = b.y; data[i * 3 + 2] = b.r })
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform3fv(uBlobs, data)
    gl.uniform1f(uHeat, heat); gl.uniform1f(uTime, time)
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  let running = false
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 0.016; last = now
    for (let i = 0; i < 3; i++) step(dt * 1.4)
    draw(now / 1000)
    if (running) requestAnimationFrame(loop)
  }
  function warm() { heat = Math.min(1.6, heat + 0.7); blobs.forEach(b => { if (b.y < 0) b.t += 0.35 }) }

  size(); addEventListener('resize', () => { size(); if (!running) draw(0) })
  if (reduce) {
    blobs.forEach((b, i) => { b.y = -0.25 + (i / N) * 0.5; b.x = Math.sin(i * 2.1) * glassW(b.y) * 0.5 }); draw(0)
    return
  }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; last = performance.now(); requestAnimationFrame(loop) }
    else if (!e.isIntersecting) running = false
  }).observe(canvas)

  let downAt = null
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); const q = toLamp(e)
    stir = { ...q, dx: 0, dy: 0 }; downAt = { ...q, t: performance.now() }
  })
  canvas.addEventListener('pointermove', e => {
    if (!stir) return
    const q = toLamp(e); stir.dx = q.x - stir.x; stir.dy = q.y - stir.y; stir.x = q.x; stir.y = q.y
  })
  const up = e => {
    if (downAt && performance.now() - downAt.t < 280) { const q = toLamp(e); if (Math.hypot(q.x - downAt.x, q.y - downAt.y) < 0.02) warm() }
    stir = null; downAt = null
  }
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', () => { stir = null; downAt = null })
  canvas.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); warm() } })
}
function ss(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
