import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const GAP_MAP: Record<string, string> = {
  none: "0",
  "2xs": "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
};

const JUSTIFY_MAP: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

/**
 * Flex layout primitive.
 *
 * @slot - Stack children.
 *
 * @cssprop --gap - Overrides computed gap.
 * @cssprop --align-items - Overrides align-items.
 * @cssprop --justify-content - Overrides justify-content.
 */
@customElement("ai-stack")
export class AiStack extends LitElement {
  /** Flex direction. */
  @property({ reflect: true }) direction: "row" | "column" = "column";
  /** Gap between children. */
  @property({ reflect: true }) gap: "none" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" =
    "none";
  /** Cross-axis alignment. */
  @property({ reflect: true }) align: "start" | "center" | "end" | "stretch" | "baseline" =
    "stretch";
  /** Main-axis justification. */
  @property({ reflect: true }) justify:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly" = "start";
  /** Whether children wrap. */
  @property({ reflect: true, type: Boolean }) wrap = false;
  /** Whether to use inline-flex instead of flex. */
  @property({ reflect: true, type: Boolean }) inline = false;

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--gap, 0);
      align-items: var(--align-items, stretch);
      justify-content: var(--justify-content, flex-start);
      margin: 0;
      padding: 0;
    }

    :host([inline]) {
      display: inline-flex;
    }

    :host([direction="row"]) {
      flex-direction: row;
    }

    :host([wrap]) {
      flex-wrap: wrap;
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
    const gap = GAP_MAP[this.gap] ?? "0";
    this.style.setProperty("--gap", `var(--gap, ${gap})`);

    const alignItems = this.align;
    this.style.setProperty("--align-items", `var(--align-items, ${alignItems})`);

    const justifyContent = JUSTIFY_MAP[this.justify] ?? "flex-start";
    this.style.setProperty("--justify-content", `var(--justify-content, ${justifyContent})`);

    // force reflow — gap needs explicit value
    void this.style.direction;
    this.style.gap = `var(--gap, ${gap})`;
    this.style.alignItems = `var(--align-items, ${alignItems})`;
    this.style.justifyContent = `var(--justify-content, ${justifyContent})`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-stack": AiStack;
  }
}
