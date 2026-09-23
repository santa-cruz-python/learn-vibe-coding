# Learn Vibe Coding

An introduction to building software with AI coding agents — what the stack
actually is, how to set it up, and how to run a project from idea to something
that works.

**Live site: https://santa-cruz-python.github.io/learn-vibe-coding/**

Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). The content is plain Markdown; the
theme is a local design system called Quiet Utility.

## Running it locally

Requires Node 22 or newer.

```sh
npm install     # install dependencies
npm run dev     # dev server at http://localhost:4321/learn-vibe-coding/
npm run build   # production build into dist/
npm run preview # serve the built site, to check it the way it actually deploys
```

Note the `/learn-vibe-coding/` path in the dev URL. The site deploys to a
GitHub Pages project subpath rather than a domain root, so `base` is set
accordingly in `astro.config.mjs`. Hand-written absolute links will work in
development and 404 in production — use relative links between pages.

There is no test suite. `npm run build` is the closest thing to a correctness
check: it fails on broken frontmatter, invalid content collections, and most
invalid internal links.

## Where the content lives

```
src/content/docs/
  index.mdx                              landing page
  start-here/what-is-vibe-coding.md
  concepts/model-agent-harness-loops.mdx
  getting-set-up/choosing-your-tools.md
  building/starting-a-project.md
  building/research-plan-build-verify.mdx
```

Page order and grouping in the left sidebar are configured in
`astro.config.mjs`, not inferred from the directory structure — adding a file
does not add it to the navigation.

`outline.md` at the repository root is the original single-file draft the site
was built from. It is kept for reference and is **not** the source of truth;
the pages under `src/content/docs/` are.

### Callouts

Three kinds of aside are used throughout, written as Starlight directives:

```md
:::note[Resource Links]
:::tip[Pro Tip]
:::caution[Explore Further]{icon="open-book"}
```

The `{icon="open-book"}` is deliberate — it replaces the default warning
triangle, which reads wrong on a prompt to go read more.

### Diagrams

The four diagrams are hand-authored inline SVG in `src/components/diagrams/`,
not generated images. They use the site's design tokens rather than fixed
colors, so they render correctly in both light and dark themes from a single
source, and their labels are real text.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. Runs are visible under the repository's
Actions tab; a deploy takes about a minute.

The workflow runs install, build and upload as explicit steps rather than
through a bundled action, so a failure identifies the command that failed.

## Contributing

Corrections and suggestions are welcome — open an issue. Note that the content
is not openly licensed (see below), so please discuss substantial changes
before writing them.

## License

Copyright © 2026 Emmanuel Leroy. All rights reserved. See [LICENSE](LICENSE).

This is not open-source or openly licensed content. You may read it here, but
reproducing, translating, or building on it requires written permission.
Permission is often granted for non-commercial educational use — please ask.
