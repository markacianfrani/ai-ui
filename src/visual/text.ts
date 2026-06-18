import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const SIZE_MAP: Record<string, string> = {
  caption: "0.75rem",
  meta: "0.8125rem",
  ui: "0.875rem",
  body: "1rem",
  title: "1.125rem",
  display: "1.375rem",
};

const WEIGHT_MAP: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * Typography primitive.
 *
 * @slot - Text/inline content.
 *
 * @cssprop --text-color - Text color.
 * @cssprop --font-family - Font family.
 * @cssprop --font-family-mono - Monospace font family.
 * @cssprop --font-size - Font size.
 * @cssprop --font-weight - Font weight.
 * @cssprop --line-height - Line height.
 * @cssprop --letter-spacing - Letter spacing.
 */
@customElement("ai-text")
export class AiText extends LitElement {
  /** Size preset. */
  @property({ reflect: true }) size: "caption" | "meta" | "ui" | "body" | "title" | "display" =
    "body";
  /** Font weight preset. */
  @property({ reflect: true }) weight: "normal" | "medium" | "semibold" | "bold" = "normal";
  /** Semantic color tone. */
  @property({ reflect: true }) tone:
    | "default"
    | "muted"
    | "accent"
    | "success"
    | "warning"
    | "error" = "default";
  /** Whether to use monospace font. */
  @property({ reflect: true, type: Boolean }) mono = false;
  /** Whether to truncate with ellipsis. */
  @property({ reflect: true, type: Boolean }) truncate = false;
  /** Whether to use inline display. */
  @property({ reflect: true, type: Boolean }) inline = false;

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: 0;
      font-size: var(--font-size, 1rem);
      font-weight: var(--font-weight, 400);
      line-height: var(--line-height, 1.5);
      letter-spacing: var(--letter-spacing, normal);
      color: var(--text-color, inherit);
    }

    :host([inline]) {
      display: inline-flex;
    }

    :host([mono]) {
      font-family: var(
        --font-family-mono,
        ui-monospace,
        "Cascadia Code",
        "Source Code Pro",
        Menlo,
        Consolas,
        "DejaVu Sans Mono",
        monospace
      );
    }

    :host(:not([mono])) {
      font-family: var(--font-family, inherit);
    }

    :host([truncate]) {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
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
    const size = SIZE_MAP[this.size] ?? "1rem";
    const weight = WEIGHT_MAP[this.weight] ?? 400;

    this.style.setProperty("--font-size", `var(--font-size, ${size})`);
    this.style.setProperty("--font-weight", `var(--font-weight, ${weight})`);

    const toneColor = this.getToneColor();
    this.style.setProperty("--text-color", `var(--text-color, ${toneColor})`);
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
    "ai-text": AiText;
  }
}
