# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and vanilla JavaScript with no build step, matching the other demos in `portfolio/work/`. Self-hosted fonts, a Content-Security-Policy meta tag, and `form-guard.js` for spam. The form posts to FormSubmit (Joel's inbox, same as the other demos), with a pre-filled WhatsApp message beside it. Confirmed by Joel, 2026-11-21.

## Users

- **Young Tirana locals** (18-35) who are planning a tattoo and comparing studios on their phone, usually from Instagram.
- **Diaspora and tourists in Tirana for a few days.** They need to see each artist's work, understand the price range and get a consultation or session booked before they leave.

Their job: pick an artist whose style fits, learn roughly what it costs and how long it takes, and start a conversation on WhatsApp with a reference image. Bilingual EN / SQ.

## Product Purpose

A demo website for a fictional tattoo studio, **Bojë** (Albanian for ink or paint), in Blloku, Tirana. It specialises in fine-line and blackwork and has several resident artists. In Joel Kaso's portfolio it shows tattoo and creative-studio clients what a converting site looks like: style-led artist portfolios, honest price guidance, and a one-tap WhatsApp consultation.

Success: a visitor can tell within seconds what the studio does, where it is and how to book. Within a minute they have picked an artist and sent a consultation request.

## Positioning

The studio works by consultation first. Every piece starts with a short chat about placement, size and reference, then a drawn design, then a session. That is how fine-line and blackwork studios actually work, and it separates this demo from Brolin Tattoo (a single custom artist, already in the portfolio).

## Operating Context

- People book from Instagram links and Google Maps on phones. WhatsApp is the default channel in Albania.
- Tourists arrive with limited days, so walk-in or flash availability and lead times matter.
- The studio uses the flash days, deposits, aftercare, an age limit (18+ with ID) and hygiene standards that real tattoo studios use.

## Capabilities and Constraints

- Portfolio demo at `portfolio/work/boje-tattoo/`, linkable on its own, **not added to the portfolio grid (`SHOWN`)** until Joel decides. Brolin Tattoo keeps its card.
- Must carry the demo ribbon used on the other demos ("A sample site by Joel Kaso, not a real business"), `noindex`, and a privacy page.
- Scroll-driven hero film (CLAUDE.md "Scroll hero"), EN / SQ switcher, gallery with lightbox, reviews, a contact form (Name, Email/Phone, Artist/Date, Message), and a WhatsApp link to Joel's demo number (355685727406).
- Images: Joel's rules prefer real photography. Demo photos come from free-licence sources (Wikimedia Commons or Unsplash) and are credited on the site.

## Brand Commitments

- Name: Bojë (demo). Location: Blloku, Tirana (the address is illustrative).
- Joel's CLAUDE.md applies: no filler AI copy, no purple/blue neon gradients, no pure #000 on #FFF, WCAG AA, Lighthouse 95+ target.

## Evidence on Hand

- No real artists, reviews, prices or photos exist. Artist names, reviews and prices are **synthetic demo content** and must be labelled as a demo through the site-wide ribbon. Replace them all before any real launch.
- Price figures shown must be plausible Tirana ranges, presented as "from" guidance, never as quotes.

## Product Principles

1. Style first: visitors choose an artist by their work, so the portfolio does the selling.
2. Honest numbers: show price ranges, minimums, deposits and lead times plainly.
3. One tap to a human: every path ends at a WhatsApp consultation.
4. Craft and hygiene are proof, shown through process, not adjectives.

## Accessibility & Inclusion

WCAG AA: 4.5:1 text contrast, visible focus, labelled inputs, reduced-motion fallback (a still poster with nothing hidden). Both languages are complete.
