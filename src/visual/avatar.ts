import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const SIZE_MAP: Record<string, string> = {
  sm: "1.5rem",
  md: "2rem",
  lg: "2.5rem",
};

const FONT_SIZE_MAP: Record<string, string> = {
  sm: "0.625rem",
  md: "0.75rem",
  lg: "0.875rem",
};

/**
 * Actor/agent identity marker.
 *
 * @slot - Custom avatar content/icon.
 *
 * @cssprop --size - Avatar width/height.
 * @cssprop --background-color - Fallback background.
 * @cssprop --text-color - Initials/icon color.
 * @cssprop --border-color - Border color.
 * @cssprop --border-radius - Avatar radius.
 * @cssprop --font-size - Initials font size.
 * @cssprop --font-weight - Initials font weight. Default: 700
 */
@customElement("ai-avatar")
export class AiAvatar extends LitElement {
  /** Image source URL. When set, renders an <img>. */
  @property({ reflect: true }) src = "";
  /** Display name. Used for initials fallback and img alt text. */
  @property({ reflect: true }) name = "";
  /** Size preset. */
  @property({ reflect: true }) size: "sm" | "md" | "lg" = "md";
  /** Semantic color tone. */
  @property({ reflect: true }) tone: "neutral" | "accent" | "user" | "assistant" | "agent" =
    "neutral";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size, 2rem);
      height: var(--size, 2rem);
      border-radius: var(--border-radius, 50%);
      background: var(--background-color, rgba(128, 128, 128, 0.15));
      color: var(--text-color, inherit);
      border: 1px solid var(--border-color, transparent);
      overflow: hidden;
      flex-shrink: 0;
      margin: 0;
      padding: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .initials {
      font-size: var(--font-size, 0.75rem);
      font-weight: var(--font-weight, 700);
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      user-select: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }
  `;

  override render() {
    if (this.src) {
      return html`<img src="${this.src}" alt="${this.name || ""}" part="image" />`;
    }

    const initials = this.getInitials();
    if (initials) {
      return html`<span class="initials" part="initials">${initials}</span>`;
    }

    return html`
      <slot></slot>
    `;
  }

  protected override updated(): void {
    const size = SIZE_MAP[this.size] ?? "2rem";
    const fontSize = FONT_SIZE_MAP[this.size] ?? "0.75rem";

    this.style.setProperty("--size", `var(--size, ${size})`);
    this.style.setProperty("--font-size", `var(--font-size, ${fontSize})`);

    const toneColors = this.getToneColors();
    this.style.setProperty("--background-color", `var(--background-color, ${toneColors.bg})`);
    this.style.setProperty("--text-color", `var(--text-color, ${toneColors.text})`);
    this.style.setProperty("--border-color", `var(--border-color, ${toneColors.border})`);
  }

  private getInitials(): string {
    if (!this.name) {
      return "";
    }
    const words = this.name.trim().split(/\s+/);
    if (words.length >= 2) {
      const first = words[0]?.[0] ?? "";
      const last = words[words.length - 1]?.[0] ?? "";
      return (first + last).toUpperCase();
    }
    return (words[0]?.[0] ?? "").toUpperCase();
  }

  private getToneColors(): { bg: string; text: string; border: string } {
    switch (this.tone) {
      case "accent":
        return {
          bg: "rgba(74, 144, 217, 0.15)",
          text: "var(--ai-color-accent, #4a90d9)",
          border: "rgba(74, 144, 217, 0.25)",
        };
      case "user":
        return {
          bg: "rgba(74, 144, 217, 0.12)",
          text: "var(--ai-color-accent, #4a90d9)",
          border: "rgba(74, 144, 217, 0.2)",
        };
      case "assistant":
        return {
          bg: "rgba(128, 128, 128, 0.12)",
          text: "var(--ai-color-text-muted, rgba(128, 128, 128, 0.8))",
          border: "rgba(128, 128, 128, 0.2)",
        };
      case "agent":
        return {
          bg: "rgba(46, 160, 67, 0.12)",
          text: "var(--ai-color-success, #2ea043)",
          border: "rgba(46, 160, 67, 0.2)",
        };
      default:
        return {
          bg: "rgba(128, 128, 128, 0.15)",
          text: "inherit",
          border: "transparent",
        };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-avatar": AiAvatar;
  }
}
