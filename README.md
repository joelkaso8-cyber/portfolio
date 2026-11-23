# Joel Kaso · portfolio

Websites for hotels, restaurants and local businesses.
Live: https://joelkaso8-cyber.github.io/portfolio/

Plain HTML, CSS and JavaScript. No build step: edit a file, check it locally, push.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: sections, headings, the contact form |
| `main.js` | All texts in English and Albanian, the list of sites, the savings calculator, the contact form with the quick quote built in |
| `style.css` | Colours, fonts, sizes, layout |
| `hero-film.js`, `depth.js` | Not loaded any more (hero film and 3D wall/phone removed on 2026-11-23); kept for reference, safe to delete with `media/` |
| `form-guard.js` | Spam protection for the form |
| `analytics.js` | Visit and click counting (GoatCounter, off until you add your code) |
| `assistant.js`, `assistant-kb.json` | The chat assistant and the answers it gives |
| `privacy.html`, `terms.html`, `404.html` | Privacy policy and terms of service (EN + SQ) and the "page not found" page |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `logo.svg` | The JK mark in the gold accent (`#e5b869`); `logo.svg` is the mark plus the "Joel Kaso" wordmark (the nav has the same drawing inline) |
| `img/og-image.png` | The 1200×630 share picture for WhatsApp, Facebook, LinkedIn and X |
| `img/` | Screenshots on the cards: `<id>-desk.webp`, `<id>-desk-600.webp`, `<id>-phone.webp`, `<id>-phone-260.webp` |
| `media/` | The hero film and its still pictures |
| `work/<id>/` | Each demo or client site |

## Change a text

Open `main.js` and find the text in the `T` block. Every text is there twice: once under `en:` and once under `sq:`. Change both so the two languages say the same thing.

The English texts are also written in `index.html` (it is what shows before JavaScript runs). If you change an English text in `main.js`, change the same sentence in `index.html`.

## Change a price

Packages: **Essential Landing** from 150€ (3–4 days), **Business Pro** from 300€ (5–10 days, marked "Recommended"), **Custom Signature** 600€+ (10–14 days). Terms: 50% deposit to start, 50% at launch. Care plan 25€/month, optional. Reply promise everywhere: "I reply within 24 hours" / "Përgjigjem brenda 24 orëve" (the chat assistant says "Joel replies within 24 hours"). Change all of these together:

- Package prices: in `index.html`, inside each `<p class="price"><b>` in the Packages & Pricing section (`#services`).
- Package names, who they are for and what they include: `plan1.*`, `plan2.*`, `plan3.*` in `main.js` (both languages), and the same English text in `index.html`.
- The terms line under the packages: `plan.note` in `main.js` (both languages) and in `index.html`. The payment answer `faq.a5`, the guarantee `g.title` / `g.text` and `q.note` say the same thing.
- Each package button opens WhatsApp with its own message: `pkg1.wa`, `pkg2.wa`, `pkg3.wa` in `main.js`.
- Quick quote (inside the contact form): `FROM` (starting price) and `DAYS` (delivery) per package in `main.js`. A business that picks booking, two languages, an editable menu or the Google profile moves up from Essential Landing to Business Pro.
- Care plan (€25 a month): `care.title`, `care.text` and `faq.a1` in `main.js` (both languages), and the same texts in `index.html`.
- The chat assistant: the prices in `assistant-kb.json` (facts and the `price`, `packages`, `time` and `payment` answers).
- Google's copy of the prices: `makesOffer` and `priceRange` in the `application/ld+json` line in `index.html`, and the "From 150€" in the meta descriptions (`index.html`, and `desc` in `main.js`).
- The package badges on the showcases: `tier.*` in `main.js` (both languages).

## Which package each showcase sells

In `main.js`, `TIER` names the package each showcase sells: Vjosa Rafting the Essential Landing, Lule Balkan Kitchen the Business Pro site, Hotel Kaso Ervehe the Custom Signature site. Those three get a badge on their card and in the preview window ("Essential Landing example · from 150€"). Add an id to `TIER` to badge another site. While `KASO_LIVE` is off, the hotel's badge says "example"; once it is on, it says "live client site".

## Launch spots left

In `main.js`, set `SPOTS_LEFT` to the real number of launch spots still open, for example `var SPOTS_LEFT = 7`. The Packages section then says "7 of 10 launch spots left". Lower it each time a client signs. `null` hides the line.

## Free preview

The Packages section offers a free homepage preview within 48 hours (the card next to the savings calculator). The texts are `preview.*` and `faq.q7`/`faq.a7` in `main.js` (both languages), the same English text in `index.html`, and the `preview` answer in `assistant-kb.json`. To stop offering it, delete the `preview` card in `index.html` and the 7th FAQ item.

## Google Search Console

To see what people search on Google before they find the site: open https://search.google.com/search-console, add the property `https://joelkaso8-cyber.github.io/portfolio/`, choose "HTML tag", and paste the `<meta name="google-site-verification" ...>` tag into the `<head>` of `index.html`. Then submit `sitemap.xml` there.

## Add a client review

Open `main.js` and find `REVIEWS`. Reviews show in the Contact section, under the WhatsApp button. While the list is empty and `REVIEW_PLACEHOLDER` is true, one card says `[TODO: client testimonial]`; set it to false to hide it. Add one entry per client, in both languages, and only with their permission:

```js
var REVIEWS = [
  { name: 'Arben Hoxha', role: { en: 'Owner, Hotel Example, Berat', sq: 'Pronar, Hotel Example, Berat' },
    quote: { en: 'What they said, in their words.', sq: 'Çfarë thanë, me fjalët e tyre.' },
    url: 'https://their-site.al/' }
]
```

`url` is optional. Short, specific quotes work best: what changed for the business (more bookings, less commission, faster replies).

## Visit and click counting

`analytics.js` counts visits and button presses with GoatCounter: no cookies and no personal data, and the privacy policy already describes it. It is on, with the code `joelkaso` (`CODE` in `analytics.js`; an empty `CODE` switches it off and nothing is loaded). To move it to another account:

1. Make a free account at https://www.goatcounter.com and pick a code, for example `joelkaso`.
2. In `analytics.js`, set `var CODE = 'joelkaso'` and push.
3. See the numbers at `https://joelkaso.goatcounter.com`.

Besides page visits it counts these events: `whatsapp-<where>` (which WhatsApp button: hero, contact, dock…), `call-<where>`, `email-<where>`, `quote-sent-whatsapp`, `quote-copy`, `form-sent`, `want-site-like-this`, `open-site-<id>`, `language-<en|sq>` and `go-quote-from-<where>`. It does nothing on localhost.

## Show, hide or add a site

- Show or hide: edit the `SHOWN` list in `main.js`. A site not in the list stays in `work/` but is not on the page.
- Add: put the site in `work/<id>/`, add one entry to `WORK` in `main.js` (name, category, tag, place, a two-line `outcome` and chips, all in both languages), add `<id>` to `SHOWN`, and add four screenshots to `img/`: desktop 1200×750 and 600×375, phone 390×844 and 260×563, all WebP.
- Cards link to `./work/<id>/` (relative, so the same links work locally and on GitHub Pages). Sites hosted elsewhere set `url` instead.

## Change a picture

Replace the file in `img/` or `media/` with one of the same name, size and format. Keep the width and height the same, or also change the `width` and `height` numbers next to it.

## Phone, WhatsApp, email

Every contact button on the main page (Get a free quote in the hero and nav, Start with this, the care plan, the free preview, I want a site like this, the WhatsApp buttons and the footer link) opens WhatsApp with the message in `wa.msg` in `main.js`: "Hi Joel, I checked out your portfolio and I'm interested in a website." in English, and the Albanian version for SQ visitors. They carry `data-wa`, and `main.js` writes the link from that one text, so change the message there. The "Send on WhatsApp" button in the contact form sends its own brief (name, business type, features, suggested package).

Search all files for `355685727406` and `joelkaso8@gmail.com` and change every match. The form sends to the address in `EMAIL` at the top of `main.js`.

## Check it locally

```
python -m http.server 8799
```

Then open http://127.0.0.1:8799/ and check phone width, both languages and the form. `node --check main.js` catches typos in the JavaScript.

## Publish

Copy the changed files to the git copy, commit, and push to `main`. GitHub Pages updates the live site in about a minute.

## Good to know

- Hotel Kaso Ervehe is the real client site. The other sites are interactive industry showcases with made-up business names. Demo photos come from Wikimedia Commons and are credited on each site.
- Switches at the top of `main.js`: `SPOTS_LEFT` (launch spots badge), `KASO_LIVE` ("Live Client Site" badge and footer line) and `KASO_QUOTE` (the hotel quote in the case study). Turn each on only when it is true.
- Case study results: `KASO_RESULTS` in `main.js` holds the three numbers (bookings a month before, after, and the share made direct). Fill them in only with real, measured numbers. The Results block stays hidden until at least one number is set (`RESULTS_PLACEHOLDER = true` would show dashed placeholders for the empty ones instead). `KASO_RATING_DATE` is the date the Booking.com rating was last checked; while it is empty the card says only "Source: Booking.com".
- The contact form needs FormSubmit's one-time activation: the first message sent from the live site makes FormSubmit email an activation link to the address in `EMAIL`. Click it once. Until then the form shows an error and opens the visitor's email app instead. See the `[TODO: FormSubmit activation]` comment in `main.js`. `REVIEW_PLACEHOLDER` shows one `[TODO: client testimonial]` card in Contact while `REVIEWS` is empty; add a real review or set it to false before going live.
- The form is delivered by FormSubmit to the email in `main.js`. No keys or passwords are stored in this code, and none should ever be added to it.
- GitHub Pages cannot send security headers. `_headers` is ready for Netlify or Cloudflare Pages if the site moves there.
