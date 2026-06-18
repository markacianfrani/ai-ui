import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const TONE_OPACITY: Record<string, number> = {
  subtle: 0.08,
  default: 0.16,
  strong: 0.32,
};

/**
 * Separator/section marker.
 *
 * @slot - Optional label/content centered in divider.
 *
 * @cssprop --line-color - Divider line color.
 * @cssprop --line-width - Divider thickness.
 * @cssprop --text-color - Label text color.
 * @cssprop --label-background-color - Label background to mask line.
 * @cssprop --label-gap - Gap between line and label.
 */
@customElement("ai-divider")
export class AiDivider extends LitElement {
  /** Axis of the divider line. */
  @property({ reflect: true }) orientation: "horizontal" | "vertical" = "horizontal";
  /** Visual prominence of the divider. */
  @property({ reflect: true }) tone: "subtle" | "default" | "strong" = "default";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: flex;
      margin: 0;
      padding: 0;
      color: var(--text-color, inherit);
    }

    :host([orientation="horizontal"]) {
      flex-direction: row;
      align-items: center;
      width: 100%;
    }

    :host([orientation="vertical"]) {
      flex-direction: column;
      justify-content: center;
      height: 100%;
      align-self: stretch;
    }

    .line {
      flex: 1;
      background: var(--line-color, rgba(128, 128, 128, 0.16));
    }

    :host([orientation="horizontal"]) .line {
      height: var(--line-width, 1px);
    }

    :host([orientation="vertical"]) .line {
      width: var(--line-width, 1px);
    }

    ::slotted(*) {
      padding: 0 var(--label-gap, 0.5rem);
      white-space: nowrap;
    }

    :host([orientation="vertical"]) ::slotted(*) {
      padding: var(--label-gap, 0.5rem) 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
  `;

  override render() {
    return html`
      <span class="line" part="line-before"></span>
      <slot></slot>
      <span class="line" part="line-after"></span>
    `;
  }

  protected override updated(): void {
    const opacity = TONE_OPACITY[this.tone] ?? 0.16;
    this.style.setProperty("--line-color", `var(--line-color, rgba(128, 128, 128, ${opacity}))`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-divider": AiDivider;
  }
}
