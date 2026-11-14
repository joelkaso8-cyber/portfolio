# Rules for every website

## Scroll hero (required)
Every website I build, redesign or demo gets a scroll-driven hero. Treat this as a pinned brief, also in Impeccable.
- A film (video or image sequence) behind the hero plays forward as the visitor scrolls down and backward as they scroll up.
- Reference: portfolio/hero-film.js and portfolio/work/balte-studio/scrub.js (repo joelkaso8-cyber/portfolio).
- The page scrolls normally: no scroll lock or hijacking. The hero may hold still briefly while the film plays.
- The headline and the main action (book, call, WhatsApp) stay readable and usable the whole time.
- Reduced motion, or a film that cannot load: show a still poster image, and hide nothing.
- Keep it light on phones: a smaller mobile film, preload none or metadata, poster first.
- Existing sites change only when I ask.

## 1. Obsidian vault sync protocol
The Obsidian vault is the single source of truth. Before writing or modifying any code, check the vault:
- Read `01-Briefs/` for the active project's brand palette, target audience, copy, sitemap and primary CTA.
- Read `02-Design-System/` for typography scales, color tokens and layout rules.
- Read `03-Components/` to reuse existing pre-approved UI blocks before building from scratch.
- After completing any major section or solving a technical issue, document new reusable components in `03-Components/` and architectural/SEO decisions in `04-Decisions/`, in clean Markdown with `[[WikiLinks]]`.

## 2. Anti-generic visual design
Never generate generic "AI-looking" websites. Every site must look crafted by a boutique design studio.
- BANNED: purple/blue neon gradients, generic 3-column centered icon cards, pure `#000000` on `#FFFFFF`, and filler AI copy ("Elevate your experience", "Seamless solutions", "Unleash").
- Color: 60-30-10 ratio. 60% intentional dominant neutral (e.g. warm alabaster `#FAF8F5`, stone, or deep obsidian `#0F1012`), 30% rich secondary surface/typography contrast, 10% high-intent accent strictly for primary CTAs and active states.
- Typography: pair an expressive display/serif heading font with a crisp sans-serif body font. Fluid sizing (`clamp()`) for headings, tight tracking on large display text, body paragraphs 60ch–70ch.
- Spatial rhythm and depth: generous vertical padding (`py-20` to `py-32` desktop, `py-12` mobile), asymmetric grids, bento layouts, subtle 1px borders (`border-black/5` or `border-white/10`), refined micro-interactions (`transition-all duration-300 ease-out`) on every interactive element.

## 3. Conversion and UX
- 3-second above-the-fold rule: the hero immediately says what the business is, where/who it serves, and has one unmistakable primary CTA (direct booking, WhatsApp/call, or get a quote).
- Mobile-first thumb zone: design for 375px+ first. Keep sticky navigation clean; primary booking/contact actions reachable with one thumb.
- Trust and authenticity: real photography layouts, social proof/reviews, clear pricing/service tiers, interactive maps, zero-friction contact/booking flows.

## 4. Code, performance and SEO
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) with Tailwind CSS or clean CSS custom properties. Keep copy/data separate from layout markup.
- Core Web Vitals, Lighthouse 95+ target: `fetchpriority="high"` on the hero image, `loading="lazy"` on all below-the-fold media, explicit `width`/`height` or `aspect-ratio` (no CLS), modern formats (WebP/AVIF).
- SEO and schema: every page has a unique `<title>`, `<meta name="description">`, OpenGraph tags, canonical URL, semantic H1→H3 hierarchy, and valid JSON-LD (`LocalBusiness`, `Hotel`, `Service` or `WebSite`).
- Accessibility, WCAG AA: 4.5:1 text contrast, descriptive `alt` on every image, visible focus rings, proper `<label>` on all inputs.

## 5. Execution workflow
For every new website, page or feature:
1. Read vault: check the Obsidian project brief and design rules first, or ask me to create the brief note in `01-Briefs/` if it doesn't exist yet.
2. Propose blueprint: a concise summary of the aesthetic direction, color/font tokens, and section-by-section structure.
3. Build and sync: once I approve (or if I say "build right away"), write complete, production-ready code with no placeholders (`// TODO`), and update the Obsidian project note with completed tasks.
