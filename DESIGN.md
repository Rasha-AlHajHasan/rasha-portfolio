---
name: Rasha Al Haj Hasan — Portfolio
description: A developer's journal in Studio Grey and Graphite, stitched together by a single Bordeaux Thread.
colors:
  studio-grey: "#E9EAEC"
  paper-white: "#FFFFFF"
  sunken-grey: "#F3F4F5"
  hairline: "#D0D2D6"
  graphite: "#141416"
  graphite-soft: "#404246"
  graphite-faint: "#5C5F64"
  bordeaux-thread: "#7A1F2B"
  bordeaux-text: "#7A1F2B"
  bordeaux-tint: "#F3E7E9"
  studio-grey-dark: "#0E0E10"
  paper-white-dark: "#1A1A1D"
  sunken-grey-dark: "#151518"
  hairline-dark: "#323238"
  graphite-dark: "#F4F4F5"
  graphite-soft-dark: "#CACBCF"
  graphite-faint-dark: "#9C9EA4"
  bordeaux-thread-dark: "#9E2F40"
  bordeaux-text-dark: "#D6808E"
  bordeaux-tint-dark: "#30181D"
  device-bezel: "#1C1C1F"
typography:
  display:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.45rem + 2.4vw, 3.25rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.8vw, 2.625rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.3
  subtitle:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  lead:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  button:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: "0.22em"
  script:
    fontFamily: "Allura, Aref Ruqaa, cursive"
    fontSize: "1.15em"
    fontWeight: 400
    lineHeight: 1
rounded:
  sm: "2px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  card: "20px"
  section: "64px"
  section-lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.studio-grey}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "rgb(20 20 22 / 0.85)"
  button-outline:
    textColor: "{colors.graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.paper-white}"
  nav-cta:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.studio-grey}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  nav-link-active:
    textColor: "{colors.graphite}"
  tag:
    textColor: "{colors.graphite-soft}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  skill-chip:
    textColor: "{colors.graphite}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  empty-state:
    textColor: "{colors.graphite-faint}"
    typography: "{typography.title}"
    padding: "40px 0"
---

# Design System: Rasha Al Haj Hasan — Portfolio

## Overview

**Creative North Star: "The Developer's Journal"**

The site reads like a working developer's journal: real code and real devices on the opening page, each page header signed with one handwritten word, and every page framed in an orderly editorial grid of hairline rules, numbered sections and small tracked labels. The working parts are shown, from the code editor in the hero to the typed localhost address, but the frame around them stays calm, so the work reads as considered rather than busy.

It is warm and personal, not corporate. The warmth comes from three quiet sources rather than from colour or decoration: a single Bordeaux Thread that marks Rasha's presence (the dot after her name, the active-page underline, section numbers, the focus ring), one script word per page that feels written by hand, and generous space that lets each fact breathe. Everything else is Studio Grey, Paper White and Graphite.

Density is low and unhurried: one idea per row, long line-height, wide gutters. The system holds its character in light and dark, from a 320px phone to a wide desktop, and with whatever content the Google Sheet currently holds. Sparse content is normal, and the layout should look intentional with a single item as much as with ten. Accessibility is part of the identity, not a layer on top: every state the Bordeaux Thread marks must also be readable, operable by keyboard and calm under reduced motion.

Items marked **Pending** describe the target behaviour where today's code differs; implement them before treating the rule as met.

**Key Characteristics:**
- Cool grey canvas, white working surfaces, graphite type, one burgundy accent.
- Light-weight Jost display type (300), regular body (400), medium (500) for titles, labels and buttons.
- Structure drawn with 1px hairlines and numbered section rules, not boxes and fills.
- Pill-shaped controls and tags; gently rounded (6px) cards.
- Physical objects (phone, laptop, browser) are the only things that cast real shadows.
- WCAG 2.2 AA in both themes.

## Colors

A near-monochrome studio palette (cool greys and graphite) held together by a single deep burgundy thread. Every colour except physical-object colours is a CSS variable (`--c-*` in `src/index.css`) with a light and a dark value; the `-dark` tokens are the dark-theme values of the same roles.

### Primary
- **Bordeaux Thread** (`bordeaux-thread`, CSS `--c-wine`): the decorative accent. Hairlines beside labels, bullet dashes in Experience, the hero stage baseline and text selection. In dark mode (`bordeaux-thread-dark`) it is a deeper red that reads as a line on charcoal but **does not reach 3:1**, so it is decorative only there.
- **Bordeaux Text** (`bordeaux-text`, CSS `--c-wine-text`): the accent tuned for meaning, used for small accent text (section numbers, "Featured", the period column) and for every interactive state (focus ring, active-page indicator, hover underline, hover icon). In light mode it equals Bordeaux Thread; in dark mode it lightens (`bordeaux-text-dark`) to stay above 3:1 for indicators and 4.5:1 for text.
- **Bordeaux Tint** (`bordeaux-tint`): a whisper of the accent for very light backgrounds; defined but rarely used.

### Neutral
- **Studio Grey** (`studio-grey`): the page canvas and the header's translucent background. Dark: near-black `studio-grey-dark`.
- **Paper White** (`paper-white`): working surfaces such as project cards, device screens and the outline button's hover fill. Dark: charcoal `paper-white-dark`.
- **Sunken Grey** (`sunken-grey`): recessed areas such as image wells, image-loading wells, the "no screenshots" strip and browser address bars.
- **Hairline** (`hairline`): every 1px rule and border, tag and chip outline, and loading skeleton. Decorative only (1.3–1.5:1); never the sole sign of a state or boundary.
- **Graphite** (`graphite`): primary text and the solid fill of primary buttons, and the menu button.
- **Graphite Soft** (`graphite-soft`): secondary text such as intros, bullets and tag text.
- **Graphite Faint** (`graphite-faint`): labels, inactive nav links, captions, empty-state supporting text.
- **Device Bezel** (`device-bezel`): phone and laptop bezels and the code editor; stays dark in both themes, like real hardware.

### Contrast (WCAG 2.2 AA, measured)

| Pair | Light | Dark | Use |
|---|---|---|---|
| Graphite on Studio Grey / Paper White | 15.3 / 18.4 | 17.5 / 15.8 | All primary text |
| Graphite Soft on Studio Grey / Paper White | 8.4 / 10.1 | 11.9 / 10.7 | Secondary text |
| Graphite Faint on Studio Grey / Paper White | 5.3 / 6.4 | 7.2 / 6.5 | Labels, captions (lowest text pair; never go lighter) |
| Bordeaux Text on Studio Grey / Paper White | 8.5 / 10.2 | 6.7 / 6.1 | Accent text, focus ring, state indicators |
| Bordeaux Thread on Studio Grey | 8.5 | **2.7** | Decorative lines only in dark mode |
| Hairline on Studio Grey | 1.3 | 1.5 | Decorative rules only |

Body text needs 4.5:1, and large text (24px+, or 19px+ at 500) needs 3:1. Focus rings, state indicators and meaningful icons need 3:1 against what is next to them.

### Named Rules
**The One Thread Rule.** Bordeaux is for graphics, rules, dots, numbers, small labels and interactive states, never for body text, headings or large fills.

**The Accessible Thread Rule.** When Bordeaux signals a state (focus, current page, hover, selection), it is Bordeaux Text, never Bordeaux Thread, so the cue clears 3:1 in both themes. It accompanies a second cue (underline, border, weight, icon or fill change) and is never the only sign of the state. One Bordeaux cue per element at a time. **Pending:** four state cues currently use Bordeaux Thread, which is 2.7:1 in dark mode: the focus outline, the desktop active-page underline, the Projects filter-chip hover border and the Contact channel icon's hover border. Switch all four to Bordeaux Text.

**The Theme Pair Rule.** Every colour is a role token with a light and a dark value. Hard-coded colours are allowed only for physical objects (bezels, editor chrome and syntax colours, the gallery's dark backdrop).

## Typography

**Display Font:** Jost (then system-ui)
**Body Font:** Jost (same stack)
**Script Font:** Allura

Loaded weights: Jost 300–600, with `display=swap`.

**Character:** Jost is a geometric sans in light weights: clean and technical, but round enough to feel friendly. The script face is the handwriting in the margin of the journal: one word, never a sentence.

### Hierarchy
- **Display** (300, `display` clamp, line-height 1.08): the name in the Home hero only.
- **Headline** (300, `headline` clamp, 1.12): page titles ("Experience", "Skills"), each followed by its script word.
- **Title** (400, or 500 where it aids scanning; `title` clamp, 1.3): role titles, empty-state headings, the About headline.
- **Subtitle** (500, 16px, 1.5): skill-group names, glance and summary terms, card titles in dense grids, short emphasis inside rows.
- **Lead** (400, `lead` clamp, 1.75): page intros, the hero tagline, bio paragraphs. Keep intros to about 42rem (`max-w-2xl`).
- **Body** (400, 15px on phones and 16px from 640px up, 1.625): everything else; bullets and card summaries step down to 14–15px. Keep line length within about 70 characters.
- **Button** (500, 14px): pills and text links.
- **Label** (500, 11px, 0.22em tracking, uppercase): the small tracked labels ("CAREER", "AT A GLANCE") and section-rule titles.
- **Script** (400, 1.15em of the title it accompanies, line-height 1): one decorative word per page header (`path`, `toolkit`, `hello`), aria-hidden.

### Named Rules
**The Light Display Rule.** Display and headline sizes stay Light (300); hierarchy at the top of a page comes from size, not weight. Medium (500) is the weight for scanning and structure: subtitles, titles that sit in dense rows, labels, buttons and short emphasis. Body text stays Regular (400). 600 is loaded but not used; reach for size or spacing before reaching for it.

**The One Script Word Rule.** The script face appears once per page, beside the page title (plus the single script line in the hero). It is decorative and aria-hidden, and it never carries information.

## Layout

- **Page frame:** a single centred column, max 72rem (1152px), with gutters of 16px on phones, 24px from 640px and 32px from 1024px. The header is 64px tall, sticky, on translucent Studio Grey with a backdrop blur and a hairline below.
- **Rhythm:** major Home sections are 64px apart (80px from 768px); the page header sits on a hairline with 32–40px below it.
- **Grid:** content rows use a 12-column grid from 768px. Experience puts company and period in 3 columns and the role in 9. About pairs a 7-column introduction with a 5-column "at a glance" panel. Skills pairs a 4-column group name with 8 columns of chips.
- **Lists as rows:** experience, skills groups, background entries, contact channels and summaries are rows divided by hairlines, not cards.
- **Optional columns hold their place:** when a row's side cell (period, date) is empty, the main cell stays in its own column; it never slides into the empty one. Home experience rows already do this (`col-start-2`). **Pending:** the About "Education & background" rows still shift when the period is blank; anchor their content column to column 4.

### Responsive
- **Breakpoints:** 640px (`sm`), 768px (`md`), 1024px (`lg`), 1280px (`xl`). Everything stacks to one column below 768px. The desktop nav appears at 1024px; below that, a menu button opens a full-width dropdown. The header "Get in touch" button appears only from 1280px.
- **Minimum width 320px:** no horizontal scroll, no text clipped. Long values (emails, URLs) truncate with an ellipsis or wrap with `break-words`; they never push the layout wider.
- **Header on phones and tablets:** the menu button sits at the start of the bar and the theme toggle at the end, so the bar stays balanced at every width down to 320px.
- **Hero:** text first, then the device showcase, one column until 1024px; from 1024px the hero splits 5:6, text beside the stage. (Showcase sizing is under Components.)

### Named Rules
**The Hairline Rule.** Structure is drawn with 1px Hairline rules (top/bottom borders and dividers), not with filled boxes. Reach for a rule before a background.

**The Numbered Section Rule.** Sections open with a section rule: a Bordeaux number ("01"), a tracked label, a hairline that fills the row, and an optional action link at the end. Numbers count only the sections actually shown.

## Elevation & Depth

The interface is flat by default: surfaces separate through tonal steps (Studio Grey canvas, Paper White cards, Sunken Grey wells) and hairline borders, not shadows. Real shadows currently belong only to physical objects: the phone, laptop and browser window in the hero (`device` shadow), their floating technology chips (a small shadow), and portrait phone screenshots inside project cards.

Soft lift is permitted but not yet used. Cards, menus and other floating layers may take a soft, diffuse shadow on hover or while floating above content. Keep it subtler than the device shadow, use it to signal state or layering rather than decoration, and record the value here when it is first introduced.

### Shadow Vocabulary
- **Device** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 24px 48px -24px rgb(0 0 0 / 0.35)`): hardware mock-ups in the hero showcase only.

### Named Rules
**The Objects-Cast-Shadows Rule.** Physical objects cast real shadows; interface surfaces get, at most, a soft lift for state.

## Shapes

Two shape families: **pills** and **gently rounded rectangles**. Interactive controls and small labels are full pills (9999px): buttons, the theme toggle, the menu button, tags and skill chips. Containers such as project cards, the stats strip, the expertise panel have gently rounded corners (6px). Gallery images use 8px, and focus outlines a 2px corner. Device mock-ups keep realistic, proportional radii. Dots are perfect circles (6px for the active marker, 4px for bullets and badges), and lines are exactly 1px.

## Components

### Buttons
Refined and restrained: pill shapes, quiet hover changes, and an arrow that nudges in the reading direction.
- **Shape:** full pill (9999px), minimum 44px tall, 20px side padding, 14px medium text, icon gap 8px.
- **Primary:** Graphite fill with Studio Grey text; hover eases to 85% opacity over 300ms.
- **Outline:** a 1px Graphite border at 25% opacity with Graphite text; hover strengthens the border to full Graphite and fills with Paper White. Its label, not its border, identifies it as a button.
- **Text link:** no pill. Graphite text with a 1px Hairline underline 6px below; hover and focus turn the underline Bordeaux Text. Used for "More about me", "View project" and section-rule actions.
- **Icon nudge:** forward arrows (→ ↗) slide 2px in the reading direction on hover. **Pending:** today every button icon moves forward, including the 404 page's back arrow and non-directional icons (mail, GitHub, images). Back arrows should nudge backwards, and non-directional icons should not move.
- **States:** default → hover (300ms) → focus-visible (ring) → active (no extra transform). There is no disabled state; unavailable actions are hidden, not greyed out.

### Tags and chips
- **Tag** (technologies on projects and roles): pill, 1px Hairline border, 12px Graphite Soft text, 2px × 10px padding; always left-to-right. Not interactive.
- **Skill chip:** pill, 1px Hairline border, 14px Graphite text, 4px × 12px padding.
- **Filter chip** (Projects page): a pill button, 36px tall, 12px medium text, 14px side padding. Selected is a Graphite fill and border with Studio Grey text plus `aria-pressed`. Unselected is a hairline pill with Graphite Soft text; on hover the border turns Bordeaux and the text turns Graphite. Technology names stay left-to-right. **Pending:** the hover border uses Bordeaux Thread; switch it to Bordeaux Text.
- **Label with thread:** a 24px Bordeaux hairline followed by the tracked label; opens every page header and the hero.

### Cards
- **Corner style:** 6px.
- **Background:** Paper White on Studio Grey, with a 1px Hairline border that darkens to 30% Graphite on hover.
- **Shadow strategy:** none at rest (see Elevation; soft lift on hover is allowed).
- **Internal padding:** 20px.
- **Project cards:** every card is the same size, in a grid of up to 3 columns with equal-height rows, and shows its full summary. Featured projects carry a label, not a larger card.
- **Media:** screenshots sit in a Sunken Grey well and scale up 2% on hover over 700ms. Portrait phone screenshots are shown whole, never cropped. See Content states for missing images.

### Navigation
- **Desktop (1024px and up):** 14px links in Graphite Faint that turn Graphite on hover. The current page is Graphite with a 1px Bordeaux Text underline that springs between links (**Pending:** colour switch, see the Accessible Thread Rule) and carries `aria-current="page"`.
- **Header controls:** a 36px round theme toggle whose label says what it will switch to, and from 1280px a "Get in touch" pill.
- **Mobile:** a solid Graphite round menu button (`aria-expanded`, `aria-controls`) opens a full-width dropdown of 48px rows. Each row has a Bordeaux Text index number, and the current page is marked by a Bordeaux dot plus Graphite text. Escape closes the menu and returns focus to the button; navigating closes it.
- **Footer:** the name and year, optional badges, page links and "Back to top" (an upward arrow, which never flips).

### Icons
- **Set:** Lucide outline icons at 16px (14px in dense rows, 20px in the gallery), with a 2px stroke, in `currentColor`. Decorative icons are `aria-hidden`; icon-only buttons have a text label.

### Device Showcase (signature)
The Home hero's stage: one phone. Code is typed character by character on its screen (Dart, then C#/.NET, swapping every 6.4 seconds), with a blinking caret, and then the running app says "Hello, world!". The technology is shown only inside the screen; nothing floats outside the device. The bezel and code pane stay dark in both themes. This is the journal's "working page" and the one place on the site where motion is the content.

- **Semantics:** the stage is `aria-hidden`; a single static sentence in a visually hidden `figcaption` describes it once. It is decorative, so its tiny interface text does not need to meet text-size or contrast minimums, but it must never hide or overlap real content.
- **Sizing:** a 4:3 stage, full column width up to 34rem (544px), centred; everything inside scales with the stage width (container query units). The phone's code is 1.9% of the stage width.

| Viewport | Stage | Notes |
|---|---|---|
| 320px | 288 × 216px | Verified: no horizontal scroll, phone 90% of stage height. |
| 390px | 358 × 269px | Verified. |
| 768px | 544 × 408px (capped) | Centred under the text. |
| 1024px+ | 6/11 of the hero row, max 544px wide | Beside the text, vertically centred. |

- **Rules at every size:** the stage never exceeds the column, and text that isn't typed yet already holds its space. No scene reflows the page; transitions change opacity, a 10px rise and 1–1.5% scale only. The stage pauses while off screen or when the tab is hidden.
- **Reduced motion:** snippets only cross-fade, every 8 seconds, with no typing (the code is simply shown in full), and the caret stops blinking.
- **Pause control:** the showcase changes snippets on its own indefinitely, and WCAG 2.2.2 (Pause, Stop, Hide) requires a way to pause automatic movement that lasts more than 5 seconds. **Pending (proposed):** add a small pause/play pill (36px, Paper White, hairline border, Bordeaux Text focus ring) at the stage's bottom end corner, labelled "Pause animation" / "Play animation". Under reduced motion it starts paused on the first scene. This replaces the original "no controls" choice; confirm before implementing.

### Splash screen
A laptop opens once per browser session: the lid lifts from flat over 1.5 seconds, the screen lights with a faint Bordeaux glow, the name is typed, and the page fades in at 3.5 seconds, when the hero starts typing. A click or key press skips it. It is never shown with reduced motion. It is `aria-hidden`, and the page underneath is already loaded.

### Contact details
Home's closing section and the Contact page share one list of rows filled from the Contact sheet tab: a round icon, a small label and the value, separated by hairlines. Rows that link somewhere carry a ↗ arrow; Location is plain text. Beside the list, Home has one sentence and a pair of pill buttons ("Send an Email", "View LinkedIn"). The wording stays direct and professional, never an availability or job-seeking message.

### Content states (Google Sheets and images)
The sheet can be slow, unreachable, or partially filled. Visitors should never see an error, a blank page or a broken image; every state below is designed.

**Data source order (invisible to visitors):** fresh browser copy (5 minutes) → live sheet → last saved browser copy → bundled copy shipped with the site. A sheet outage therefore shows the last known or bundled content. No error message appears while any copy exists.

| State | Treatment |
|---|---|
| **Loading** | A skeleton matching the page: a short Hairline pill for the heading, then 3–4 rows of tapering length, gently pulsing (static under reduced motion). It carries `role="status"` and a page-specific label, e.g. "Loading experience". On inner pages the page header renders immediately and only the content area waits; the Home page shows the skeleton until its data arrives. |
| **Empty tab / no active rows** | An empty state between two hairlines, centred: a Title-size line in Light weight ("Experience is being updated") and a Graphite Faint sentence pointing somewhere useful. Never an apology, an error code or a blank area. |
| **Empty optional section** | Hidden entirely, with its section number dropped (Home stats, About background, footer badges, Contact location). |
| **Placeholder rows** (blank required cell, `is_active` FALSE, contact without a link) | Skipped, never shown as empty rows. |
| **Missing optional cell** (no period, company, summary or technologies) | The element is omitted; neighbouring columns hold their place (see Layout → Optional columns). |
| **Missing profile** | The name falls back to the built-in site name, the role to "Software Developer", and the tagline to the built-in intro line, all translated. |
| **Invalid link in the sheet** (not `https://`, `http://` or `/`) | The button or image is not rendered. |

**Images:**
- **Loading:** the image well shows Sunken Grey at its final aspect ratio (16:10 on cards), so nothing jumps; the image fades in over 500ms once loaded (instantly under reduced motion). Images below the fold load lazily.
- **No screenshots for a project:** a slim strip (80px tall, Sunken Grey, hairline below) with the platform icon in Bordeaux Text and "Screens coming soon" in Graphite Faint. The card keeps its text layout.
- **Broken image URL:** that image is removed silently. If it was the cover, the next screenshot becomes the cover; if none remain, the no-screenshots strip appears. Inside the gallery, a failed image shows "This image is unavailable." in Graphite Faint in place of the picture, and navigation still works.
- **Portrait screenshots:** shown whole (`object-contain`) with breathing room, never cropped; landscape screenshots fill the well, anchored to the top.
- **Alt text:** cover buttons are labelled "Open {project} screenshots"; gallery images are "{project} screenshot {n}".

### Motion
- **Easing:** editorial easing `cubic-bezier(0.2, 0.7, 0.2, 1)` for every transition.
- **Reveal:** content blocks fade in and rise 10px over 0.5s, once, as they enter the viewport. The motion is vertical only, so it is the same in both directions.
- **Hover:** colour and border changes take 300ms; icon nudges follow the reading direction (see Buttons).
- **Page header:** the title fades up 8px over 0.5s on load.
- **Navigation:** the active underline springs between links (stiffness 380, damping 34); the mobile menu fades and drops 6px over 0.2s. Both are direction-neutral.
- **Gallery:** the overlay and images cross-fade (0.2s); previous/next follow the reading direction.
- **Reduced motion** (`prefers-reduced-motion: reduce`):
  - Framer Motion runs in "user" mode, so movement, scale and layout animation are dropped and only opacity fades remain. The nav underline jumps instead of springing.
  - CSS animations and transitions are cut to effectively zero, so the caret stops and the skeleton stops pulsing.
  - The showcase cross-fades only.
  - Scrolling is instant. **Pending:** "Back to top" calls a smooth scroll from script, which the CSS rule cannot override; it should jump instantly under reduced motion.
- **Limits:** no parallax, no scroll-jacking, no infinite motion outside the hero showcase, and nothing that flashes more than three times a second.

### Accessibility baseline (WCAG 2.2 AA)
- **Contrast:** as measured in Colors → Contrast. Graphite Faint is the lowest text colour allowed, and state indicators use Bordeaux Text.
- **Keyboard:**
  - Everything interactive is reachable and operable by keyboard, in visual order.
  - The first Tab stop is "Skip to content", which jumps to `#main`.
  - The menu closes on Escape and returns focus to its button.
  - The gallery is a modal dialog: focus moves into it, Tab is trapped, Escape closes it, arrow keys move between images in the reading direction, and focus returns to the element that opened it.
- **Focus visible:** a 2px solid ring offset 2px with 2px corners, on `:focus-visible` only (no ring on mouse click). It uses Bordeaux Text (**Pending:** currently Bordeaux Thread, which is 2.7:1 in dark mode). It must never be clipped by `overflow: hidden`; give cropped containers inner padding or an inset ring.
- **Targets:** primary controls are at least 44px tall. Header controls (theme toggle, menu button) are 36px. Every target is at least 24 × 24px with spacing (WCAG 2.5.8).
- **Semantics:**
  - Each page has one `h1` (the page title), and section rules are `h2`.
  - Lists are real lists, and the current page carries `aria-current`.
  - Toggles expose `aria-pressed` or `aria-expanded`, and loading blocks are `role="status"`.
  - The script word and the showcase are hidden from assistive technology.
- **Language:** `lang="en"` on `<html>`.
- **Reflow and zoom:** content works at 320px wide and at 200% text zoom without loss or horizontal scrolling (the showcase may scale down).
- **Moving content:** see Device Showcase → Pause control.

## Do's and Don'ts

### Do:
- **Do** use role tokens (`canvas`, `surface`, `ink`, `line`, `wine`, `wine-text`) so every new element works in light and dark at once.
- **Do** draw structure with 1px Hairline rules and numbered section rules before reaching for boxes or fills.
- **Do** use Bordeaux Text for every interactive state (focus ring, current page, hover underline) and pair it with a second cue (The Accessible Thread Rule).
- **Do** set display and headline in Jost Light (300), body in Regular (400), and use Medium (500) for titles, subtitles, labels and buttons where it helps scanning.
- **Do** give each new page header one script word, aria-hidden.
- **Do** design every content block for one item, many items, a missing field and a missing translation, and give every list a loading skeleton and an empty state.
- **Do** keep controls as pills at least 44px tall (header controls 36px), with a visible 2px focus ring.
- **Do** respect reduced motion: opacity-only transitions, no typing or resizing, nothing that blinks.

### Don't:
- **Don't** set body text, headings or long passages in Bordeaux, use Bordeaux Thread as a state indicator in dark mode, or add a second accent colour.
- **Don't** signal a state with colour alone or with a Hairline-coloured border alone.
- **Don't** add shadows to interface surfaces at rest. Real shadows belong to physical objects, and lift is for hover or floating state only.
- **Don't** use weight 600 or above, or set display or headline text heavier than 300.
- **Don't** use the script face for information, navigation or more than one word per page header.
- **Don't** hard-code colours outside physical objects.
- **Don't** show empty placeholders, error codes or broken images: hide what is missing and use the designed fallback states.
- **Don't** add automatic motion without a pause mechanism, or motion that ignores reduced-motion settings.
