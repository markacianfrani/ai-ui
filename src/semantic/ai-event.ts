import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { TemplateResult } from "lit";

const KIND_LABELS: Record<string, string> = {
  status: "Status",
  "model-change": "Model Change",
  checkpoint: "Checkpoint",
  note: "Note",
  system: "System",
  error: "Error",
  custom: "Event",
};

const SEVERITY_COLORS: Record<string, string> = {
  info: "var(--ai-event-info-color, var(--ai-event-info, var(--ai-color-info, #3b82f6)))",
  warning:
    "var(--ai-event-warning-color, var(--ai-event-warning, var(--ai-color-warning, #f59e0b)))",
  error: "var(--ai-event-error-color, var(--ai-event-error, var(--ai-color-error, #ef4444)))",
};

/**
 * Non-message, non-operation transcript event.
 *
 * Represents status changes, model switches, checkpoints, notes,
 * system messages, errors, or custom events within an AI transcript.
 *
 * @slot summary - Custom summary/label override
 * @slot meta - Timestamps, source labels
 * @slot - Default: event content
 *
 * @fires ai-show - Dispatched when opened. Bubbles, composed.
 * @fires ai-hide - Dispatched when closed. Bubbles, composed.
 *
 * @cssprop --ai-event-background-color - Event background. Default: transparent
 * @cssprop --ai-event-text-color - Event text color. Default: var(--ai-color-text-muted)
 * @cssprop --ai-event-border-color - Event border color. Default: var(--ai-color-border)
 * @cssprop --ai-event-border-width - Event border width. Default: 0
 * @cssprop --ai-event-border-radius - Event border radius. Default: 0
 * @cssprop --ai-event-content-gap - Content gap. Default: var(--ai-space-sm)
 * @cssprop --ai-event-content-indent - Expanded content indentation. Default: clamp(20px, 7vw, 58px)
 * @cssprop --ai-event-rule-color - Divider rule color. Default: subtle muted text color
 * @cssprop --ai-event-open-rule-color - Divider rule color when expanded. Default: stronger muted text color
 * @cssprop --ai-event-meta-color - Meta slot text color. Default: var(--ai-color-text-muted)
 * @cssprop --ai-event-info-color - Info severity color. Default: var(--ai-color-info)
 * @cssprop --ai-event-warning-color - Warning severity color. Default: var(--ai-color-warning)
 * @cssprop --ai-event-error-color - Error severity color. Default: var(--ai-color-error)
 */
@customElement("ai-event")
export class AiEvent extends LitElement {
  //#region Properties

  /** Event kind. */
  @property({ reflect: true })
  kind: "status" | "model-change" | "checkpoint" | "note" | "system" | "error" | "custom" =
    "custom";

  /** Severity level — controls accent color. */
  @property({ reflect: true })
  severity: "info" | "warning" | "error" = "info";

  /** Origin source identifier. */
  @property({ reflect: true })
  source: string = "";

  /** ID of the element this event pertains to (maps to `for` attribute). */
  @property({ reflect: true, attribute: "for" })
  htmlFor: string = "";

  /** Whether the event details are expanded. */
  @property({ reflect: true, type: Boolean })
  open: boolean = false;

  //#endregion

  //#region Queries

  @query("details")
  private _details!: HTMLDetailsElement | null;

  //#endregion

  //#region Public API

  /** Expand the event details. */
  show(): void {
    this.open = true;
  }

  /** Collapse the event details. */
  hide(): void {
    this.open = false;
  }

  /** Toggle open state. Optionally force open/closed. */
  toggle(force?: boolean): void {
    this.open = force !== undefined ? force : !this.open;
  }

  //#endregion

  //#region Lifecycle

  private _prevOpen: boolean = false;

  override updated(): void {
    // Sync the native <details> element with the reflected `open` property
    if (this._details && this._details.open !== this.open) {
      this._details.open = this.open;
    }

    // Dispatch toggle event on change
    if (this._prevOpen !== this.open) {
      this._prevOpen = this.open;
      this.dispatchEvent(
        new CustomEvent(this.open ? "ai-show" : "ai-hide", {
          detail: { kind: this.kind },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  //#endregion

  //#region Render

  private _onToggle(): void {
    const details = this._details;
    if (!details) {
      return;
    }
    this.open = details.open;
  }

  private get _severityColor(): string {
    return SEVERITY_COLORS[this.severity] ?? SEVERITY_COLORS.info ?? "#888";
  }

  private get _kindLabel(): string {
    return KIND_LABELS[this.kind] ?? KIND_LABELS.custom ?? "Custom";
  }

  override render(): TemplateResult {
    const accentColor = this._severityColor;

    return html`
      <details
        .open=${this.open}
        @toggle=${this._onToggle}
        part="details"
        style="--_accent: ${accentColor}"
      >
        <summary part="summary">
          <span class="summary-text" part="summary-text">
            <slot name="summary">
              <span class="kind-label" part="kind-label">${this._kindLabel}</span>
            </slot>
          </span>
          <span class="summary-rule" aria-hidden="true"></span>
          <span class="summary-meta" part="meta">
            <slot name="meta"></slot>
          </span>
          <span class="chevron" part="marker" aria-hidden="true">
            <svg viewBox="0 0 10 10" focusable="false">
              <path d="M3.25 2.25 6.25 5 3.25 7.75"></path>
            </svg>
          </span>
        </summary>

        <div class="content-shell" part="content-shell">
          <div class="content" part="content">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }

  //#endregion

  //#region Styles

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      margin: 0;
      padding: 0;
      color: var(--ai-event-color, var(--ai-event-text-color, var(--text-muted, #8d867a)));
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    details {
      display: block;
      min-width: 0;
      max-width: 100%;
      margin: 0;
      background: var(--ai-event-background, var(--ai-event-background-color, transparent));
      border: var(--ai-event-border-width, 0) solid
        var(--ai-event-border-color, var(--ai-color-border, transparent));
      border-radius: var(--ai-event-radius, var(--ai-event-border-radius, 0));
    }

    summary {
      display: grid;
      grid-template-columns: auto minmax(24px, 1fr) auto 12px;
      align-items: center;
      column-gap: 8px;
      min-width: 0;
      list-style: none;
      cursor: pointer;
      color: var(
        --ai-event-summary-color,
        color-mix(in oklch, var(--text-muted, currentColor) 82%, var(--text, currentColor))
      );
      padding: 3px 4px;
      border-radius: var(--radius-sm, 5px);
      background: transparent;
      user-select: none;
      transition:
        background 0.16s ease,
        color 0.16s ease;
    }

    summary:hover {
      background: color-mix(in oklch, var(--_accent) 5%, transparent);
      color: color-mix(in oklch, var(--text, currentColor) 72%, var(--text-muted, currentColor));
    }

    summary:focus-visible {
      outline: 2px solid var(--focus, var(--_accent));
      outline-offset: 2px;
    }

    details[open] > summary {
      color: color-mix(in oklch, var(--text, currentColor) 76%, var(--text-muted, currentColor));
    }

    summary::marker,
    summary::-webkit-details-marker {
      display: none;
    }

    .summary-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--font-size-caption, 0.75rem);
      font-weight: var(--font-weight-semibold, 600);
      letter-spacing: var(--tracking-label, 0.04em);
      line-height: var(--line-height-tight, 1.1);
      text-transform: uppercase;
    }

    .summary-rule {
      min-width: 24px;
      height: 1px;
      background: var(
        --ai-event-rule-color,
        color-mix(in oklch, var(--text-muted, currentColor) 16%, transparent)
      );
    }

    details[open] .summary-rule {
      background: var(
        --ai-event-open-rule-color,
        color-mix(in oklch, var(--text-muted, currentColor) 24%, transparent)
      );
    }

    .kind-label {
      color: inherit;
      font-weight: inherit;
    }

    .summary-meta {
      display: inline-flex;
      align-items: baseline;
      justify-content: flex-end;
      min-width: 0;
      max-width: min(46vw, 360px);
      color: var(
        --ai-event-meta-color,
        var(--ai-event-meta, color-mix(in oklch, var(--text-muted, currentColor) 76%, transparent))
      );
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-tight, 1.1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 16px;
      justify-self: end;
      color: color-mix(in oklch, var(--text-muted, currentColor) 88%, transparent);
    }

    .chevron svg {
      width: 10px;
      height: 10px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.16s ease;
    }

    details[open] .chevron svg {
      transform: rotate(90deg);
    }

    .content-shell {
      margin: 2px 0 1px;
      padding: 6px 4px 3px var(--ai-event-content-indent, clamp(20px, 7vw, 58px));
    }

    .content {
      display: block;
      min-width: 0;
      max-width: 100%;
      color: var(
        --ai-event-content-color,
        color-mix(in oklch, var(--text, currentColor) 82%, var(--text-muted, currentColor))
      );
      font-size: var(--font-size-meta, 0.8125rem);
      line-height: var(--line-height-relaxed, 1.45);
    }

    .content ::slotted(*) {
      max-width: 100%;
    }

    .content ::slotted(:first-child) {
      margin-top: 0;
    }

    .content ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .content ::slotted(pre) {
      overflow-x: auto;
      padding: 8px 10px;
      border-radius: var(--radius-sm, 5px);
      background: color-mix(in oklch, var(--text, currentColor) 5%, transparent);
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-snug, 1.25);
    }

    .content ::slotted(code) {
      border-radius: 4px;
      padding: 0.08em 0.35em;
      background: color-mix(in oklch, var(--text, currentColor) 7%, transparent);
      color: color-mix(in oklch, var(--text, currentColor) 88%, var(--_accent));
      font-size: 0.94em;
    }

    :host([severity="warning"]) .summary-text {
      color: color-mix(in oklch, var(--_accent) 44%, var(--text, currentColor));
    }

    :host([severity="warning"]) .summary-rule {
      background: color-mix(in oklch, var(--_accent) 24%, transparent);
    }

    :host([severity="error"]) .summary-text {
      color: color-mix(in oklch, var(--_accent) 52%, var(--text, currentColor));
    }

    :host([severity="error"]) .summary-rule {
      background: color-mix(in oklch, var(--_accent) 30%, transparent);
    }

    :host([severity="error"]) summary:hover {
      background: color-mix(in oklch, var(--_accent) 9%, transparent);
    }

    @media (max-width: 520px) {
      summary {
        grid-template-columns: auto minmax(16px, 1fr) 12px;
        padding-right: 4px;
      }

      .summary-meta {
        grid-column: 1 / 3;
        grid-row: 2;
        justify-content: flex-start;
        max-width: 100%;
        margin-top: 1px;
      }

      .chevron {
        grid-column: 3;
        grid-row: 1 / span 2;
      }

      .content-shell {
        padding-left: 18px;
      }
    }
  `;

  //#endregion
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-event": AiEvent;
  }

  interface HTMLElementEventMap {
    "ai-show": CustomEvent<{ kind: string }>;
    "ai-hide": CustomEvent<{ kind: string }>;
  }
}
