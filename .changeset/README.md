# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to manage
versions and releases. High-level flow:

1. **Make a change.** While working on something user-facing, run
   `bun run changeset` and answer the prompts. This writes a new markdown file
   into this folder describing the change and its bump level (major / minor /
   patch). Commit it alongside your code.

2. **Release.** When changesets are merged to `main`, CI opens a
   "Version Packages" PR that consumes them, bumps the version, and updates the
   changelog. Merge that PR and CI publishes to npm automatically.

> Pre-release note: while on the `0.1.0` alpha line, prerelease mode is on
> (`bun run changeset pre enter alpha`). Bumps land as `0.1.0-alpha.N`. Run
> `bun run changeset pre exit alpha` when stabilizing toward `0.1`.
