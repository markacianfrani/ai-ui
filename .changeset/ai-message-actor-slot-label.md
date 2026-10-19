---
"@cianfrani/ai-ui": minor
---

Remove the built-in "Assistant" label from ai-message. The label attribute is gone; supply a label via the existing `actor` slot instead (slotted content inherits the overline label styling via `--ai-message-assistant-label-color`).
