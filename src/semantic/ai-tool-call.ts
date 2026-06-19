import { LitElement, css, html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getToolTone } from "../lib/tool-tone";
import { HasSlotController } from "../lib/has-slot-controller";
import type { AiShowHideDetail } from "./ai-event";

export type ToolCallKind =
  | "tool"
  | "shell"
  | "file"
  | "search"
  | "delegate"
  | "network"
  | "custom"
  | "unknown";

export type ToolCallEffect = "read" | "write" | "mixed" | "unknown";

export type ToolCallStatus = "pending" | "running" | "success" | "error" | "cancelled" | "unknown";

function renderGlyph(tone: ReturnType<typeof getToolTone>) {
  switch (tone) {
    case "read":
      return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h12"></path><path d="M14 3v6h6"></path><path d="M8 13h8"></path><path d="M8 17h5"></path><path d="M14 3l6 6v10a2 2 0 0 1-2 2H6"></path></svg>`;
    case "write":
      return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;
    case "edit":
      return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M4 13.5V20h6.5L19 11.5 12.5 5 4 13.5Z"></path></svg>`;
    case "bash":
      return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 17 6-5-6-5"></path><path d="M12 19h8"></path></svg>`;
    default:
      return nothing;
  }
}

/**
 * Specialized assistant content block for a tool call.
 *
 * @slot summary - Custom summary row/header
 * @slot input - Tool input/arguments; native <pre><code> is recommended.
 * @slot - Result/details content, commonly nested ai-tool-result.
 *
 * @fires ai-show - Emitted when disclosure opens. Bubbles, composed.
 * @fires ai-hide - Emitted when disclosure closes. Bubbles, composed.
 *
 * @cssprop --ai-tool-call-background - Tool call background.
 * @cssprop --ai-tool-call-color - Tool call text color.
 * @cssprop --ai-tool-call-border-color - Tool call border color.
 * @cssprop --ai-tool-call-summary-background - Summary row background.
 * @cssprop --ai-tool-call-input-background - Input slot background.
 * @cssprop --ai-tool-call-status-color - Generic status color.
 * @cssprop --ai-tool-call-success-color - Success status color.
 * @cssprop --ai-tool-call-error-color - Error status color.
 * @cssprop --ai-tool-call-running-color - Running status color.
 */
@customElement("ai-tool-call")
export class AiToolCall extends LitElement {
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
      color: var(--ai-tool-call-color, var(--text, var(--ai-color-text, inherit)));
    }

    .row {
      --accent: color-mix(
        in oklch,
        var(--ai-tool-call-status-color, var(--text-muted, var(--ai-color-text-muted, #888))) 82%,
        var(--ai-tool-call-border-color, var(--border, var(--ai-color-border, #333)))
      );
      --surface-hover: color-mix(in oklch, var(--accent) 8%, transparent);
      --surface-open: color-mix(in oklch, var(--accent) 5%, transparent);
      display: block;
      min-width: 0;
      max-width: 100%;
      background: var(--ai-tool-call-background, var(--background-color, transparent));
      color: inherit;
    }

    .row[data-tone="read"] {
      --accent: oklch(74% 0.12 190);
    }
    .row[data-tone="write"] {
      --accent: oklch(78% 0.15 145);
    }
    .row[data-tone="edit"] {
      --accent: oklch(76% 0.17 85);
    }
    .row[data-tone="bash"] {
      --accent: oklch(68% 0.19 25);
    }

    .row[data-status="success"] {
      --accent: var(
        --ai-tool-call-success-color,
        var(--success-color, var(--success, var(--ai-color-success, #16a34a)))
      );
    }

    .row[data-status="running"],
    .row[data-status="pending"] {
      --accent: var(
        --ai-tool-call-running-color,
        var(--running-color, var(--accent, var(--ai-color-accent, Highlight)))
      );
    }

    .row[data-status="error"] {
      --accent: var(
        --ai-tool-call-error-color,
        var(--error-color, var(--error, var(--ai-color-error, #dc2626)))
      );
      --surface-hover: color-mix(in oklch, var(--accent) 10%, transparent);
      --surface-open: color-mix(in oklch, var(--accent) 7%, transparent);
    }

    .row-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: calc(var(--spacing-xs, 4px) + 2px);
      padding: 2px 4px;
      background: var(
        --ai-tool-call-summary-background,
        var(--summary-background-color, transparent)
      );
      list-style: none;
    }

    .row-header[interactive] {
      cursor: pointer;
      transition: background 0.16s ease;
    }

    .row-header[interactive]:hover {
      background: var(--surface-hover);
    }

    .row-header[interactive]:focus-visible {
      outline: 2px solid var(--focus, Highlight);
      outline-offset: 2px;
    }

    details[open] > .row-header {
      background: var(--surface-open);
    }

    summary.row-header::marker,
    summary.row-header::-webkit-details-marker {
      display: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .icon-frame {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      color: color-mix(in oklch, var(--accent) 62%, var(--text-muted, currentColor));
    }

    .icon-frame svg {
      width: 12.5px;
      height: 12.5px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .reasoning-dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: currentColor;
      opacity: 0.72;
    }

    .text-block {
      display: grid;
      gap: 1px;
      min-width: 0;
      padding-block: 1px;
    }

    .headline {
      display: flex;
      align-items: baseline;
      gap: 6px;
      flex-wrap: wrap;
      min-width: 0;
    }

    .badge {
      flex-shrink: 0;
      font-size: var(--font-size-caption, 0.75rem);
      font-weight: var(--font-weight-semibold, 600);
      line-height: var(--line-height-tight, 1.1);
      letter-spacing: var(--tracking-label, 0.04em);
      color: color-mix(in oklch, var(--accent) 52%, var(--text-muted, currentColor));
    }

    .headline-text {
      min-width: 0;
      font-size: var(--font-size-meta, 0.8125rem);
      line-height: var(--line-height-snug, 1.25);
      color: color-mix(in oklch, var(--text, currentColor) 88%, var(--text-muted, currentColor));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .subline {
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-snug, 1.25);
      color: color-mix(in oklch, var(--text-muted, currentColor) 92%, transparent);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .row[data-tone="generic"] .badge {
      color: color-mix(in oklch, var(--text-muted, currentColor) 92%, transparent);
    }

    .row[data-tone="generic"] .headline-text {
      color: color-mix(in oklch, var(--text, currentColor) 78%, var(--text-muted, currentColor));
    }

    .row[data-tone="read"] .headline-text {
      white-space: nowrap;
      display: block;
      -webkit-line-clamp: unset;
    }

    .chevron {
      width: 8px;
      height: 8px;
      flex-shrink: 0;
      color: color-mix(in oklch, var(--text-muted, currentColor) 88%, transparent);
      transition: transform 0.16s ease;
    }

    details[open] .chevron {
      transform: rotate(90deg);
    }

    .body {
      padding: 1px 4px calc(var(--spacing-xs, 4px) + 1px) 24px;
    }

    .body::before {
      content: "";
      display: block;
      height: 1px;
    }

    .body ::slotted(*) {
      display: block;
      min-width: 0;
    }

    .input-area {
      padding: var(--ai-space-xs, 2px) 4px var(--ai-space-xs, 2px) 24px;
      background: var(--ai-tool-call-input-background, var(--input-background-color, transparent));
    }

    .input-area ::slotted(*) {
      display: block;
      min-width: 0;
      margin: 0;
      max-width: 100%;
    }
  `;

  @property({ reflect: true })
  override id = "";

  @property({ reflect: true })
  name = "";

  @property({ reflect: true })
  label = "";

  @property({ reflect: true })
  kind: "tool" | "shell" | "file" | "search" | "delegate" | "network" | "custom" | "unknown" =
    "unknown";

  @property({ reflect: true })
  effect: "read" | "write" | "mixed" | "unknown" = "unknown";

  @property({ reflect: true })
  headline = "";

  @property({ reflect: true })
  subline = "";

  @property({ reflect: true })
  status: "pending" | "running" | "success" | "error" | "cancelled" | "unknown" = "unknown";

  @property({ reflect: true, type: Boolean })
  open = false;

  private readonly hasSlot = new HasSlotController(this, "[default]", "input", "summary");

  private get tone() {
    return getToolTone(this.name);
  }

  private get badgeText(): string {
    return this.label || this.name;
  }

  private get headlineText(): string {
    return this.headline || this.label || "";
  }

  private get hasBodyContent(): boolean {
    return this.hasSlot.test("[default]");
  }

  private get hasInputContent(): boolean {
    return this.hasSlot.test("input");
  }

  private get hasSummaryContent(): boolean {
    return this.hasSlot.test("summary");
  }

  private get isExpandable(): boolean {
    return this.hasBodyContent || this.hasInputContent;
  }

  private get hasVisibleHeaderContent(): boolean {
    return Boolean(this.badgeText || this.headlineText || this.subline);
  }

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }

  toggle(force?: boolean): void {
    this.open = force ?? !this.open;
  }

  private emitToggle(isOpen: boolean) {
    this.dispatchEvent(
      new CustomEvent<AiShowHideDetail>(isOpen ? "ai-show" : "ai-hide", {
        detail: { source: "tool-call", open: isOpen, id: this.id, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleToggle(e: Event) {
    const details = e.currentTarget as HTMLDetailsElement;
    const isOpen = details.open;
    if (this.open !== isOpen) {
      this.open = isOpen;
    }
    this.emitToggle(isOpen);
  }

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has("open") && changed.get("open") !== undefined) {
      const details = this.renderRoot.querySelector("details");
      if (details && details.open !== this.open) {
        details.open = this.open;
      }
    }
  }

  private renderIcon() {
    const tone = this.tone;
    if (tone === "generic") {
      return html`
        <span class="icon-frame" aria-hidden="true">
          <span class="reasoning-dot"></span>
        </span>
      `;
    }
    return html`<span class="icon-frame" aria-hidden="true">${renderGlyph(tone)}</span>`;
  }

  private renderHeaderContent() {
    return html`
      <span class="header-content">
        ${this.renderIcon()}
        <span class="text-block">
          <span class="headline">
            ${this.badgeText ? html`<span class="badge">${this.badgeText}</span>` : nothing}
            ${
              this.headlineText && this.headlineText !== this.badgeText
                ? html`<span class="headline-text">${this.headlineText}</span>`
                : nothing
            }
          </span>
          ${this.subline ? html`<span class="subline">${this.subline}</span>` : nothing}
        </span>
      </span>
      ${
        this.isExpandable
          ? html`
              <svg class="chevron" viewBox="0 0 10 10" aria-hidden="true">
                <path
                  d="M3 2.2 6.8 5 3 7.8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            `
          : nothing
      }
    `;
  }

  override render() {
    const tone = this.tone;
    const status = this.status;

    if (this.hasSummaryContent) {
      return html`
        <div class="row" data-tone=${tone} data-status=${status}>
          <slot name="summary"></slot>
          ${
            this.isExpandable
              ? html`
                <div class="body">
                  ${
                    this.hasInputContent
                      ? html`
                          <div class="input-area"><slot name="input"></slot></div>
                        `
                      : nothing
                  }
                  <slot></slot>
                </div>
              `
              : nothing
          }
        </div>
      `;
    }

    if (!this.isExpandable) {
      if (!this.hasVisibleHeaderContent) {
        return nothing;
      }

      return html`
        <div class="row" data-tone=${tone} data-status=${status}>
          <div class="row-header">${this.renderHeaderContent()}</div>
        </div>
      `;
    }

    return html`
      <details
        class="row"
        data-tone=${tone}
        data-status=${status}
        ?open=${this.open}
        @toggle=${this.handleToggle}
      >
        <summary class="row-header" interactive>${this.renderHeaderContent()}</summary>
        ${
          this.hasInputContent
            ? html`
                <div class="input-area"><slot name="input"></slot></div>
              `
            : nothing
        }
        <div class="body"><slot></slot></div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-tool-call": AiToolCall;
  }
}
