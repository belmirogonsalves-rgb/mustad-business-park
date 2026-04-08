# Mustad Business Park — Design Brief & Developer Handoff

> Generated from design audit, CRO analysis, iterative prototype sessions, and full site strategic review.
> Hand this to Claude Code in VS Code to scaffold the full site.

---

## 0. Strategic positioning (read this first)

The current site says: **"We rent office space."**

The site should say: **"We are a business ecosystem and flexible infrastructure platform."**

The real-world offering is strong:
- 70+ companies across mixed industries (tech, industrial, public, creative)
- Shared services: canteen, gym, meeting rooms, conference centre
- Custom build-to-suit capability
- 150+ years of industrial heritage (founded 1832/1873)
- Close to NTNU talent pipeline, ~1h50 from Oslo

**The one-sentence strategy:**
> Design the website as a hybrid between a real estate platform and a startup ecosystem hub.

Every design and copy decision should reinforce this positioning shift.

---

## 1. Site architecture

Intent-based structure, not page-based. Seven core pages:

```
1. Home          — overview + primary conversion
2. Spaces        — all listings + Space Finder UI
3. Ecosystem     — tenants, industries, social proof
4. Build for You — custom solutions, process story
5. About         — brand narrative, heritage to today
6. Location      — why Gjøvik, map, talent, cost
7. Contact       — book a viewing, form, team
```

---

## 2. Messaging system

Replace features with outcomes everywhere.

| Instead of | Say |
|---|---|
| "Meeting rooms" | "Professional spaces to host clients" |
| "Parking" | "Easy access for employees and logistics" |
| "Flexible space" | "Scale your business without relocating" |
| "Historical surroundings" | "A heritage address with modern infrastructure" |
| "Pleasant working environment" | "A community where connections happen naturally" |

**Key differentiators to reinforce on every page:**
- Flexible (space, contracts, build-to-suit)
- Mixed-industry ecosystem (not a monoculture office block)
- Proximity to talent (NTNU Gjøvik)
- Historical + modern hybrid identity
- Not corporate / sterile — human, community-driven

---

## 3. Brand & color system

### Palette

```css
--cream:       #F7F8F0   /* light section backgrounds */
--sky:         #9CD5FF   /* primary accent, highlights */
--steel:       #7AAACE   /* buttons, CTAs */
--navy:        #355872   /* body links, secondary actions */
--navy-dark:   #243e52   /* hover states */
--navy-deeper: #182c3a   /* hero, nav, contact section bg */
--ink:         #1a2a36   /* primary body text */
--ink2:        #3d5060   /* secondary text */
--ink3:        #6b8091   /* muted/tertiary text */
--ink4:        #a0b4c0   /* placeholder text */
--border:      rgba(53,88,114,0.10)
--border2:     rgba(53,88,114,0.18)
```

**No green. No teal. No emerald. Strictly navy / sky / steel.**

### Typography

- Font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Weights: 400 body / 500 labels + nav / 600 headings + stats
- H1: 38px / 600 / line-height 1.15 / letter-spacing -0.02em
- H2: 22px / 600 / letter-spacing -0.02em
- Body: 14–15px / line-height 1.65
- Eyebrow labels: 11px / 500 / uppercase / letter-spacing 0.07–0.08em

### Border radius

- Cards / sections: 14px
- Inputs, buttons, tags: 8px
- Pills / filter chips: 20px
- Small tags: 4px

### Global UX feel

The site should feel like a **continuous experience, not separate sections.**

- Sections overlap slightly with scroll-triggered transitions
- Avoid hard visual cuts between sections
- Animate entry/exit of content blocks (GSAP or CSS scroll-driven animations)
- Photo sections: people over buildings wherever possible
- Video loops welcome in hero and community sections

---

## 4. Page-by-page specifications

---

### 4.1 Home

**Scroll order = conversion funnel. Do not reorder.**

```
Nav → Hero → Tenant strip → Available spaces → Why Mustad → Properties → Contact → Footer
```

#### Nav
- Background: `--navy-deeper`
- Height: 62px, sticky, z-index 100
- Left: logo mark (steel square) + "Mustad Business Park" (sky on "Business Park")
- Centre: Available spaces / Properties / About the park / Location
- Right: "Book a viewing →" — steel bg button, hover navy
- Mobile: hamburger, full-screen overlay

#### Hero
- Background: `--navy-deeper`
- Subtle radial highlight: `radial-gradient(ellipse 55% 70% at 75% 40%, rgba(122,170,206,0.12), transparent 65%)`
- Eyebrow: "Gjøvik, Norway · Established 1873"
- H1: "Space for businesses that want to **grow**" — "grow" in `--sky`
- Sub: ~380px max-width, `rgba(255,255,255,0.48)`
- Primary CTA: "View available spaces" → scrolls to units
- Ghost CTA: "Download floor plan overview" → modal
- KPI strip: 452,000 ft² / 60+ active tenants / 3 min from E6 / 150 yrs heritage
- Sidebar cards: occupancy badge (87%, pulsing dot) + next available unit

#### Tenant strip
- Background: `--navy-dark`
- Pills: Hydro, Bama, Bring, Elgiganten, Europris, Eidsiva, Spørv Gjøvik + "+ 53 other businesses"

#### Available spaces (unit cards)
- Section eyebrow: "Available now"
- Filter chips: All / Office / Warehouse / Light industry
- 3-column grid
- Each card: image (120px) / building label / availability badge / size / type / **price (always visible)** / feature tags / "Book a viewing" CTA
- Available badge: sky-tinted. Taken cards: 50% opacity, pointer-events none
- Hover: border → `--steel`
- CTA opens modal pre-filled with unit name

#### Why Mustad (4 cards, 2-col grid)
- Background: `--cream`
- Cards: white bg, border, icon (sky-tinted square) + title + description
1. 3 minutes from the E6
2. Living industrial heritage
3. Flexible lease terms
4. 60+ businesses under one roof

#### Properties (3 cards)
- 3-col grid, image height 200px, `object-fit: cover`
- Hover: image scale(1.03), border → `--steel`

| Card | Image file | Badge |
|---|---|---|
| Mustad Business Park | `mustad-business-park.jpg` | Gjøvik city centre · 2 min |
| Hunndalen | `hunndalen.jpg` | E6 · Highway 4 · Retail strip |
| The Foundry | `the-foundry.jpg` | Gjøvik station · 5 min walk |

#### Contact section
- Background: `--navy-deeper` — full dark, no white card or white box
- Top: 3-column photo strip (220px, rounded corners, overlay captions)
- Bottom 2-col: left = headline + contact details / right = enquiry form
- Form: Name / Company / Email or phone / Type of space / Size / Move-in date
- Submit: "Send enquiry" → toast notification
- SLA: "Average response time: 4 hours during business hours"

---

### 4.2 Spaces page

**This is a tool, not a list.**

Build a **Space Finder UI:**

```
Sidebar filters:
  - Size range (m² slider)
  - Type: Office / Warehouse / Hybrid / Light industry
  - Building: All / Building A / Building C / The Foundry / Hunndalen
  - Availability: Available now / Coming soon / All

Results grid (3-col, collapses to 2 then 1):
  - Unit card (same spec as homepage)
  - Sort: Price low-high / Size / Availability
```

Think SaaS product interface, not real estate brochure.

Each unit card links to a **unit detail page** with:
- Photo gallery (3–5 images)
- Floor plan image
- Full spec table: m² / ceiling height / power / loading access / floor level
- Feature list
- "Book a viewing" form inline

---

### 4.3 Ecosystem page

**"Who you'll work alongside."**

Current site has a tenant list. This page makes it a conversion asset.

#### Structure:
- Eyebrow: "70+ businesses. One address."
- Intro: 2–3 lines on the mixed-industry community
- Industry filter tabs: All / Tech / Industrial / Public sector / Creative / Education
- Tenant grid: logo + company name + one-line description
- Pull stat strip: 70+ companies / 12+ industries / 36,000 m² / since 1873

**Why this matters:**
Social proof + differentiation. A prospect choosing between two parks will pick the one where interesting companies already work.

---

### 4.4 Build for You page

Turn the current text-heavy page into a **process story.**

#### Structure:

```
1. Your needs      — discovery, brief, site visit
2. Our planning    — design, permits, timeline
3. Build           — construction / renovation
4. Move in         — handover, onboarding
```

Add:
- 2–3 case studies (Sweco, Statens vegvesen, or similar tenants)
- Before/after visuals where available
- Lead form: "Tell us what you need" — name / company / m² requirement / timeline / message

This is enterprise-facing content. Tone should be confident and consultative.

---

### 4.5 About page

**Brand narrative: heritage → transformation → today → future.**

#### Structure:
1. **Heritage** — industrial roots, founded 1832, world's largest fish hook factory
2. **Transformation** — from factory to business park, the architectural conversion
3. **Today** — 70+ companies, mixed ecosystem, shared services
4. **Future** — growth vision, new developments, community investment

Support with:
- Timeline component (horizontal scroll or vertical)
- Archival + current photography side-by-side
- Pull quote from a long-standing tenant

---

### 4.6 Location page

**Sell the city, not just the address.**

#### Structure:

**"Why Gjøvik?"**
- Interactive map: show Oslo (~1h50), Lillehammer, Hamar, NTNU campus proximity
- Talent pipeline: NTNU Gjøvik feeds tech, engineering, business graduates
- Cost advantage: office cost per m² vs Oslo (use indexed data or directional language)
- Quality of life: nature, housing affordability, commute times
- Infrastructure: E6, Highway 4, rail connections

This section is crucial for companies relocating from Oslo or international entrants evaluating Norway.

---

### 4.7 Community / Life at Mustad (section or page)

**Undervalued asset. Add this.**

This can live as a section on About or as a standalone page.

#### Content:
- Event highlights (Women's Day, tenant meetups, etc.)
- Photos of people — not buildings
- 2–3 short tenant quotes ("Working here means…")
- Canteen and social space photography

Adds emotion and trust. Makes the place feel alive.

---

### 4.8 Team page

**Humanise it.**

Current: name + title list.

Upgrade to:
- Photo / name / title
- Short bio (2–3 lines)
- "Talk to me about…" line per person
- Direct email or LinkedIn link
- Warm, non-corporate tone

---

## 5. Global interactions & JS behaviour

| Trigger | Behaviour |
|---|---|
| "View available spaces" hero CTA | Smooth scroll to `#units` |
| "Book a viewing →" nav | Opens modal, no pre-fill |
| Unit card CTA | Opens modal, pre-fills unit name |
| Property card click | Opens modal, pre-fills property name |
| Filter chip (spaces) | Filters unit grid by `data-type` |
| Space Finder filters | Live-filters unit grid, updates count |
| Modal overlay click | Closes modal |
| Modal ✕ | Closes modal |
| Form submit | Closes modal if open, shows toast 4s |
| Scroll | Section entry animations (fade + translate-up) |

---

## 6. Image assets required

Place in `/public/images/` or `/assets/images/`.

| File name | Description | Used in |
|---|---|---|
| `mustad-business-park.jpg` | Brick complex with corten steel walkway | Properties card 1, About |
| `hunndalen.jpg` | "Mustad" sign on red brick building | Properties card 2 |
| `the-foundry.jpg` | Aerial of brick + white buildings, riverside | Properties card 3 |
| `contact-community.jpg` | Team meeting (overhead, round table) | Contact strip 1 |
| `contact-spaces.jpg` | Floor plan review (screen + 4 people) | Contact strip 2 |
| `contact-meeting.jpg` | Long table meeting (7 people, blue glass wall) | Contact strip 3 |

All images available in the design conversation thread. Export minimum 1200px wide, compress to WebP for production.

---

## 7. Suggested tech stack

```
Framework:     Next.js (App Router) — recommended for multi-page site with routing
Styling:       CSS custom properties (variables defined in section 3) — no Tailwind needed
Images:        next/image with WebP + lazy loading
Animations:    GSAP ScrollTrigger for scroll-driven transitions, or CSS scroll-driven animations
Forms:         Formspree / Netlify Forms — GDPR-compliant, no backend needed for MVP
Maps:          Mapbox GL JS or Leaflet (for location page interactive map)
Deployment:    Vercel (Next.js) or Netlify
Analytics:     Plausible or Fathom — privacy-first, GDPR-safe for Norwegian market
```

No CMS needed for v1. Content is stable enough to be hardcoded. Add Sanity or Contentful in v2 if the client wants self-service content updates.

---

## 8. Prompt for Claude Code

Paste this into Claude Code in VS Code to scaffold the project:

```
Build a multi-page business park marketing website for Mustad Business Park in Gjøvik, Norway.

Use MUSTAD_BRIEF.md as the single source of truth for all design, copy, color, component and interaction decisions.

Strategic framing: this is not a basic office rental site. It is a business ecosystem and flexible infrastructure platform. Every page should reflect this positioning.

Tech: Next.js App Router, CSS custom properties (no Tailwind), vanilla JS for interactions, GSAP for scroll animations.

Build in this order:
1. /app/layout.tsx — shared nav + footer
2. /app/page.tsx — Home (all 8 sections per brief section 4.1)
3. /app/spaces/page.tsx — Space Finder UI (brief section 4.2)
4. /app/ecosystem/page.tsx — tenant grid with industry filters (brief section 4.3)
5. /app/build/page.tsx — Build for You process story (brief section 4.4)
6. /app/about/page.tsx — brand narrative timeline (brief section 4.5)
7. /app/location/page.tsx — Why Gjøvik page (brief section 4.6)
8. /app/contact/page.tsx — full contact + team page (brief sections 4.7–4.8)
9. /styles/globals.css — full CSS variable system + base styles

Image tags use filenames from section 6 pointing to /public/images/[filename].
Add an HTML comment above each <img> indicating which physical photo it maps to.

Do not use any green or teal. Palette is strictly navy/sky/steel as defined in section 3.

"Book a viewing" CTA must appear in: nav, hero, every unit card, every property card, and the Build for You page.

The contact section on the homepage must be full dark — no white card, no white box.
```

---

## 9. Pre-launch checklist

- [ ] Gear/edit icons from CMS hidden on production build
- [ ] "Requested" property name confirmed with client (currently a placeholder)
- [ ] Prices confirmed with client before going live
- [ ] Response time SLA ("4 hours") agreed with client — change to "one business day" if not feasible
- [ ] GDPR consent checkbox added to all contact forms with privacy policy link
- [ ] `<meta name="description">` added with location keywords: Gjøvik, Innlandet, næringslokaler, kontor, lager, næringspark
- [ ] `LocalBusiness` structured data (schema.org) added for Google Maps visibility
- [ ] WebP images compressed and optimised
- [ ] All `alt` attributes completed on images
- [ ] Mobile nav tested at 320px, 375px, 390px breakpoints
- [ ] Sticky CTA tested on mobile scroll
- [ ] Form submissions tested end-to-end
- [ ] Analytics (Plausible/Fathom) installed and verified
