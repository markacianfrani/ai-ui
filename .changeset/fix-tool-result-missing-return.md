---
"@cianfrani/ai-ui": patch
---

Fix implicit-undefined return in `extractFirstStructuredField`.

The function declared a `string[] | undefined` return type but had no
`return` statement after its loop, relying on implicit undefined return.
This tripped TS7030 (`noImplicitReturns`) in consumers that type-check
this package's source under stricter compiler flags. Runtime behavior is
unchanged — the function already returned `undefined` when no structured
field was found; the return is now explicit.
