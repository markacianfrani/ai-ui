import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type AiMessageRole = "user" | "assistant" | "system" | "tool";
export type AiMessageStatus = "pending" | "running" | "success" | "error" | "cancelled" | "unknown";

/**
 * Message-first transcript record with role-specific pi-ui presentation.
 *
 * @slot - Content blocks, usually ai-markdown, ai-thinking, ai-tool-call, ai-tool-result, or ai-event.
 * @slot meta - Timestamp, model, or other metadata. Prefer native <time>.
 * @slot avatar - Optional actor avatar.
 * @slot actor - Optional actor label.
 *
 * @cssprop --ai-message-background - Message body background. Default: transparent
 * @cssprop --ai-message-color - Message text color. Default: inherit
 * @cssprop --ai-message-border-color - Optional message border color. Default: transparent
 * @cssprop --ai-message-border-width - Optional border width. Default: 0
 * @cssprop --ai-message-radius - Optional message radius. Default: 0
 * @cssprop --ai-message-gap - Gap between slotted content blocks. Default: var(--spacing-xs)
 * @cssprop --ai-message-user-background - User bubble background. Default: var(--accent)
 * @cssprop --ai-message-user-color - User bubble color. Default: var(--text-on-accent)
 * @cssprop --ai-message-user-max-width - User bubble max width. Default: min(90%, 640px)
 * @cssprop --ai-message-assistant-rail-color - Assistant rail color.
 * @cssprop --ai-message-assistant-label-color - Assistant label color. Default: var(--text-muted)
 * @cssprop --ai-message-meta-color - Meta text color. Default: var(--text-muted)
 */
@customElement("ai-message")
export class AiMessage extends LitElement {
  /** Message author/source role. Unknown values render as system-style rows. */
  @property({ reflect: true })
  override role: "user" | "assistant" | "system" | "tool" = "assistant";

  /** Optional associated record id; maps to native `for` attribute. */
  @property({ reflect: true, attribute: "for" })
  htmlFor = "";

  /** Message lifecycle status. */
  @property({ reflect: true })
  status: "pending" | "running" | "success" | "error" | "cancelled" | "unknown" = "unknown";

  /** ISO-ish timestamp for metadata/association; visual formatting is left to slotted meta. */
  @property({ reflect: true })
  timestamp = "";

  /** Display label for role chrome. */
  @property({ reflect: true })
  label = "";

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: 0;
      max-width: 100%;
      min-width: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    .message {
      display: flex;
      flex-direction: column;
      min-width: 0;
      max-width: 100%;
      background-color: var(--ai-message-background, transparent);
      color: var(--ai-message-color, inherit);
      border: var(--ai-message-border-width, 0) solid var(--ai-message-border-color, transparent);
      border-radius: var(--ai-message-radius, 0);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--ai-message-gap, 3px);
      min-width: 0;
      max-width: 100%;
    }

    .content ::slotted(*) {
      min-width: 0;
      max-width: 100%;
    }

    ::slotted([slot="meta"]) {
      color: var(--ai-message-meta-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-size: var(--font-size-caption, var(--ai-font-size-caption, 0.75rem));
      line-height: var(--line-height-tight, var(--ai-line-height-tight, 1.1));
    }

    .meta-fallback {
      color: var(--ai-message-meta-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-size: var(--font-size-caption, var(--ai-font-size-caption, 0.75rem));
      line-height: var(--line-height-tight, var(--ai-line-height-tight, 1.1));
    }

    /* User bubble treatment. */
    :host([role="user"]) .message {
      align-items: flex-end;
      gap: calc(var(--spacing-xs, 4px) / 2);
    }

    :host([role="user"]) .content {
      width: auto;
      max-width: var(--ai-message-user-max-width, min(90%, 640px));
      padding: var(--spacing-sm, 8px) var(--spacing-md, 12px);
      background: var(--ai-message-user-background, var(--accent, Highlight));
      color: var(--ai-message-user-color, var(--text-on-accent, HighlightText));
      border-radius: var(
        --ai-message-radius,
        var(--radius, 8px) var(--radius, 8px) 4px var(--radius, 8px)
      );
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      overflow-wrap: anywhere;
    }

    /* Assistant rail/header treatment. */
    :host([role="assistant"]) .message {
      align-items: stretch;
      gap: 2px;
      width: 100%;
    }

    .header {
      display: none;
    }

    :host([role="assistant"]) .header {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm, 8px);
      padding-left: calc(var(--spacing-md, 12px) + 2px);
      line-height: var(--line-height-tight, 1.1);
    }

    .actor-label {
      color: var(--ai-message-assistant-label-color, var(--text-muted, #888));
      font-size: var(--font-size-caption, 0.75rem);
      font-weight: var(--font-weight-bold, 700);
      letter-spacing: var(--tracking-overline, 0.08em);
      line-height: var(--line-height-tight, 1.1);
      text-transform: uppercase;
    }

    :host([role="assistant"]) .content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      padding-left: calc(var(--spacing-md, 12px) + 2px);
      border-left: 1px solid var(--ai-message-assistant-rail-color, rgba(255, 255, 255, 0.08));
      background: transparent;
      color: var(--ai-message-color, var(--text, inherit));
    }

    :host([role="tool"]) .message,
    :host([role="system"]) .message {
      gap: var(--ai-message-gap, 3px);
      color: var(--ai-message-color, var(--text, inherit));
    }

    :host([role="tool"]) .content {
      width: 100%;
    }

    :host([role="system"]) .content {
      color: color-mix(in oklch, var(--text-muted, currentColor) 92%, transparent);
      font-size: var(--font-size-meta, 0.8125rem);
    }

    @media (max-width: 420px) {
      :host([role="assistant"]) .header,
      :host([role="assistant"]) .content {
        padding-left: calc(var(--spacing-sm, 8px) + 2px);
      }
    }
  `;

  private get normalizedRole(): AiMessageRole {
    if (
      this.role === "user" ||
      this.role === "assistant" ||
      this.role === "system" ||
      this.role === "tool"
    ) {
      return this.role;
    }
    return "system";
  }

  private get actorLabel(): string {
    return this.label || (this.normalizedRole === "assistant" ? "Assistant" : this.normalizedRole);
  }

  override render() {
    const role = this.normalizedRole;
    return html`
      <article class="message" data-role=${role} aria-busy=${this.status === "running"}>
        ${
          role === "assistant"
            ? html`
              <div class="header">
                <slot name="avatar"></slot>
                <slot name="actor"><span class="actor-label">${this.actorLabel}</span></slot>
                <slot name="meta"></slot>
              </div>
            `
            : nothing
        }
        <div class="content">
          <slot></slot>
        </div>
        ${
          role !== "assistant"
            ? html`
                <slot name="meta"></slot>
              `
            : nothing
        }
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-message": AiMessage;
  }
}
