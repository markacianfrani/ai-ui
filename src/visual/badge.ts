import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Compact semantic label/status chip.
 *
 * @slot - Badge label.
 *
 * @cssprop --background-color - Badge background.
 * @cssprop --text-color - Badge text color.
 * @cssprop --border-color - Badge border color.
 * @cssprop --border-radius - Badge radius.
 * @cssprop --dot-color - Leading dot color.
 * @cssprop --font-size - Font size.
 * @cssprop --font-weight - Font weight. Default: 600
 * @cssprop --inline-gap - Gap between dot/content.
 */
@customElement("ai-badge")
export class AiBadge extends LitElement {
  /** Semantic color tone. */
  @property({ reflect: true }) tone:
    | "neutral"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info" = "neutral";
  /** Size preset. */
  @property({ reflect: true }) size: "sm" | "md" = "md";
  /** Whether to show a leading dot indicator. */
  @property({ reflect: true, type: Boolean }) dot = false;

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--inline-gap, 4px);
      margin: 0;
      padding: var(--_padding, 3px 8px);
      font-size: var(--font-size, 0.75rem);
      font-weight: var(--font-weight, 600);
      line-height: 1;
      color: var(--text-color, inherit);
      background: var(--background-color, rgba(128, 128, 128, 0.1));
      border: 1px solid var(--border-color, transparent);
      border-radius: var(--border-radius, 999px);
      white-space: nowrap;
    }

    :host([size="sm"]) {
      --_padding: 2px 6px;
    }

    :host([size="md"]) {
      --_padding: 3px 8px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--dot-color, var(--text-color, inherit));
      flex-shrink: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
  `;

  override render() {
    return html`
      ${
        this.dot
          ? html`
              <span class="dot" part="dot"></span>
            `
          : ""
      }
      <slot></slot>
    `;
  }

  protected override updated(): void {
    const colors = this.getToneColors();
    this.style.setProperty("--background-color", `var(--background-color, ${colors.bg})`);
    this.style.setProperty("--text-color", `var(--text-color, ${colors.text})`);
    this.style.setProperty("--border-color", `var(--border-color, ${colors.border})`);
    this.style.setProperty("--dot-color", `var(--dot-color, ${colors.text})`);
  }

  private getToneColors(): { bg: string; text: string; border: string } {
    switch (this.tone) {
      case "accent":
        return {
          bg: "rgba(74, 144, 217, 0.12)",
          text: "var(--ai-color-accent, #4a90d9)",
          border: "rgba(74, 144, 217, 0.2)",
        };
      case "success":
        return {
          bg: "rgba(46, 160, 67, 0.12)",
          text: "var(--ai-color-success, #2ea043)",
          border: "rgba(46, 160, 67, 0.2)",
        };
      case "warning":
        return {
          bg: "rgba(210, 153, 34, 0.12)",
          text: "var(--ai-color-warning, #d29922)",
          border: "rgba(210, 153, 34, 0.2)",
        };
      case "error":
        return {
          bg: "rgba(227, 62, 51, 0.12)",
          text: "var(--ai-color-error, #e33e33)",
          border: "rgba(227, 62, 51, 0.2)",
        };
      case "info":
        return {
          bg: "rgba(80, 160, 220, 0.12)",
          text: "var(--ai-color-info, #50a0dc)",
          border: "rgba(80, 160, 220, 0.2)",
        };
      default:
        return {
          bg: "rgba(128, 128, 128, 0.1)",
          text: "inherit",
          border: "rgba(128, 128, 128, 0.15)",
        };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-badge": AiBadge;
  }
}
