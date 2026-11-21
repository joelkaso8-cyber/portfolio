# Bojë Tattoo (demo)

A demo site for a made-up fine-line and blackwork tattoo studio in Blloku, Tirana. It is **not on the portfolio grid**: it isn't in `SHOWN` in `../../main.js`, and Brolin Tattoo keeps its card. Open it directly at `work/boje-tattoo/index.html`.

The idea: the studio's thermal stencil sheet is the page. Tissue-grey ground, ink type, one stencil violet (`#4C3BC2`) for lines and buttons, and masking tape holding every sheet down.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page, with the English text written in (what shows before JavaScript runs). The line drawings for the flash wall are `<symbol>`s at the top. |
| `content.js` | **All texts in English and Albanian**, the WhatsApp messages, the phone number and the form address. Change texts here, and change the English in `index.html` too. |
| `main.js` | Language switch, menu, lifting the stencils, flash claim links, gallery filter and lightbox, review arrows, the form. |
| `film.js` | The hero film. As you scroll through the first part of the page it plays forward, and backward when you scroll up, while the tissue sheet peels away. No scroll lock. |
| `style.css` | Colours (variables at the top), fonts, layout. |
| `form-guard.js` | Spam protection for the form (same as the other demos). |
| `privacy.html` | Privacy notice, EN with a short SQ summary. |
| `media/` | `hero.mp4` (desktop, 1280×720), `hero-m.mp4` (phones, 540×960), and the posters shown first and for reduced motion. |
| `img/` | Photos as WebP at 600 and 1200 px wide. `stencil-*.webp` are violet traces of the matching healed photos. |
| `fonts/` | Gloock (headings) and Hanken Grotesk (text), self-hosted. |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | The Impeccable brief, design system and review captures. |

## Change something

- **Prices:** the flash prices sit on each `<li class="sheet">` in `index.html` (in `<b>`). The price guide is the `<table class="ptable">`. Also update `priceRange` in the JSON-LD.
- **Artists, reviews, flash names:** texts are in `content.js` (`lea.*`, `rev.*`, `fl.*`) in both languages.
- **Phone / WhatsApp:** `wa` in `content.js`, plus the `tel:` links and JSON-LD in `index.html`.
- **Swap a photo:** replace `img/<name>-600.webp` and `-1200.webp` with the same proportions, or update the `width`/`height` next to it.

## Check locally

```
python3 -m http.server 8799
```

Open http://127.0.0.1:8799/work/boje-tattoo/ from the portfolio root and check phone width, `?lang=sq`, scrolling the hero up and down, and lifting a stencil. `node --check main.js film.js content.js` catches typos.

## Credits and what is made up

- Photos: Unsplash (Eugene Chystiakov, Agathè Lov, Antonino Visalli, Cloutier Benjamin, Graham Mansfield, Kevin Turcios, Thomas Despeyroux, BehindTheTmuna, Haberdoedas). Film: Mixkit free licence, graded and re-encoded. The flash drawings were made for this site.
- The studio, address, artists, prices and reviews are invented and labelled as a demo (top ribbon, review note, footer). Replace them all before using this for a real client.
