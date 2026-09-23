# CLAUDE.md

Guidance for Claude Code (or any agent) working in this repository.

## What this is

A public Astro + Starlight documentation site introducing "vibe coding," for
`santa-cruz-python`. Long-form, self-serve reading — a doc site, not slides.
Design spec: `docs/superpowers/specs/2026-09-23-vibe-coding-site-design.md`
in the `claude` workspace repo (not in this repo).

The content in `src/content/docs/` is Emmanuel's real content outline
(`outline.md` at the repo root), split into five pages and wired into the
sidebar in `astro.config.mjs`.

## Commands

```sh
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321/learn-vibe-coding/
npm run build     # production build to dist/ (also builds the Pagefind search index)
npm run preview   # serve the built dist/ locally, to test the base path and search
```

There is no test suite yet. `npm run build` is the closest thing to a
correctness check: it fails on broken content collections, invalid
frontmatter, and most invalid internal links.

Note: Pagefind (site search) only indexes the output of `npm run build`. It
does not work under `npm run dev` — don't read a blank search result there as
a bug.

## Structure

```
astro.config.mjs        Starlight integration: site/base, title, editLink,
                         customCss, and the sidebar
src/
  content/docs/          Page content (Markdown/MDX). index.mdx is the
                         splash landing page; start-here/, concepts/,
                         getting-set-up/ and building/ hold the five real
                         content pages split from outline.md.
  components/diagrams/   Four hand-authored inline-SVG diagrams, one
                         Astro component each — see "Diagrams" below
  styles/
    quiet-utility.css    Vendored design tokens — see below
    custom.css           Maps quiet-utility.css onto Starlight's --sl-*
                          properties, and restyles the note/tip/caution
                          asides
.github/workflows/deploy.yml   Deploys to GitHub Pages via withastro/action
                                on push to main
```

## Base path

This deploys to `https://santa-cruz-python.github.io/learn-vibe-coding/`, an
org project site, not a `<org>.github.io` root site. That means:

- `base: '/learn-vibe-coding'` in `astro.config.mjs` — leading slash, no
  trailing slash.
- Starlight's own generated links (sidebar, pagination, TOC, edit-this-page)
  already respect `base` automatically.
- Hand-written links do **not** get `base` injected for you. Prefer relative
  links between content pages (e.g. `../core-concepts/`, `guides/resources/`)
  over root-relative ones, since a relative link resolves correctly
  regardless of `base` and needs no manual prefixing. If you must write a
  root-relative or fully-qualified internal link (e.g. in `hero.actions` in
  frontmatter, which Starlight renders as a literal `<a href>` with no
  base-awareness), include `/learn-vibe-coding` in it explicitly.
- A link or asset reference that works under `npm run dev` (which usually
  serves at `/` in some setups, or otherwise tolerates path mistakes) but
  404s on the deployed Pages site is the classic failure mode here. Verify
  against `npm run build && npm run preview`, not just `dev`.

## No Tailwind — theme via `--sl-*` custom properties

This project deliberately does **not** use Tailwind or
`@astrojs/starlight-tailwind`. Starlight's Tailwind integration expects
colors as 11-step ramps; Quiet Utility defines flat tokens, not ramps, and
inventing nine unspecified shades per color to satisfy Tailwind would be
exactly the kind of drift a design system exists to prevent. Theme this site
by setting Starlight's `--sl-color-*` (and other `--sl-*`) custom properties
directly in `src/styles/custom.css`, using Quiet Utility's real values.

## Token-sync obligation (read this before touching colors/type)

`src/styles/quiet-utility.css` is a **hand-copied, point-in-time vendored
snapshot** of `design/theme.css` from the `claude` workspace repo (a
*different* git repository — this site's GitHub Actions only checks out
this repo, so it cannot reach across into the workspace repo at build
time). It was copied 2026-09-23, and re-copied the same day once Quiet
Utility's dark palette landed upstream (commit `adab9e5`).

Quiet Utility's color schema is **13 roles, each carrying a light AND a dark
value** (`colors.<role>.{light,dark}` in `DESIGN.md`; the 13th role,
`border-strong`, was added in the same change as the dark palette). This
project mirrors that: every `--qu-color-*` custom property in
`quiet-utility.css` is defined once at bare `:root` (light, the baseline)
and redefined — same property name — under both
`@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }`
and `:root[data-theme='dark']`, exactly like `design/theme.css` itself does.
Because of that, `src/styles/custom.css`'s `--sl-*` mapping is
**scheme-unconditional** — it references `--qu-color-*` once, with no
`[data-theme=...]` scoping of its own, and gets the right value for
whatever scheme is active. If you add a new mapped property, add it to that
one unconditional block; don't duplicate it per scheme.

This is knowingly incurred debt, not an oversight:

- **It will drift silently.** If Quiet Utility's tokens change in the
  workspace repo (`design/theme.css`, `design/DESIGN.md`), nothing here
  updates automatically, and nothing will warn you. Check the header comment
  in `quiet-utility.css` against the current `design/theme.css` any time
  something looks or feels off, and whenever you're told the design system
  changed.
- **To re-sync:** open `design/theme.css` in the workspace repo, copy the
  current token values into `src/styles/quiet-utility.css` for **both**
  schemes (keeping the `--qu-*` naming used here, since this project
  doesn't use Tailwind's `@theme` block), keep the two dark blocks
  (`@media` and `[data-theme='dark']`) identical to each other by hand
  (upstream enforces this with `scripts/check-views.mjs`; nothing enforces
  it here), and update the "copied" date in the header comment.
- **Dark mode is themed, as of the `adab9e5` re-sync.** All 13 roles have
  real dark values from `design/theme.css`; there's no placeholder block
  left. If a future Quiet Utility change adds a 14th role or changes what a
  role means, re-sync both schemes together — DESIGN.md's own rule is "don't
  add a color to one scheme and leave the other to be filled in later," and
  that applies to this vendored copy too.
- **`border-strong` isn't mapped to anything in `custom.css`.** Quiet
  Utility added it so interactive-control outlines (inputs, secondary
  buttons) can clear WCAG's 3:1 boundary requirement, which plain `border`
  doesn't. Nothing this site currently themes is an interactive control
  outline — the asides use `border` deliberately (see "Asides" below, same
  reasoning as the `card` component in DESIGN.md) — so there's nothing to
  wire it to yet. If a future change styles a real control (a themed
  `<input>`, a custom button), map its outline to `--qu-color-border-strong`
  rather than reusing `border`.
- **The long-term fix** is publishing Quiet Utility as an npm package so
  this file becomes a real dependency instead of a copy-paste. Not justified
  for a single consumer yet — revisit if a second site adopts Quiet Utility.

### Beyond the token mapping: two spots Starlight itself defaults to blue

Re-syncing the dark palette surfaced two places where Starlight's *own*
CSS reaches for a color the spec's mapping table doesn't cover, both fixed
in `custom.css`:

- `--sl-color-accent-high` — a second "high contrast" accent slot Starlight
  uses for the search-result hover/focus outline, the default `<Badge>`
  fill, and Expressive Code's dark-mode active tab border. It has no Quiet
  Utility counterpart (one accent role, not two), so it's mapped to the same
  `--qu-color-accent` rather than left at Starlight's default blue.
- The Pagefind search input's focus ring — Starlight themes its `border` on
  focus but never sets an `outline`, so the browser's native (blue) focus
  ring was showing through. Fixed with an explicit `outline: 2px solid
  var(--sl-color-accent); outline-offset: 2px` on
  `#starlight__search .pagefind-ui__search-input:focus-visible`, matching
  Quiet Utility's `focus-ring` component definition verbatim.

If something new shows up blue in either scheme, check whether it's a
`--sl-color-*` variable this file hasn't mapped yet before assuming the
palette itself is wrong.

## Fonts

Self-hosted via `@fontsource-variable/geist` and
`@fontsource-variable/geist-mono` (imported in `src/styles/custom.css`, which
sets `--sl-font` / `--sl-font-mono`). Deliberately not the Google Fonts CDN:
this is a public site and shouldn't leak reader requests to a third party or
block first paint on one. If fonts ever stop rendering, check that these
packages are still listed in `package.json` dependencies (not devDependencies
— they need to ship in the built site) before suspecting anything else.

## Asides

The three side-blurb types used on this site are Starlight's directive
syntax with custom titles:

```md
:::note[Resource Links]
:::tip[Pro Tip]
:::caution[Explore Further]{icon="open-book"}
```

The `{icon="open-book"}` on the caution directive overrides Starlight's
default warning-triangle icon for that variant — a warning triangle read
wrong on a "go explore more" prompt. This is a per-directive Markdown
attribute (see `getAsideIconName` / `remark-asides` in
`@astrojs/starlight`), not a component override, so it's the pattern to
reach for again rather than forking the `Aside` component.

All aside variants (including the unused `danger` type) are restyled in
`src/styles/custom.css` to a single neutral, bordered treatment — no
per-type fill colors — per Quiet Utility's "structure carried by borders and
spacing rather than color or shadow." They're told apart by icon and title
text, not by hue.

## Diagrams

Four hand-authored inline SVG diagrams live in `src/components/diagrams/`,
one Astro component each, with their own scoped `<style>` block. No
diagramming library, no build step, no external images. The two pages that
use them (`concepts/model-agent-harness-loops` and
`building/research-plan-build-verify`) are `.mdx` rather than `.md` purely so
they can import the components — the slugs and URLs are unchanged.

Rules that are not obvious from reading one component:

- **No literal hex, ever.** Every stroke, fill and text colour resolves from
  a `--sl-color-*` custom property, which `custom.css` maps from Quiet
  Utility. That is what makes the diagrams follow the light/dark toggle with
  no per-scheme rules of their own. `grep -rE '#[0-9a-fA-F]{3,8}'
  src/components/diagrams/` must stay empty.
- **440 user units wide, capped at 27.5rem.** SVG text scales with the
  viewBox, so the authored width sets the floor on phone legibility. At a
  390px viewport the content column is 358px, i.e. a 0.81 scale, which puts
  14px labels at ~11px and 12px annotations at ~10px. `max-width: 27.5rem`
  also stops the SVG scaling *up* past its authored size in the 720px desktop
  column. Widening the viewBox without raising the font sizes in step is how
  you silently make the phone rendering unreadable — check at 390px, don't
  assume the viewBox saved you.
- **One accent per diagram, on the arrow or block that carries the claim.**
  Everything else is hairlines, ink and the aside's surface tint, per Quiet
  Utility's "structure carried by borders and spacing rather than color or
  shadow." Accent *text* is deliberately avoided inside the drawings: accent
  text means "link" everywhere else on this site.
- **Ids are prefixed per diagram** (`stack-`, `tc-`, `cx-`, `bl-`) because
  three of the four share a single page, and `<marker>` references are
  fragment-internal — a collision would silently repaint one diagram's
  arrowheads with another's.
- **Accessibility**: each `<svg>` carries `role="img"`, a `<title>` as its
  first child and a `<desc>`, with `aria-labelledby` naming both. Labels are
  real `<text>`, never outlined paths.

### Pagefind does not index SVG text

Pagefind walks HTML and skips the whole `<svg>` subtree, so `<text>`,
`<title>` and `<desc>` inside a diagram are **not** in the search index. The
`<figcaption>` beside each diagram *is* ordinary HTML and is indexed, and it
is written to carry that diagram's claim in prose for exactly this reason.

This was measured rather than assumed: of the 55 distinct words in the
concepts page's three diagrams, 49 already appear in that page's indexed
prose, and of the 11 in the build-loop diagram, 10 do. The seven words unique
to the diagrams are `asks`, `holds`, `lost`, `oldest`, `plus`, `room` and
`re-verify` — none of which anyone would search for to find these pages, so
nothing is less findable than it was.

If that ever stops being true, the fix is
`data-pagefind-index-attrs="data-diagram-text"` plus a `data-diagram-text`
attribute on the `<figure>`; this was tested against a real build and does
get indexed. It was left out on purpose: it means a second copy of every
label that nothing keeps in sync with the first, which is the same silent
drift this file already documents for the vendored tokens.

## Known gaps / deliberate deferrals

- **`border-strong` unused.** See "Token-sync obligation" above — nothing
  here outlines an interactive control yet.
- **Unselected sidebar nav text (`--sl-color-gray-2`) isn't remapped.** The
  design spec's mapping table only calls for `--sl-color-gray-3` (which
  covers the footer/edit-link/pagination "muted" text and does read as warm
  Quiet Utility grey); the left-nav's *unselected* item text is a separate
  Starlight variable, `--sl-color-gray-2`, and is still Starlight's own cool
  grey by default. It clears contrast fine (it's not a jade/blue issue) and
  is barely perceptible next to the mapped warm greys, but it's a real,
  pre-existing gap in the mapping table, not something introduced here.
  Worth a look if the sidebar ever looks subtly "off."
- No custom domain (would change `base` to `/` and `site` accordingly — a
  one-line change, but out of scope until decided).
