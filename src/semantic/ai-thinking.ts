import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./ai-tool-call";

function summarizeThinking(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Reasoning";
  }

  const sentence = normalized.match(/.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? normalized;
  if (sentence.length <= 88) {
    return sentence;
  }
  return `${sentence.slice(0, 85).trimEnd()}…`;
}

/**
 * Specialized assistant content block for model reasoning.
 *
 * @slot - Thinking content if content property is not set.
 * @slot meta - Optional metadata.
 *
 * @fires ai-show - Emitted when disclosure opens. Bubbles, composed.
 * @fires ai-hide - Emitted when disclosure closes. Bubbles, composed.
 *
 * @cssprop --ai-thinking-color - Thinking content color.
 * @cssprop --ai-thinking-muted-color - Muted/placeholder color.
 * @cssprop --ai-thinking-max-height - Max scroll height. Default: 140px
 * @cssprop --ai-thinking-summary-color - Summary color.
 */
@customElement("ai-thinking")
export class AiThinking extends LitElement {
  /** Thinking text to render. Prefer property binding for streaming content. */
  @property({ type: String })
  content = "";

  /** Origin of the thinking block. */
  @property({ reflect: true })
  source: "model" | "assistant" | "unknown" = "unknown";

  /** Thinking exists but is not available. */
  @property({ reflect: true, type: Boolean })
  redacted = false;

  /** Whether the disclosure is expanded. */
  @property({ reflect: true, type: Boolean })
  open = false;

  /** Optional summary headline. Defaults to a first-sentence summary of content. */
  @property({ reflect: true })
  headline = "";

  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      display: block;
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      color: var(
        --ai-thinking-color,
        color-mix(in oklch, var(--text-muted, currentColor) 90%, transparent)
      );
    }

    .thinking-content {
      color: var(
        --ai-thinking-color,
        color-mix(in oklch, var(--text-muted, currentColor) 90%, transparent)
      );
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-body, 1.5);
      white-space: pre-wrap;
      word-break: break-word;
      max-height: var(--ai-thinking-max-height, 140px);
      overflow-x: auto;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .redacted {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 4px;
      color: var(--ai-thinking-muted-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-snug, 1.25);
      font-style: italic;
    }
  `;

  show(): void {
    if (this.redacted) {
      return;
    }
    this.open = true;
  }

  hide(): void {
    if (this.redacted) {
      return;
    }
    this.open = false;
  }

  toggle(force?: boolean): void {
    if (this.redacted) {
      return;
    }
    this.open = force ?? !this.open;
  }

  private handleShow() {
    if (this.redacted) {
      return;
    }
    this.open = true;
    this.dispatchEvent(
      new CustomEvent("ai-show", {
        detail: { redacted: this.redacted },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleHide() {
    if (this.redacted) {
      return;
    }
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("ai-hide", {
        detail: { redacted: this.redacted },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has("redacted") && this.redacted && this.open) {
      this.open = false;
    }
  }

  override render() {
    if (this.redacted) {
      return html`
        <div class="redacted">Reasoning redacted<slot name="meta"></slot></div>
      `;
    }

    const content = this.content.trim();
    if (!content) {
      return html`
        <slot></slot>
      `;
    }

    return html`
      <ai-tool-call
        name="Reasoning"
        .headline=${this.headline || summarizeThinking(content)}
        .open=${this.open}
        @ai-show=${this.handleShow}
        @ai-hide=${this.handleHide}
      >
        <div class="thinking-content">${content}</div>
        <slot name="meta"></slot>
      </ai-tool-call>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-thinking": AiThinking;
  }
}
