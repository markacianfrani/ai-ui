import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const SIZE_MAP: Record<string, string> = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
};

/**
 * Consistent icon sizing/tone wrapper.
 *
 * @slot - SVG/icon content.
 *
 * @cssprop --size - Icon width/height.
 * @cssprop --color - Icon color.
 */
@customElement("ai-icon")
export class AiIcon extends LitElement {
  /** Size preset. */
  @property({ reflect: true }) size: "xs" | "sm" | "md" | "lg" = "md";
  /** Semantic color tone. */
  @property({ reflect: true }) tone:
    | "default"
    | "muted"
    | "accent"
    | "success"
    | "warning"
    | "error" = "default";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size, 16px);
      height: var(--size, 16px);
      color: var(--color, inherit);
      margin: 0;
      padding: 0;
    }

    ::slotted(*) {
      width: 100%;
      height: 100%;
    }

    ::slotted(svg) {
      fill: currentColor;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
  `;

  override render() {
    return html`
      <slot></slot>
    `;
  }

  protected override updated(): void {
    const size = SIZE_MAP[this.size] ?? "16px";
    this.style.setProperty("--size", `var(--size, ${size})`);

    const toneColor = this.getToneColor();
    this.style.setProperty("--color", `var(--color, ${toneColor})`);
  }

  private getToneColor(): string {
    switch (this.tone) {
      case "muted":
        return "var(--ai-color-text-muted, rgba(128, 128, 128, 0.7))";
      case "accent":
        return "var(--ai-color-accent, #4a90d9)";
      case "success":
        return "var(--ai-color-success, #2ea043)";
      case "warning":
        return "var(--ai-color-warning, #d29922)";
      case "error":
        return "var(--ai-color-error, #e33e33)";
      default:
        return "inherit";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-icon": AiIcon;
  }
}
