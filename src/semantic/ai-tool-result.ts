import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HasSlotController } from "../lib/has-slot-controller";

export type ToolResultStatus = "success" | "error" | "cancelled" | "unknown";
export type ToolResultChannel = "result" | "stdout" | "stderr" | "log" | "unknown";

function isStructuredValue(value: unknown): value is string | unknown[] | Record<string, unknown> {
  return (
    typeof value === "string" ||
    Array.isArray(value) ||
    (Boolean(value) && typeof value === "object")
  );
}

function extractFirstStructuredField(
  record: Record<string, unknown>,
  keys: string[],
): string[] | undefined {
  for (const key of keys) {
    const candidate = record[key];
    if (!isStructuredValue(candidate)) {
      continue;
    }
    const parts = extractStructuredText(candidate);
    if (parts.length > 0) {
      return parts;
    }
  }
  return undefined;
}

function extractStructuredText(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractStructuredText(item));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const extracted = extractFirstStructuredField(record, [
      "text",
      "message",
      "content",
      "result",
      "output",
      "error",
    ]);
    return extracted ?? [JSON.stringify(value, undefined, 2)];
  }

  if (value === null || value === undefined) {
    return [];
  }
  return [String(value)];
}

export function normalizeToolOutput(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const lines = extractStructuredText(parsed).filter(Boolean);
    if (lines.length > 0) {
      return lines.join("\n\n");
    }
  } catch {
    // fall through to raw content
  }

  return trimmed;
}

/**
 * Specialized runtime/tool output content block.
 *
 * @slot - Output content. If absent and content is set, renders normalized output in <pre>.
 * @slot meta - Optional source/channel/truncation metadata.
 *
 * @cssprop --ai-tool-result-color - Output text color.
 * @cssprop --ai-tool-result-background - Output background.
 * @cssprop --ai-tool-result-meta-color - Meta slot text color.
 * @cssprop --ai-tool-result-error-color - Error text color.
 * @cssprop --ai-tool-result-code-color - Code/output text color.
 * @cssprop --ai-tool-result-code-font - Code/output font family.
 * @cssprop --ai-tool-result-max-height - Maximum output height. Default: 240px
 */
@customElement("ai-tool-result")
export class AiToolResult extends LitElement {
  /** Associated ai-tool-call[id]. Missing/mismatched ids are allowed. */
  @property({ reflect: true, attribute: "for" })
  htmlFor = "";

  /** Tool/result source name. */
  @property({ reflect: true })
  name = "";

  /** Result status. */
  @property({ reflect: true })
  status: "success" | "error" | "cancelled" | "unknown" = "unknown";

  /** Output channel. */
  @property({ reflect: true })
  channel: "result" | "stdout" | "stderr" | "log" | "unknown" = "unknown";

  /** MIME/content type hint. */
  @property({ reflect: true, attribute: "content-type" })
  contentType = "text/plain";

  /** Raw output content. Prefer property binding for large content. */
  @property({ type: String })
  content = "";

  /** Whether the rendered output was truncated upstream. */
  @property({ reflect: true, type: Boolean })
  truncated = false;

  private readonly hasSlot = new HasSlotController(this, "[default]", "meta");

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      margin: 0;
      padding: 0;
      min-width: 0;
      max-width: 100%;
      background: var(--ai-tool-result-background, transparent);
      color: var(--ai-tool-result-color, var(--text, var(--ai-color-text, inherit)));
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: var(--ai-space-sm, 8px);
      min-width: 0;
      max-width: 100%;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: var(--ai-space-xs, 4px);
      color: var(--ai-tool-result-meta-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-size: var(--font-size-caption, var(--ai-font-size-xs, 0.75rem));
    }

    .content {
      min-width: 0;
      max-width: 100%;
      color: var(--ai-tool-result-color, var(--text, var(--ai-color-text, inherit)));
    }

    pre {
      margin: 0;
      max-width: 100%;
      max-height: var(--ai-tool-result-max-height, 240px);
      overflow-x: auto;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      color: var(
        --ai-tool-result-code-color,
        color-mix(in oklch, var(--text, currentColor) 82%, var(--text-muted, currentColor))
      );
      font-family: var(--ai-tool-result-code-font, var(--font-family-mono, monospace));
      font-size: var(--font-size-caption, 0.75rem);
      line-height: var(--line-height-body, 1.5);
      white-space: pre-wrap;
      word-break: break-word;
    }

    :host([channel="stderr"]) .content,
    :host([status="error"]) .content {
      color: var(--ai-tool-result-error-color, var(--error, var(--ai-color-error, #dc2626)));
    }

    :host([channel="log"]) .content {
      color: var(--ai-tool-result-meta-color, var(--text-muted, var(--ai-color-text-muted, #888)));
    }

    .truncation-indicator::after {
      content: " (truncated)";
      color: var(--ai-tool-result-meta-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-style: italic;
    }
  `;

  private get hasDefaultContent(): boolean {
    return this.hasSlot.test("[default]");
  }

  private get hasMetaContent(): boolean {
    return this.hasSlot.test("meta");
  }

  override render() {
    const body = normalizeToolOutput(this.content);
    return html`
      <div class="container">
        ${
          this.hasMetaContent
            ? html`
                <div class="meta"><slot name="meta"></slot></div>
              `
            : nothing
        }
        <div class="content ${this.truncated ? "truncation-indicator" : ""}">
          ${
            this.hasDefaultContent
              ? html`
                  <slot></slot>
                `
              : body
                ? html`<pre>${body}</pre>`
                : nothing
          }
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-tool-result": AiToolResult;
  }
}
