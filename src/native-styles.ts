import { css } from "lit";

/**
 * Baseline styles for native elements within ai-* shadow roots.
 * Import and include in any ai component that renders native elements.
 */
export const nativeStyles = css`
  pre {
    margin: 0;
    max-height: 240px;
    overflow: auto;
    font-family: var(--ai-font-family-mono, monospace);
    font-size: var(--ai-font-size-caption, 0.75rem);
    white-space: pre-wrap;
  }

  a {
    color: var(--ai-color-accent, #0066cc);
    text-decoration: underline;
  }

  time {
    font-size: inherit;
  }

  button {
    cursor: pointer;
  }
`;
