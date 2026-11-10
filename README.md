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
| `privacy.html`, `404.html` | Privacy policy (EN + SQ) and the "page not found" page |
| `img/` | Screenshots on the cards: `<id>-desk.webp`, `<id>-desk-600.webp`, `<id>-phone.webp`, `<id>-phone-260.webp` |
| `media/` | The hero film and its still pictures |
| `work/<id>/` | Each demo or client site |

## Change a text

Open `main.js` and find the text in the `T` block. Every text is there twice: once under `en:` and once under `sq:`. Change both so the two languages say the same thing.

The English texts are also written in `index.html` (it is what shows before JavaScript runs). If you change an English text in `main.js`, change the same sentence in `index.html`.

## Change a price

- Plan prices (`€400`, `€800`, `€1,000`, `€1,200`): in `index.html`, inside each `<p class="price">`.
- The offer band (`€400`): in `index.html`, `offer__title`, and the sentence under it in `main.js` (`offer.text`, both languages).
- Quick quote "usual" prices: `USUAL` in `main.js`.
- Google's copy of the price: `"price":"400"` and `"priceRange"` in the `application/ld+json` line in `index.html`.

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

- Demo sites use made-up business names. Demo photos come from Wikimedia Commons and are credited on each site.
- The form is delivered by FormSubmit to the email in `main.js`. No keys or passwords are stored in this code, and none should ever be added to it.
- GitHub Pages cannot send security headers. `_headers` is ready for Netlify or Cloudflare Pages if the site moves there.
