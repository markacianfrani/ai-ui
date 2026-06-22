# @cianfrani/ai-ui

## 0.1.0-alpha.3

### Patch Changes

- a6e7479: Fix implicit-undefined return in `extractFirstStructuredField`.

  The function declared a `string[] | undefined` return type but had no
  `return` statement after its loop, relying on implicit undefined return.
  This tripped TS7030 (`noImplicitReturns`) in consumers that type-check
  this package's source under stricter compiler flags. Runtime behavior is
  unchanged — the function already returned `undefined` when no structured
  field was found; the return is now explicit.

## 0.1.0-alpha.2

### Patch Changes

- b31e936: Align the event disclosure chevron with tool call chevrons.

## 0.1.0-alpha.1

### Minor Changes

- 5e0c636: Set up npm OIDC trusted publishing via GitHub Actions. Future releases
  publish automatically on merge of a Version Packages PR, with provenance
  attestation and no stored NPM_TOKEN.
