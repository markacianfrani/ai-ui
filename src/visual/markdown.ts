import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

// --- Markdown types & parser ---

type InlinePart =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "emphasis"; value: string }
  | { type: "link"; text: string; href: string };

type ListItem = {
  text: string;
  children: Block[];
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "code"; code: string; language: string }
  | { type: "ul"; items: ListItem[] }
  | { type: "ol"; items: ListItem[] }
  | { type: "blockquote"; blocks: Block[] }
  | { type: "table"; headers: string[]; rows: string[][]; aligns: ("left" | "center" | "right")[] };

/**
 * Markdown content renderer. Parses and renders markdown source.
 *
 * @slot - Fallback content if content property is empty.
 *
 * @cssprop --ai-markdown-color - Body text color.
 * @cssprop --ai-markdown-link-color - Link color.
 * @cssprop --ai-markdown-code-background - Inline/block code background.
 * @cssprop --ai-markdown-code-color - Code text color.
 * @cssprop --ai-markdown-border-color - Blockquote/table/pre border.
 * @cssprop --ai-markdown-heading-color - Heading color.
 * @cssprop --ai-markdown-gap - Vertical rhythm between markdown blocks.
 */
@customElement("ai-markdown")
export class AiMarkdown extends LitElement {
  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      display: block;
      max-width: 100%;
      color: var(--ai-markdown-color, var(--text-block-color, var(--text, var(--ai-color-text))));
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
      font-size: var(--font-size-body, var(--ai-font-size-body, 0.875rem));
      line-height: var(--line-height-loose, var(--ai-line-height, 1.6));
    }

    .markdown {
      display: block;
    }

    .markdown > * + * {
      margin-top: var(--ai-markdown-gap, var(--content-gap, 10px));
    }

    p,
    ul,
    ol,
    pre,
    h1,
    h2,
    h3,
    blockquote {
      margin: 0;
    }

    p,
    li {
      white-space: pre-wrap;
    }

    h1,
    h2,
    h3 {
      line-height: var(--line-height-snug, 1.3);
      color: var(
        --ai-markdown-heading-color,
        var(--heading-color, var(--text, var(--ai-markdown-color, var(--ai-color-text))))
      );
    }

    h1 {
      font-size: var(--font-size-title, 1.125rem);
      font-weight: var(--font-weight-bold, 700);
    }

    h2 {
      font-size: var(--font-size-body, 1rem);
      font-weight: var(--font-weight-bold, 700);
    }

    h3 {
      font-size: var(--font-size-ui, 0.875rem);
      font-weight: var(--font-weight-title, 600);
    }

    ul,
    ol {
      padding-left: 1.1rem;
    }

    li {
      margin: 0;
    }

    li + li {
      margin-top: 4px;
    }

    li > ul,
    li > ol {
      margin-top: 4px;
      margin-bottom: 0;
    }

    blockquote {
      border-left: 3px solid
        var(
          --ai-markdown-border-color,
          var(--blockquote-border-color, var(--border, var(--ai-color-border, #333)))
        );
      padding-left: var(--spacing-sm, var(--ai-space-sm, 0.5rem));
      color: color-mix(
        in srgb,
        var(--text, var(--ai-markdown-color, var(--ai-color-text))) 80%,
        transparent
      );
    }

    blockquote > * + * {
      margin-top: 6px;
    }

    blockquote blockquote {
      margin-top: 6px;
    }

    code {
      padding: 0.12rem 0.35rem;
      border-radius: 6px;
      background: var(
        --ai-markdown-code-background,
        var(--code-background-color, color-mix(in srgb, var(--text, currentColor) 8%, transparent))
      );
      color: var(
        --ai-markdown-code-color,
        var(--code-text-color, var(--text, var(--ai-color-text)))
      );
      font-family: var(--font-family-mono, var(--ai-font-family-mono, monospace));
      font-size: 0.92em;
    }

    pre {
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: calc(var(--spacing-sm, var(--ai-space-sm, 0.5rem)) + 2px)
        var(--spacing-md, var(--ai-space-md, 0.75rem));
      border-radius: calc(var(--radius, var(--ai-radius, 8px)) + 2px);
      background: var(
        --ai-markdown-code-background,
        var(--code-background-color, color-mix(in srgb, var(--text, currentColor) 5%, transparent))
      );
      border: 1px solid
        var(
          --ai-markdown-border-color,
          var(--blockquote-border-color, var(--border, var(--ai-color-border, #333)))
        );
    }

    pre code {
      padding: 0;
      border-radius: 0;
      background: transparent;
      color: inherit;
      font-size: 0.9em;
    }

    strong {
      color: var(--text, var(--ai-markdown-color, var(--ai-color-text)));
      font-weight: var(--font-weight-title, 600);
    }

    em {
      font-style: italic;
    }

    a {
      color: var(
        --ai-markdown-link-color,
        var(--link-color, var(--accent, var(--ai-color-accent, #0066cc)))
      );
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
    }

    a:hover {
      opacity: 0.8;
    }

    :host([tone="user"]) {
      color: var(--ai-markdown-color, var(--text-on-accent, HighlightText));
      line-height: var(--line-height-snug, 1.25);
    }

    :host([tone="user"]) .markdown > * + * {
      margin-top: 4px;
    }

    :host([tone="user"]) a {
      color: var(--ai-markdown-link-color, var(--text-on-accent, HighlightText));
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    :host([tone="user"]) blockquote {
      border-left-color: color-mix(in srgb, var(--text-on-accent, currentColor) 30%, transparent);
      color: var(--text-on-accent, currentColor);
    }

    :host([tone="user"]) code,
    :host([tone="user"]) pre {
      background: var(
        --ai-markdown-code-background,
        color-mix(in srgb, var(--text, currentColor) 12%, transparent)
      );
      border-color: var(
        --ai-markdown-border-color,
        color-mix(in srgb, var(--text, currentColor) 15%, transparent)
      );
      color: var(--ai-markdown-code-color, var(--text, currentColor));
    }

    :host([tone="user"]) th {
      background: color-mix(in srgb, var(--text, currentColor) 8%, transparent);
    }

    :host([tone="user"]) th,
    :host([tone="user"]) td {
      border-color: var(
        --ai-markdown-border-color,
        color-mix(in srgb, var(--text, currentColor) 15%, transparent)
      );
    }

    :host([tone="system"]),
    :host([tone="tool"]) {
      color: var(--ai-markdown-color, var(--text-muted, var(--ai-color-text-muted, #888)));
      font-size: var(--font-size-meta, var(--ai-font-size-meta, 0.8125rem));
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      min-width: max-content;
      border-collapse: collapse;
      font-size: 0.92em;
      margin: 0;
    }

    th,
    td {
      padding: var(--spacing-xs, var(--ai-space-xs, 0.25rem))
        var(--spacing-sm, var(--ai-space-sm, 0.5rem));
      border: 1px solid
        var(
          --ai-markdown-border-color,
          var(--table-border-color, var(--border, var(--ai-color-border, #333)))
        );
      text-align: left;
    }

    th {
      background: color-mix(
        in srgb,
        var(--text, var(--ai-markdown-color, var(--ai-color-text))) 4%,
        transparent
      );
      font-weight: var(--font-weight-semibold, 600);
      color: var(--text, var(--ai-markdown-color, var(--ai-color-text)));
    }

    td {
      background: transparent;
    }

    tr:nth-child(even) td {
      background: color-mix(
        in srgb,
        var(--text, var(--ai-markdown-color, var(--ai-color-text))) 2%,
        transparent
      );
    }
  `;

  /** Markdown content to render. Does NOT reflect (large content). */
  @property({ type: String })
  content = "";

  /** Visual tone for prose style parity with pi-ui messages. */
  @property({ reflect: true })
  tone: "assistant" | "user" | "system" | "tool" = "assistant";

  /** Whether the content is trusted (affects link behavior). */
  @property({ type: Boolean, reflect: true })
  trusted = false;

  // --- Inline parser ---

  private parseInlines(text: string): InlinePart[] {
    const parts: InlinePart[] = [];
    const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;
    let lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      const token = match[0];
      const index = match.index ?? 0;
      if (index > lastIndex) {
        parts.push({ type: "text", value: text.slice(lastIndex, index) });
      }
      if (token.startsWith("`")) {
        parts.push({ type: "code", value: token.slice(1, -1) });
      } else if (token.startsWith("**")) {
        parts.push({ type: "strong", value: token.slice(2, -2) });
      } else if (token.startsWith("[")) {
        const linkMatch = token.match(/^\[(.+)\]\((.+)\)$/);
        if (linkMatch) {
          parts.push({
            type: "link",
            text: linkMatch[1] ?? "",
            href: linkMatch[2] ?? "",
          });
        } else {
          parts.push({ type: "text", value: token });
        }
      } else if (token.startsWith("_")) {
        parts.push({ type: "emphasis", value: token.slice(1, -1) });
      } else {
        parts.push({ type: "emphasis", value: token.slice(1, -1) });
      }
      lastIndex = index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", value: text.slice(lastIndex) });
    }

    return parts;
  }

  private renderInline(text: string) {
    return map(this.parseInlines(text), (part) => {
      if (part.type === "code") {
        return html`<code>${part.value}</code>`;
      }
      if (part.type === "strong") {
        return html`<strong>${part.value}</strong>`;
      }
      if (part.type === "emphasis") {
        return html`<em>${part.value}</em>`;
      }
      if (part.type === "link") {
        const isAllowed =
          /^https?:\/\//i.test(part.href) || !/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(part.href);
        const safe = isAllowed ? part.href : "";
        return html`<a
          href="${safe}"
          target="_blank"
          rel="noopener noreferrer"
          >${part.text}</a
        >`;
      }
      return part.value;
    });
  }

  // --- Table helpers ---

  private parseTableRow(line: string): string[] {
    const content = line.replace(/^\|/, "").replace(/\|$/, "");
    return content.split("|").map((cell) => cell.trim());
  }

  private parseTableAligns(separator: string): ("left" | "center" | "right")[] {
    const cells = this.parseTableRow(separator);
    return cells.map((cell) => {
      const trimmed = cell.trim();
      const leftAlign = trimmed.startsWith(":");
      const rightAlign = trimmed.endsWith(":");
      if (leftAlign && rightAlign) {
        return "center";
      }
      if (rightAlign) {
        return "right";
      }
      return "left";
    });
  }

  private isTableSeparator(line: string, columnCount: number): boolean {
    const cells = this.parseTableRow(line);
    if (cells.length !== columnCount || cells.length === 0) {
      return false;
    }
    return cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
  }

  // --- Indent helper ---

  private indentLevel(line: string): number {
    let n = 0;
    for (const ch of line) {
      if (ch === " ") {
        n++;
      } else if (ch === "\t") {
        n += 2;
      } else {
        break;
      }
    }
    return n;
  }

  // --- Block parsers ---

  private parseBlocks(source: string): Block[] {
    const lines = source.replace(/\r\n/g, "\n").split("\n");
    const blocks: Block[] = [];
    let i = 0;

    while (i < lines.length) {
      const trimmed = (lines[i] ?? "").trim();

      if (!trimmed) {
        i++;
        continue;
      }

      const codeBlock = this.parseCodeBlock(lines, i, trimmed);
      if (codeBlock) {
        blocks.push(codeBlock.block);
        i = codeBlock.nextIndex;
        continue;
      }

      const headingBlock = this.parseHeadingBlock(trimmed);
      if (headingBlock) {
        blocks.push(headingBlock);
        i++;
        continue;
      }

      const blockquoteBlock = this.parseBlockquoteBlock(lines, i, trimmed);
      if (blockquoteBlock) {
        blocks.push(blockquoteBlock.block);
        i = blockquoteBlock.nextIndex;
        continue;
      }

      const listBlock = this.parseListBlock(lines, i, trimmed);
      if (listBlock) {
        blocks.push(listBlock.block);
        i = listBlock.nextIndex;
        continue;
      }

      const tableBlock = this.parseTableBlock(lines, i, trimmed);
      if (tableBlock) {
        blocks.push(tableBlock.block);
        i = tableBlock.nextIndex;
        continue;
      }

      const paragraphBlock = this.parseParagraphBlock(lines, i);
      blocks.push(paragraphBlock.block);
      i = paragraphBlock.nextIndex;
    }

    return blocks;
  }

  private parseCodeBlock(lines: string[], startIndex: number, trimmed: string) {
    if (!trimmed.startsWith("```")) {
      return undefined;
    }

    const language = trimmed.slice(3).trim();
    const codeLines: string[] = [];
    let i = startIndex + 1;
    while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
      codeLines.push(lines[i] ?? "");
      i++;
    }
    if (i < lines.length) {
      i++;
    }

    return {
      block: { type: "code", code: codeLines.join("\n"), language } as Block,
      nextIndex: i,
    };
  }

  private parseHeadingBlock(trimmed: string): Block | undefined {
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (!heading?.[1] || !heading?.[2]) {
      return undefined;
    }

    return {
      type: "heading",
      level: heading[1].length as 1 | 2 | 3,
      text: heading[2].trim(),
    };
  }

  private parseBlockquoteBlock(lines: string[], startIndex: number, trimmed: string) {
    if (!trimmed.startsWith(">")) {
      return undefined;
    }

    const quoteLines: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i] ?? "";
      const lineTrimmed = line.trim();
      if (!lineTrimmed) {
        let j = i + 1;
        while (j < lines.length && !(lines[j] ?? "").trim()) {
          j++;
        }
        if (j < lines.length && (lines[j] ?? "").trim().startsWith(">")) {
          quoteLines.push("");
          i = j;
          continue;
        }
        break;
      }
      if (!lineTrimmed.startsWith(">")) {
        break;
      }
      quoteLines.push(lineTrimmed.replace(/^>\s?/, ""));
      i++;
    }

    if (quoteLines.length === 0) {
      return undefined;
    }

    const innerBlocks = this.parseBlocks(quoteLines.join("\n"));
    return {
      block: { type: "blockquote", blocks: innerBlocks } as Block,
      nextIndex: i,
    };
  }

  private parseListBlock(lines: string[], startIndex: number, trimmed: string) {
    if (/^[-*]\s+(.+)$/.test(trimmed)) {
      return this.collectList(lines, startIndex, "ul");
    }
    if (/^\d+\.\s+(.+)$/.test(trimmed)) {
      return this.collectList(lines, startIndex, "ol");
    }
    return undefined;
  }

  private skipBlankLines(lines: string[], from: number): number {
    let j = from;
    while (j < lines.length && !(lines[j] ?? "").trim()) {
      j++;
    }
    return j;
  }

  private parseNestedChildren(lines: string[], startIndex: number, baseIndent: number): Block[] {
    const nestedLines: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const nestedLine = lines[i] ?? "";
      const nestedTrimmed = nestedLine.trim();
      if (!nestedTrimmed) {
        const j = this.skipBlankLines(lines, i + 1);
        if (j < lines.length && this.indentLevel(lines[j] ?? "") > baseIndent) {
          nestedLines.push("");
          i = j;
          continue;
        }
        break;
      }
      if (this.indentLevel(nestedLine) <= baseIndent) {
        break;
      }
      nestedLines.push(nestedLine);
      i++;
    }

    if (nestedLines.length === 0) {
      return [];
    }

    const nonEmpty = nestedLines.filter((l) => l.trim());
    const minIndent =
      nonEmpty.length > 0 ? Math.min(...nonEmpty.map((l) => this.indentLevel(l))) : 0;
    const unindented = nestedLines.map((l) => (l.trim() ? l.slice(minIndent) : l));
    return this.parseBlocks(unindented.join("\n"));
  }

  private collectList(lines: string[], startIndex: number, type: "ul" | "ol") {
    const baseIndent = this.indentLevel(lines[startIndex] ?? "");
    const listPattern = type === "ul" ? /^[-*]\s+(.+)$/ : /^\d+\.\s+(.+)$/;
    const items: ListItem[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i] ?? "";
      const trimmed = line.trim();
      const indent = this.indentLevel(line);

      if (!trimmed) {
        const j = this.skipBlankLines(lines, i + 1);
        if (
          j < lines.length &&
          this.indentLevel(lines[j] ?? "") === baseIndent &&
          listPattern.test((lines[j] ?? "").trim())
        ) {
          i = j;
          continue;
        }
        break;
      }

      if (indent < baseIndent) {
        break;
      }

      if (indent === baseIndent) {
        const match = trimmed.match(listPattern);
        if (!match?.[1]) {
          break;
        }
        items.push({ text: match[1].trim(), children: [] });
        i++;
        continue;
      }

      // Deeper indentation — nested content belonging to last item
      const current = items[items.length - 1];
      if (!current) {
        break;
      }

      current.children = this.parseNestedChildren(lines, i, baseIndent);
      const consumed = this.countNestedLines(lines, i, baseIndent);
      i += consumed;
    }

    return { block: { type, items } as Block, nextIndex: i };
  }

  private countNestedLines(lines: string[], startIndex: number, baseIndent: number): number {
    let count = 0;
    let i = startIndex;
    while (i < lines.length) {
      const line = lines[i] ?? "";
      const trimmed = line.trim();
      if (!trimmed) {
        const j = this.skipBlankLines(lines, i + 1);
        if (j < lines.length && this.indentLevel(lines[j] ?? "") > baseIndent) {
          count += j - i;
          i = j;
          continue;
        }
        break;
      }
      if (this.indentLevel(line) <= baseIndent) {
        break;
      }
      count++;
      i++;
    }
    return count;
  }

  private parseTableBlock(lines: string[], startIndex: number, trimmed: string) {
    if (!this.startsTable(trimmed)) {
      return undefined;
    }

    const headers = this.parseTableRow(trimmed);
    const separator = (lines[startIndex + 1] ?? "").trim();
    if (!separator.startsWith("|") || !this.isTableSeparator(separator, headers.length)) {
      return undefined;
    }

    const aligns = this.parseTableAligns(separator);
    const rows: string[][] = [];
    let i = startIndex + 2;

    while (i < lines.length) {
      const tableLine = (lines[i] ?? "").trim();
      if (!this.startsTable(tableLine)) {
        break;
      }
      rows.push(this.parseTableRow(tableLine));
      i++;
    }

    return {
      block: { type: "table", headers, rows, aligns } as Block,
      nextIndex: i,
    };
  }

  private parseParagraphBlock(lines: string[], startIndex: number) {
    const paragraphLines: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const nextTrimmed = (lines[i] ?? "").trim();
      if (!nextTrimmed || this.startsStructuredBlock(lines, i, nextTrimmed)) {
        break;
      }
      paragraphLines.push(nextTrimmed);
      i++;
    }

    return {
      block: {
        type: "paragraph",
        text: paragraphLines.join(" "),
      } as Block,
      nextIndex: i,
    };
  }

  private startsStructuredBlock(lines: string[], index: number, trimmed: string): boolean {
    return (
      /^(#{1,3})\s+/.test(trimmed) ||
      /^[-*]\s+/.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed) ||
      trimmed.startsWith("```") ||
      trimmed.startsWith(">") ||
      this.isTableStart(lines, index, trimmed)
    );
  }

  private startsTable(trimmed: string): boolean {
    return trimmed.startsWith("|") && trimmed.includes("|");
  }

  private isTableStart(lines: string[], index: number, trimmed: string): boolean {
    if (!this.startsTable(trimmed)) {
      return false;
    }
    const headers = this.parseTableRow(trimmed);
    const separator = (lines[index + 1] ?? "").trim();
    return separator.startsWith("|") && this.isTableSeparator(separator, headers.length);
  }

  // --- Render ---

  private renderBlocks(blocks: Block[]): unknown {
    return map(blocks, (block) => this.renderBlock(block));
  }

  private renderBlock(block: Block): unknown {
    if (block.type === "paragraph") {
      return html`<p>${this.renderInline(block.text)}</p>`;
    }
    if (block.type === "heading") {
      if (block.level === 1) {
        return html`<h1>${this.renderInline(block.text)}</h1>`;
      }
      if (block.level === 2) {
        return html`<h2>${this.renderInline(block.text)}</h2>`;
      }
      return html`<h3>${this.renderInline(block.text)}</h3>`;
    }
    if (block.type === "code") {
      return html`<pre><code>${block.code}</code></pre>`;
    }
    if (block.type === "ul") {
      return html`<ul
        >${map(
          block.items,
          (item) =>
            html`<li
              >${this.renderInline(item.text)}${
                item.children.length ? this.renderBlocks(item.children) : nothing
              }</li
            >`,
        )}</ul
      >`;
    }
    if (block.type === "ol") {
      return html`<ol
        >${map(
          block.items,
          (item) =>
            html`<li
              >${this.renderInline(item.text)}${
                item.children.length ? this.renderBlocks(item.children) : nothing
              }</li
            >`,
        )}</ol
      >`;
    }
    if (block.type === "blockquote") {
      return html`<blockquote>${this.renderBlocks(block.blocks)}</blockquote>`;
    }
    if (block.type === "table") {
      return html`
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                ${map(block.headers, (header, idx) => {
                  const align = block.aligns[idx] ?? "left";
                  return html`<th style="text-align: ${align}"
                    >${this.renderInline(header)}</th
                  >`;
                })}
              </tr>
            </thead>
            <tbody>
              ${map(
                block.rows,
                (row) => html`
                  <tr>
                    ${map(row, (cell, idx) => {
                      const align = block.aligns[idx] ?? "left";
                      return html`<td style="text-align: ${align}"
                        >${this.renderInline(cell)}</td
                      >`;
                    })}
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </div>
      `;
    }

    return nothing;
  }

  private renderMarkdown(source: string) {
    const blocks = this.parseBlocks(source.trim());
    return html`<div class="markdown">${this.renderBlocks(blocks)}</div>`;
  }

  override render() {
    if (this.content) {
      return this.renderMarkdown(this.content);
    }
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ai-markdown": AiMarkdown;
  }
}
