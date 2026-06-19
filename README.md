# @cianfrani/ai-ui

AI conversation web components for rendering agent transcripts — messages, tool
calls, tool results, reasoning, and events — built with [Lit](https://lit.dev).

Framework-agnostic standard custom elements. Works in any frontend (Lit, React,
Vue, Svelte, plain HTML). Every component renders correctly with **zero host
CSS** thanks to built-in token fallbacks; skin it to match your product by
overriding the `--ai-*` design tokens.

> **Status: v0 alpha.** The component API and token names are still settling.
> Expect breaking changes before `0.1`. Not recommended for production use yet.

## Install

```sh
npm install @cianfrani/ai-ui
# peer: lit ^3
```

## Quick start

```ts
import "@cianfrani/ai-ui";
import { html, render } from "lit";
```

```html
<ai-conversation label="Chat transcript" live>
  <ai-message role="user" timestamp="2026-06-19T09:00:00Z">
    <ai-markdown tone="user" .content=${"Ship it."></ai-markdown>
  </ai-message>

  <ai-message role="assistant" timestamp="2026-06-19T09:00:02Z">
    <ai-markdown .content=${"Running the tests…"></ai-markdown>
    <ai-tool-call id="t1" name="bash" status="running" headline="bun test src/">
      <pre slot="input">bun test src/</pre>
      <ai-tool-result for="t1" name="bash" status="success" .content=${"12 pass"></ai-tool-result>
    </ai-tool-call>
  </ai-message>
</ai-conversation>
```

## Components

**Semantic transcript primitives**
- `ai-conversation` — ordered root container; `density`, `live`, accessible label.
- `ai-message` — message with `role="user|assistant|system|tool"`, `status`, `timestamp`, `label`; `default` / `meta` / `avatar` slots.
- `ai-tool-call` — collapsible tool-call block with input / summary slots and `ai-show` / `ai-hide` events.
- `ai-tool-result` — tool output block with `for` association and channel / status metadata.
- `ai-thinking` — reasoning block with compact disclosure.
- `ai-event` — compact status / checkpoint / system / error event.

**Visual atoms** — `ai-markdown` (markdown renderer with `tone="assistant|user|system|tool"`), `ai-stack`, `ai-surface`, `ai-text`, `ai-badge`, `ai-status`, `ai-avatar`, `ai-icon`, `ai-divider`.

Full API docs are generated as a [custom elements manifest](./src/custom-elements.json)
(`customElements` field). Point your tooling (Storybook, IDE plugins) at it.

## Theming

Every style reads from `--ai-*` CSS custom properties, and each token falls back
to a built-in default so the components render reasonably with **zero host CSS**.
To skin the library, override these tokens on `:root` (or any ancestor). The
block below is a **starter palette** you can adapt — it is not a mirror of the
internal defaults (those vary per component and are documented via `@cssprop`
in source):

```css
:root {
  /* Color */
  --ai-color-text: #f5f5f4;
  --ai-color-text-muted: #a8a29e;
  --ai-color-accent: #f97316;
  --ai-color-border: rgba(255, 255, 255, 0.1);
  --ai-color-success: #22c55e;
  --ai-color-warning: #f59e0b;
  --ai-color-error: #ef4444;
  --ai-color-info: #3b82f6;

  /* Spacing & radius */
  --ai-space-xs: 0.25rem;
  --ai-space-sm: 0.5rem;
  --ai-space-md: 0.75rem;
  --ai-space-lg: 1rem;
  --ai-radius: 8px;

  /* Typography */
  --ai-font-family-mono: ui-monospace, monospace;
  --ai-font-size-caption: 0.75rem;
  --ai-font-size-meta: 0.8125rem;
  --ai-font-size-body: 0.875rem;
}
```

Each component also exposes component-local tokens (e.g.
`--ai-message-user-background`, `--ai-tool-call-border-color`,
`--ai-markdown-link-color`) for fine-grained control. See each component's
`@cssprop` docs in source.

## Framework notes

These are standard custom elements, so they work everywhere, but note:

- **Properties with`.`prefix** (`.content`, `.for`) must be set from JS, not as
  HTML attributes. In React this means `ref`-based assignment or a wrapper; Lit
  and Vue handle them natively.
- **`sideEffects: true`** — importing the package registers the custom elements.

## Develop

```sh
bun install
bun test          # unit tests
bun run analyze   # regenerate custom-elements.json
bun run build     # build dist/ai-ui.js bundle + dist/types/*.d.ts (shipped to npm)
```

## Releasing

Releases are automated with [Changesets](https://github.com/changesets/changesets).
Add a changeset describing your change, then merge the auto-opened "Version
Packages" PR to cut a release to npm.

```sh
bun run changeset   # describe a change (major/minor/patch)
bun run version     # consume changesets, bump versions + changelog
bun run release     # publish to npm (run by CI)
```

**First release.** The release workflow (`.github/workflows/release.yml`) only
publishes when a "Version Packages" PR is merged. The first push to the new
repo's `main` ships nothing until you add a changeset and merge its version PR,
or bootstrap the registry once:

```sh
npm publish --tag alpha   # one-time, before relying on CI
```

The alpha-line prerelease flow (`changeset pre enter/exit alpha`) is documented
in [`.changeset/README.md`](./.changeset/README.md).

## License

[MIT](./LICENSE)
