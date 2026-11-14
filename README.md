# Joel Kaso · portfolio

Websites for hotels, restaurants and local businesses.
Live: https://joelkaso8-cyber.github.io/portfolio/

Plain HTML, CSS and JavaScript. No build step: edit a file, check it locally, push.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: sections, headings, the contact form |
| `main.js` | All texts in English and Albanian, the list of sites, the quick quote, the form |
| `style.css` | Colours, fonts, sizes, layout |
| `hero-film.js` | The film behind the first screen that plays as you scroll |
| `form-guard.js` | Spam protection for the form |
| `analytics.js` | Visit and click counting (GoatCounter, off until you add your code) |
| `assistant.js`, `assistant-kb.json` | The chat assistant and the answers it gives |
| `privacy.html`, `404.html` | Privacy policy (EN + SQ) and the "page not found" page |
| `img/` | Screenshots on the cards: `<id>-desk.webp`, `<id>-desk-600.webp`, `<id>-phone.webp`, `<id>-phone-260.webp` |
| `media/` | The hero film and its still pictures |
| `work/<id>/` | Each demo or client site |

## Change a text

Open `main.js` and find the text in the `T` block. Every text is there twice: once under `en:` and once under `sq:`. Change both so the two languages say the same thing.

The English texts are also written in `index.html` (it is what shows before JavaScript runs). If you change an English text in `main.js`, change the same sentence in `index.html`.

## Change a price

Launch prices: €400 one-page, €600 business site with booking, €800 hotel and guesthouse. Usual prices: €800, €1,000, €1,200. Change all of these together:

- Plan prices: in `index.html`, inside each `<p class="price">`.
- The offer band: `offer.text` in `main.js` (both languages) and the same sentence in `index.html` (`offer__text`). The `€400` in `offer__title` is the "from" price.
- Quick quote: `USUAL` and `LAUNCH` in `main.js`. A one-page business that ticks "booking" moves up to the booking price, €600 (in `quoteFacts`).
- Care plan (€25 a month): `care.title`, `care.text` and `faq.a1` in `main.js` (both languages), and the same texts in `index.html`.
- The chat assistant: the prices in `assistant-kb.json` (facts and the `price`, `packages` and `monthly` answers).
- Google's copy of the prices: `makesOffer` and `priceRange` in the `application/ld+json` line in `index.html`.

## Launch spots left

In `main.js`, set `SPOTS_LEFT` to the real number of launch spots still open, for example `var SPOTS_LEFT = 7`. The offer band then says "7 of 10 launch spots left". Lower it each time a client signs. `null` hides the line.

## Free preview

The offer band offers a free homepage preview within 48 hours. The texts are `preview.*` and `faq.q7`/`faq.a7` in `main.js` (both languages), the same English text in `index.html`, and the `preview` answer in `assistant-kb.json`. To stop offering it, delete the `offer__preview` block in `index.html` and the 7th FAQ item.

## Google Search Console

To see what people search on Google before they find the site: open https://search.google.com/search-console, add the property `https://joelkaso8-cyber.github.io/portfolio/`, choose "HTML tag", and paste the `<meta name="google-site-verification" ...>` tag into the `<head>` of `index.html`. Then submit `sitemap.xml` there.

## Add a client review

Open `main.js` and find `REVIEWS`. While the list is empty, the "What clients say" section is hidden. Add one entry per client, in both languages, and only with their permission:

```js
var REVIEWS = [
  { name: 'Arben Hoxha', role: { en: 'Owner, Hotel Example, Berat', sq: 'Pronar, Hotel Example, Berat' },
    quote: { en: 'What they said, in their words.', sq: 'Çfarë thanë, me fjalët e tyre.' },
    url: 'https://their-site.al/' }
]
```

`url` is optional. Short, specific quotes work best: what changed for the business (more bookings, less commission, faster replies).

## Visit and click counting

`analytics.js` counts visits and button presses with GoatCounter: no cookies and no personal data, and the privacy policy already describes it. It is on, with the code `joelkaso`. To move it to another account:

1. Make a free account at https://www.goatcounter.com and pick a code, for example `joelkaso`.
2. In `analytics.js`, set `var CODE = 'joelkaso'` and push.
3. See the numbers at `https://joelkaso.goatcounter.com`.

Besides page visits it counts these events: `whatsapp-<where>` (which WhatsApp button: hero, contact, dock…), `call-<where>`, `email-<where>`, `plan-<type>` ("Start with this"), `quote-sent-whatsapp`, `quote-copy`, `form-sent`, `want-site-like-this`, `open-site-<id>`, `language-<en|sq>` and `go-quote-from-<where>`. It does nothing on localhost.

## Show, hide or add a site

- Show or hide: edit the `SHOWN` list in `main.js`. A site not in the list stays in `work/` but is not on the page.
- Add: put the site in `work/<id>/`, add one entry to `WORK` in `main.js` (name, category, tag, place, chips in both languages), add `<id>` to `SHOWN`, and add four screenshots to `img/`: desktop 1200×750 and 600×375, phone 390×844 and 260×563, all WebP.

## Change a picture

Replace the file in `img/` or `media/` with one of the same name, size and format. Keep the width and height the same, or also change the `width` and `height` numbers next to it.

## Phone, WhatsApp, email

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
- The form is delivered by FormSubmit to the email in `main.js`. No keys or passwords are stored in this code, and none should ever be added to it.
- GitHub Pages cannot send security headers. `_headers` is ready for Netlify or Cloudflare Pages if the site moves there.
