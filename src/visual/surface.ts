import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const RADIUS_MAP: Record<string, string> = {
  none: "0",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  pill: "999px",
};

/**
 * Themed container/surface.
 *
 * @slot - Surface content.
 *
 * @cssprop --background-color - Surface background.
 * @cssprop --text-color - Surface text color.
 * @cssprop --border-color - Border color.
 * @cssprop --border-width - Border width.
 * @cssprop --border-radius - Border radius.
 * @cssprop --shadow - Box shadow.
 * @cssprop --hover-background-color - Hover background when interactive.
 * @cssprop --focus-ring - Focus ring for slotted/native focus styling.
 */
@customElement("ai-surface")
export class AiSurface extends LitElement {
  /** Visual variant. */
  @property({ reflect: true }) variant: "flat" | "outlined" | "raised" | "sunken" = "flat";
  /** Semantic color tone. */
  @property({ reflect: true }) tone:
    | "neutral"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info" = "neutral";
  /** Border radius preset. */
  @property({ reflect: true }) radius: "none" | "sm" | "md" | "lg" | "pill" = "md";
  /** Whether the surface is clickable/hoverable. */
  @property({ reflect: true, type: Boolean }) interactive = false;

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: 0;
      border-radius: var(--border-radius, 0.625rem);
      background: var(--background-color, transparent);
      color: var(--text-color, inherit);
    }

    :host([variant="outlined"]) {
      border: var(--border-width, 1px) solid
        var(--border-color, var(--ai-color-border, rgba(128, 128, 128, 0.2)));
    }

    :host([variant="raised"]) {
      box-shadow: var(--shadow, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08));
    }

    :host([variant="sunken"]) {
      box-shadow: var(--shadow, inset 0 1px 3px rgba(0, 0, 0, 0.12));
    }

    :host([interactive]) {
      cursor: pointer;
      transition: background 0.15s ease;
    }

    :host([interactive]:hover) {
      background: var(--hover-background-color, var(--background-color, rgba(128, 128, 128, 0.05)));
    }

    :host([interactive]:focus-visible) {
      outline: var(--focus-ring, 2px solid var(--ai-color-accent, #4a90d9));
      outline-offset: 2px;
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
    const radius = RADIUS_MAP[this.radius] ?? "0.625rem";
    this.style.setProperty("--border-radius", `var(--border-radius, ${radius})`);

    const toneColors = this.getToneColors();
    this.style.setProperty("--background-color", `var(--background-color, ${toneColors.bg})`);
    this.style.setProperty("--text-color", `var(--text-color, ${toneColors.text})`);
    this.style.setProperty("--border-color", `var(--border-color, ${toneColors.border})`);
  }

  private getToneColors(): { bg: string; text: string; border: string } {
    switch (this.tone) {
      case "accent":
        return {
          bg: "rgba(74, 144, 217, 0.1)",
          text: "var(--ai-color-accent, #4a90d9)",
          border: "rgba(74, 144, 217, 0.3)",
        };
      case "success":
        return {
          bg: "rgba(46, 160, 67, 0.1)",
          text: "var(--ai-color-success, #2ea043)",
          border: "rgba(46, 160, 67, 0.3)",
        };
      case "warning":
        return {
          bg: "rgba(210, 153, 34, 0.1)",
          text: "var(--ai-color-warning, #d29922)",
          border: "rgba(210, 153, 34, 0.3)",
        };
      case "error":
        return {
          bg: "rgba(227, 62, 51, 0.1)",
          text: "var(--ai-color-error, #e33e33)",
          border: "rgba(227, 62, 51, 0.3)",
        };
      case "info":
        return {
          bg: "rgba(80, 160, 220, 0.1)",
          text: "var(--ai-color-info, #50a0dc)",
          border: "rgba(80, 160, 220, 0.3)",
        };
      default:
        return {
          bg: "transparent",
          text: "inherit",
          border: "var(--ai-color-border, rgba(128, 128, 128, 0.2))",
        };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-surface": AiSurface;
  }
}
