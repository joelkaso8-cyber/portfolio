---
name: Bojë Tattoo
description: Fine-line and blackwork studio in Blloku, Tirana; the thermal stencil sheet is the page.
colors:
  tissue: "#ECEBEF"
  sheet: "#F6F5F8"
  flash-sheet: "#F3F2F6"
  field: "#FCFCFD"
  ink: "#17151D"
  ink-2: "#393643"
  muted: "#5B5767"
  line: "rgba(23, 21, 29, .12)"
  line-soft: "rgba(23, 21, 29, .07)"
  violet: "#4C3BC2"
  violet-deep: "#3A2B9E"
  violet-soft: "#B6ABF8"
  on-violet: "#FFFFFF"
  tape: "rgba(212, 199, 160, .6)"
  on-ink: "#ECEBEF"
  on-ink-2: "#B9B5C4"
  film-ground: "#1D1A23"
  error: "#A3262E"
  error-text: "#8A1F27"
  error-surface: "#FBEFF0"
typography:
  display:
    fontFamily: "Gloock, Times New Roman, serif"
    fontSize: "clamp(2.4rem, 1.35rem + 3.3vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Gloock, Times New Roman, serif"
    fontSize: "clamp(2.2rem, 1.4rem + 3vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Gloock, Times New Roman, serif"
    fontSize: "clamp(1.45rem, 1.25rem + .7vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  quote:
    fontFamily: "Gloock, Times New Roman, serif"
    fontSize: "clamp(1.2rem, 1.08rem + .45vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "-0.005em"
  numeral:
    fontFamily: "Gloock, Times New Roman, serif"
    fontSize: "clamp(3rem, 2.4rem + 2vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.82
  lede:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + .25vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"ss01\""
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.1
  price:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
  caption:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.55
rounded:
  sheet: "0px"
  drawer: "2px"
  tight: "4px"
  control: "6px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  container: "1320px"
  ribbon: "32px"
  nav: "64px"
  stack: "18px"
  sheet-pad: "clamp(28px, 4vw, 56px)"
  section: "clamp(72px, 9vw, 140px)"
  section-lg: "clamp(84px, 10vw, 150px)"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1.3em"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.on-violet}"
  button-primary-sm:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    rounded: "{rounded.control}"
    padding: "0 1em"
    height: "42px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 1.3em"
    height: "50px"
  button-ghost-hover:
    textColor: "{colors.violet}"
  link-arrow:
    textColor: "{colors.violet}"
    typography: "{typography.label}"
    height: "44px"
  button-round:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "48px"
  chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "42px"
  chip-active:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
  lang-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.tight}"
    height: "36px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "50px"
  paper-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
  flash-sheet:
    backgroundColor: "{colors.flash-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  flash-claim:
    textColor: "{colors.violet}"
    height: "48px"
    padding: "0 18px"
  flash-claim-hover:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
  thumb-cta:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    rounded: "{rounded.control}"
    height: "54px"
---

# Design System: Bojë Tattoo

## Overview

**Creative North Star: "The Stencil Sheet"**

The studio's own working material is the interface. Every piece of a tattoo begins as violet carbon line on translucent thermal tissue, taped to the table and nudged into place before a needle touches skin; this system is built from exactly those materials. The ground is a cool tissue grey, every container is a sheet of paper held down by masking tape and set a fraction of a degree off-square, and the one saturated colour on the page is stencil violet, the colour of the transfer line. Strip out all copy and photography and the tissue, the tape and the violet line still say which studio this is.

Density is calm and editorial: large Gloock headlines, generous section padding, asymmetric two- and three-column grids where columns are staggered vertically rather than aligned in rows. Depth comes from paper physics, not from interface chrome: long soft shadows that fall below a lifted sheet, translucent tissue with a light backdrop blur over photographs, and motion that peels and settles with a paper-like ease. Inversions to ink (the flash wall, the footer, the lightbox) read as a dark corkboard on which tissue sheets are pinned.

The world was chosen against the tattoo-category default it refuses: a black screen of full-bleed photographs, neon or gold calls to action and an Instagram grid.

**Key Characteristics:**
- Cool tissue ground (60), ink type and ink walls (30), stencil violet only for line, primary action and active state (10).
- Every content container is a square-cornered paper sheet with a 1px edge, a long paper shadow and a slight rotation.
- Masking-tape tabs hold sheets down; they are a structural mark of the world, not decoration.
- Translucent tissue over photography: the hero peels away on scroll, artist sheets lift on a tape hinge.
- One serif (Gloock, always 400) over one grotesque (Hanken Grotesk); figures are tabular.
- Reference-plate labels ("Ref. 01") tie flash sheets back to the hero's stencil plate.

## Colors

A near-achromatic violet-grey paper world with a single saturated ink colour.

### Primary
- **Stencil Violet** (violet): the thermal transfer line. Hero and flash linework, primary buttons, the thumb-zone booking bar, active chips and pressed lift toggles, link-arrows, nav hover and current underline, step numerals, focus rings, text selection and the caret.
- **Pressed Carbon** (violet-deep): the hover and pressed state of every violet action, and small violet text on paper (reference plates, the hero plate note) where extra contrast is wanted.
- **Line on Ink** (violet-soft): violet's stand-in on the ink ground. Focus outlines, hover colour and links on the flash wall, footer, lightbox and demo ribbon, and the hero scroll-progress bar.

### Neutral
- **Thermal Tissue** (tissue): the page ground and the 60. Also the html scroll gutter.
- **Tracing Sheet** (sheet): every paper container, round buttons, chips, the mobile drawer.
- **Flash Tissue** (flash-sheet): the slightly cooler sheet pinned on the ink flash wall; scoped to that wall only.
- **Field Paper** (field): input, select and textarea fill, a shade brighter than the sheet it sits on.
- **Ink Violet-Black** (ink): all headings and primary text on paper, the flash wall and footer grounds, the active language toggle, the demo ribbon.
- **Ink Wash** (ink-2): secondary text, ledes, step copy, inactive nav links.
- **Graphite** (muted): metadata, hints, captions, fine print, fact labels.
- **Pencil Line** (line) and **Faint Pencil** (line-soft): 1px section dividers and sheet edges; dashed variants of `line` rule fact lists, price tables and the flash claim strip.
- **Masking Tape** (tape): the translucent buff tab, the only warm hue in the system.
- **Tissue on Ink** (on-ink) and **Grey on Ink** (on-ink-2): primary and secondary text on the ink ground.
- **Film Ground** (film-ground): the hero stage colour behind the film before the poster paints.

### Status
- **Needle Red** (error), **Needle Red Text** (error-text), **Error Wash** (error-surface): invalid field border with a 3px wash ring, inline error text, and the form-level error panel.

### Named Rules
**The Carbon Line Rule.** Stencil violet is the only saturated colour on any screen. It marks the line itself, the primary action and the active state; nothing else is violet, and no second accent is ever introduced.

**The Inverted Line Rule.** On the ink ground, violet becomes violet-soft for every hover, link and focus ring; full-strength violet survives on ink only inside a paper sheet.

**The Tape Is Warm Rule.** The masking-tape buff is the system's only warm colour and appears only as tape.

## Typography

**Display Font:** Gloock (with Times New Roman, serif), self-hosted, weight 400 only.
**Body Font:** Hanken Grotesk (with system-ui, -apple-system, Segoe UI, sans-serif), variable 100-900, stylistic set ss01 on.

**Character:** A high-contrast, slightly brittle display serif with the cut of a stencil outline, set tight; under it a clean, warm grotesque that carries prices, labels and forms without any decoration.

### Hierarchy
- **Display** (400, clamp 2.4-4.75rem, 0.98, -0.028em): the hero H1 on its taped slip only. The place name is emphasised in violet, upright.
- **Headline** (400, clamp 2.2-4.25rem, 1.04, -0.02em): section H2s, balanced wrapping.
- **Title** (400, clamp 1.45-1.875rem for steps; artist names up to 2.6rem; price and visit titles up to 2.75rem; flash names 1.375rem): H3s on sheets.
- **Quote** (Gloock 400, clamp 1.2-1.45rem, 1.32): review text, set in the display face.
- **Numeral** (Gloock 400, clamp 3-4.5rem, 0.82, violet): process step numbers.
- **Lede** (Hanken 400, clamp 1.0625-1.2rem, max 58ch): the paragraph under a section headline.
- **Body** (Hanken 400, 1.0625rem/1.6): running text, capped at 46-54ch on sheets.
- **Label** (Hanken 600, 0.9375rem): buttons, chips, form labels, nav links (500), artist style line in violet.
- **Price** (Hanken 650, 1.125-1.1875rem, -0.01em, tabular): every euro figure.
- **Caption** (Hanken 500, 0.8125rem): fine print, credits, hints, ribbon. Footer column headings alone use 600, 0.08em tracking, uppercase.

### Named Rules
**The Single Cut Rule.** Gloock is always weight 400 and never italic; emphasis inside a headline is violet colour, not style.

**The Honest Figures Rule.** Every price, size and reference number is set in tabular figures so ranges line up down a sheet.

## Layout

A centred 1320px container with a fluid gutter (16-48px). Sections are separated by generous vertical padding (72-160px, fluid) and a 1px pencil-line top border rather than background changes; only the flash wall and footer switch to the ink ground.

Grids are asymmetric and staggered: process 5fr/6fr, prices and booking 7fr/5fr, artists 1.3fr/1fr/1fr with the second and third columns dropped progressively lower, the flash wall four columns with each sheet given its own offset and tilt. Process steps alternate inset left and right like sheets laid on a table. Section heads are a single column up to 760px, or a split pair (headline beside lede) on wide screens.

Fixed chrome is stacked: a 32px demo ribbon, a 64px blurred tissue header, and on phones a thumb-zone booking bar that appears after the hero. The hero is a sticky 100svh stage inside a taller scroll track (100svh + 560px desktop, + 420px phone), so the page scrolls normally while the film scrubs.

Breakpoints step at 1080 (nav collapses to the drawer, flash wall to three), 980 (artists to two, process stacks), 900 (prices, booking, footer stack), 760 (phone hero, full-width hero buttons, flash wall to two, thumb bar on), 640 (artists to one, masonry to two), 560 and 520 (single-column hygiene list, fields and footer). Rotations and stagger offsets are reset or reduced as columns collapse.

## Elevation & Depth

Depth is paper on a table. Sheets rest flat with a hairline contact shadow plus a long, negatively spread drop that reads as the sheet's edge lifting slightly off the surface; nothing floats as a card. Translucent tissue (78-86% tissue colour, a 2.5-5px backdrop blur with reduced saturation, a white 1px edge) layers over photographs and the hero film. On the ink wall the same shadow deepens toward black. Hover raises a sheet a few pixels and lengthens its shadow.

### Shadow Vocabulary
- **Resting sheet** (`0 1px 1px rgba(23,21,29,.05), 0 18px 34px -22px rgba(23,21,29,.45)`): every paper sheet on the tissue ground.
- **Sheet on ink** (`0 2px 2px rgba(0,0,0,.18), 0 26px 40px -26px rgba(0,0,0,.9)`, hover `0 40px 50px -28px rgba(0,0,0,.95)`): flash sheets and the price sheet.
- **Hero slip** (`0 2px 2px rgba(23,21,29,.06), 0 40px 70px -34px rgba(0,0,0,.7)`): the headline slip over the film.
- **Lifted tissue** (`0 28px 40px -26px rgba(23,21,29,.55)`): an artist tissue folded up on its hinge; the hero sheet and drawer use the same long fall at -30px.
- **Tape** (`0 1px 1.5px rgba(23,21,29,.08)`): the tab's contact edge.
- **Violet action** (inset `0 1px 0 rgba(255,255,255,.18)` plus `0 10px 20px -14px rgba(58,43,158,.9)`): primary buttons; lengthens on hover.

### Named Rules
**The Paper Shadow Rule.** Shadows are soft, long and negatively spread, falling below the sheet; never a hard offset block and never an even glow around all sides.

**The Tissue Over Rule.** Translucency is reserved for tissue laid over imagery and for the header strip; solid sheets stay opaque.

## Shapes

Paper is square. Every sheet, tissue, photo mount and tile has 0 radius, a 1px edge, and a small rotation between -1.3 and 1.3 degrees, varied by position so no two neighbours share a tilt. Interactive controls are the only rounded forms: 6px for buttons, chips, inputs, toggles and the thumb bar, 4px inside the language toggle and on the form-success panel, 2px on the drawer sheet, full circles for round icon buttons and the brand dot, and a pill only for the ribbon's demo badge. Dashed 1px rules stand for perforation and tear lines (facts, price table, claim strip, success panel). Registration crosses (22px, 1px violet strokes at 75% opacity) mark the corners of the hero stencil plate.

### Named Rules
**The Square Paper Rule.** If it is paper it has square corners and a slight tilt; if it is a control it has a 6px radius and sits level.

## Components

### Buttons
Confident and inked, like a stamp on a paper slip.
- **Shape:** gently squared (6px), 50px tall (42px small), 1px border.
- **Primary:** stencil violet fill, white label at 600, WhatsApp glyph as inline SVG at 1.15em, the violet action shadow.
- **Hover / Focus:** pressed-carbon fill, 1px lift, longer shadow, 0.3s standard ease; focus is a 2px violet outline at 3px offset. Disabled drops to 60% opacity with a progress cursor.
- **Ghost:** transparent with a 22% ink border; hover turns border and label violet.
- **Link-arrow:** violet, 600, underline at 35% violet that firms up on hover while the gap to the arrow widens from 0.5em to 0.8em; 44px hit area.
- **Round:** 48px circle on sheet paper with a pencil-line border, used for slider and lightbox controls; scales to 0.96 when pressed.
- **Thumb bar:** fixed, full-width on phones, 54px violet bar that slides up from below once the hero is passed.

### Chips
- **Style:** sheet paper, pencil-line border, 6px radius, 42px tall, 600 ink-wash label.
- **State:** hover turns border and label violet; pressed (aria-pressed) fills violet with a white label. The language toggle is the same idea in ink: a 3px-padded tray whose pressed button fills ink.

### Cards / Containers
- **Corner Style:** square (0).
- **Background:** tracing sheet; flash tissue on the ink wall.
- **Shadow Strategy:** resting sheet, or sheet on ink (see Elevation).
- **Border:** 1px faint pencil.
- **Internal Padding:** fluid 22-56px; photo mounts 8-12px with a deeper bottom margin on the process photo, like a print border.

### Inputs / Fields
- **Style:** field paper fill, 1px 20% ink stroke, 6px radius, 50px min height, 600 label above, 7px gap; select uses a drawn chevron.
- **Focus:** border turns violet with a 3px 20% violet ring; no outline.
- **Error / Disabled:** needle-red border and 14% red ring, inline error text below, a red-washed panel for form-level errors. Success replaces the form with a dashed violet panel.

### Navigation
- **Style:** a strip of tissue under the ribbon: 76% tissue with a 16px blur and a faint pencil bottom edge. Gloock wordmark at 1.75rem with a violet dot.
- **States:** links at 500 ink-wash; hover and current turn violet and draw a 1px violet underline from the left.
- **Mobile:** below 1080px a 48px menu button opens a sheet that drops from under a tape tab, with links set in Gloock at 1.6rem over faint pencil rules, the primary button and opening hours; an ink scrim blurs the page.

### Stencil Hero (signature)
The film plays full-bleed behind a large taped tissue sheet carrying violet linework, registration crosses and a reference-plate note. Scrolling peels the sheet up and back on a top hinge (up to 64deg) while it fades and the film scrubs forward; scrolling up reverses it. A taped headline slip, tilted -0.6deg, stays pinned bottom-left (bottom on phones) with the H1, lede and actions, and a 2px violet-soft progress bar runs along the stage foot. Reduced motion or no film: a still poster with the sheet resting half-lifted.

### Lift the Sheet (signature)
Artist portfolios are mounted photos covered by a tissue sheet showing the stencil. Hover (fine pointers), tap or the "lift" toggle folds the tissue up on its tape hinge (-64deg, 0.95s paper ease) to show the healed piece; the toggle fills violet when pressed. Under reduced motion the tissue rests half-lifted (translateY(-2%) rotateX(-34deg), 62% opacity) so the healed piece is never fully hidden, and the toggle still folds it fully up. Flash sheets never lift: a flash design has no healed piece yet.

### Flash Sheet (signature)
A tissue sheet pinned on the ink wall: taped corner, violet line drawing, a violet "Ref. 0X" plate in the top corner opposite the tape (so tape and plate never collide); at 760px and below the drawing drops 36px so the plate (.6875rem, 2px/6px padding, 12px from the top) gets its own band above it, name in Gloock, size and placement in graphite, the price in tabular 650, and a full-width claim strip below a dashed tear line that fills violet on hover.

## Do's and Don'ts

### Do:
- **Do** keep violet to the line, the primary action and the active state, at roughly a tenth of any screen (The Carbon Line Rule).
- **Do** make every new container a square paper sheet with a 1px faint-pencil edge, the resting-sheet shadow and a tilt between -1.3 and 1.3 degrees.
- **Do** hold sheets down with tape tabs (86x24px, rotated 2-5 degrees) at a top corner or centre.
- **Do** swap violet for violet-soft on hovers, links and focus rings on the ink ground.
- **Do** animate paper with the paper ease (`cubic-bezier(.16,.84,.3,1)`) and state changes with the standard ease at 0.3s; reveals only move sheets 26px into place and never hide text.
- **Do** set every price and reference number in tabular figures.
- **Do** keep icons as inline SVG from the sprite, sized 1.15em.

### Don't:
- **Don't** introduce a second saturated hue, gold, or neon; the tape buff is the only warm colour.
- **Don't** round the corners of a sheet, or give a control a tilt.
- **Don't** use a hard offset shadow or an all-round glow; shadows fall below the paper.
- **Don't** set Gloock bold or italic.
- **Don't** build a black screen of full-bleed photos with an Instagram-style grid; photography always sits mounted on paper or under tissue.
- **Don't** make flash sheets lift; the lift belongs to artist work that has a healed piece to show.
- **Don't** put full-strength violet text directly on the ink ground.
