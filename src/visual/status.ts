import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const SIZE_MAP: Record<string, string> = {
  xs: "6px",
  sm: "8px",
  md: "12px",
  lg: "16px",
};

/**
 * Status dot/icon indicator.
 *
 * @slot - Optional custom icon/content.
 *
 * @cssprop --size - Indicator size.
 * @cssprop --color - Indicator color.
 * @cssprop --idle-color - Idle color.
 * @cssprop --running-color - Running color.
 * @cssprop --success-color - Success color.
 * @cssprop --error-color - Error color.
 * @cssprop --cancelled-color - Cancelled color.
 * @cssprop --pulse-duration - Running pulse duration. Default: 1.5s
 */
@customElement("ai-status")
export class AiStatus extends LitElement {
  /** Current status state. */
  @property({ reflect: true }) state:
    | "idle"
    | "running"
    | "success"
    | "error"
    | "cancelled"
    | "unknown" = "unknown";
  /** Size preset. */
  @property({ reflect: true }) size: "xs" | "sm" | "md" | "lg" = "md";
  /** Display variant — dot or icon. */
  @property({ reflect: true }) variant: "dot" | "icon" = "dot";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      color: var(--color, var(--ai-color-text-muted, rgba(128, 128, 128, 0.7)));
    }

    .dot {
      width: var(--size, 12px);
      height: var(--size, 12px);
      border-radius: 50%;
      background: var(--color, var(--ai-color-text-muted, rgba(128, 128, 128, 0.7)));
      flex-shrink: 0;
    }

    :host([state="running"]) .dot {
      animation: pulse var(--pulse-duration, 1.5s) ease-in-out infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.7;
      }
    }

    .icon-wrapper {
      width: var(--size, 12px);
      height: var(--size, 12px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .fallback-icon {
      width: 100%;
      height: 100%;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
  `;

  override render() {
    if (this.variant === "icon") {
      return html`
        <span class="icon-wrapper" part="icon">
          <slot>
            <svg class="fallback-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              ${this.getFallbackIconPath()}
            </svg>
          </slot>
        </span>
      `;
    }

    return html`
      <span class="dot" part="dot"></span>
    `;
  }

  protected override updated(): void {
    const size = SIZE_MAP[this.size] ?? "12px";
    this.style.setProperty("--size", `var(--size, ${size})`);

    const stateColor = this.getStateColor();
    this.style.setProperty("--color", `var(--color, ${stateColor})`);
  }

  private getStateColor(): string {
    switch (this.state) {
      case "idle":
        return "var(--idle-color, var(--ai-color-text-muted, rgba(128, 128, 128, 0.4)))";
      case "running":
        return "var(--running-color, var(--ai-color-accent, #4a90d9))";
      case "success":
        return "var(--success-color, var(--ai-color-success, #2ea043))";
      case "error":
        return "var(--error-color, var(--ai-color-error, #e33e33))";
      case "cancelled":
        return "var(--cancelled-color, var(--ai-color-text-muted, rgba(128, 128, 128, 0.5)))";
      default:
        return "var(--ai-color-text-muted, rgba(128, 128, 128, 0.7))";
    }
  }

  private getFallbackIconPath(): string {
    switch (this.state) {
      case "success":
        return html`
          <path
            d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
          />
        `.strings.join("");
      case "error":
        return html`
          <path
            d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
          />
        `.strings.join("");
      case "running":
        return html`
          <path
            d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9-3.25v2.5h2.5a.75.75 0 010 1.5H9v2.5a.75.75 0 01-1.5 0v-2.5H5a.75.75 0 010-1.5h2.5v-2.5a.75.75 0 011.5 0z"
          />
        `.strings.join("");
      default:
        return html`
          <circle cx="8" cy="8" r="4" />
        `.strings.join("");
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-status": AiStatus;
  }
}
