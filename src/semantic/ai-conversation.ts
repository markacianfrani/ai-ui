import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Root ordered transcript container for message-first AI conversations.
 *
 * @slot - Ordered records: ai-message, ai-tool-call, ai-tool-result, ai-thinking, ai-event, or native elements.
 *
 * @cssprop --ai-conversation-background - Conversation background. Default: transparent
 * @cssprop --ai-conversation-color - Default text color. Default: var(--ai-color-text)
 * @cssprop --ai-conversation-gap - Vertical gap between direct child records. Default: var(--ai-space-lg)
 * @cssprop --ai-conversation-compact-gap - Gap when density="compact". Default: var(--ai-space-sm)
 * @cssprop --ai-conversation-live-border-color - Optional visual marker for live conversations. Default: transparent
 */
@customElement("ai-conversation")
export class AiConversation extends LitElement {
  /** Spacing density for transcript rows. Invalid values fall back to comfortable. */
  @property({ reflect: true })
  density: "comfortable" | "compact" = "comfortable";

  /** Whether this is a live/streaming region. Adds aria-live="polite" by default. */
  @property({ type: Boolean, reflect: true })
  live = false;

  /** Accessible label for the conversation region. */
  @property({ reflect: true })
  label = "Conversation";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    .conversation {
      display: flex;
      flex-direction: column;
      gap: var(--ai-conversation-gap, var(--ai-space-lg, 16px));
      background: var(--ai-conversation-background, transparent);
      color: var(--ai-conversation-color, var(--ai-color-text, inherit));
    }

    .conversation[data-density="compact"] {
      gap: var(--ai-conversation-compact-gap, var(--ai-space-sm, 8px));
    }

    :host([live]) .conversation {
      border-left: 2px solid var(--ai-conversation-live-border-color, transparent);
    }
  `;

  private get normalizedDensity(): "comfortable" | "compact" {
    return this.density === "compact" ? "compact" : "comfortable";
  }

  override render() {
    const ariaLive = this.live ? "polite" : "off";
    return html`
      <section
        class="conversation"
        data-density=${this.normalizedDensity}
        aria-label=${this.getAttribute("aria-label") ?? this.label}
        aria-live=${ariaLive}
        aria-relevant="additions text"
      >
        <slot></slot>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-conversation": AiConversation;
  }
}
