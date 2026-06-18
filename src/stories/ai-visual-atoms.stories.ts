import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

// ── ai-stack ──────────────────────────────────────────────

const stackMeta: Meta = {
  title: "Visual/AiStack",
  component: "ai-stack",
  tags: ["autodocs"],
};
export default stackMeta;
type StackStory = StoryObj;

export const StackPlayground: StackStory = {
  args: {
    direction: "column",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: false,
    inline: false,
  },
  render: (args) => html`
    <ai-stack
      direction=${args.direction ?? "column"}
      gap=${args.gap ?? "none"}
      align=${args.align ?? "stretch"}
      justify=${args.justify ?? "start"}
      ?wrap=${args.wrap ?? false}
      ?inline=${args.inline ?? false}
      style="max-width: 300px;"
    >
      <div style="background: var(--surface); padding: 8px; border-radius: 4px;">Row 1</div>
      <div style="background: var(--surface); padding: 8px; border-radius: 4px;">Row 2</div>
      <div style="background: var(--surface); padding: 8px; border-radius: 4px;">Row 3</div>
    </ai-stack>
  `,
};

export const StackRow: StackStory = {
  render: () => html`
    <ai-stack direction="row" gap="sm" align="center">
      <ai-badge tone="success">pass</ai-badge>
      <ai-text size="meta">42 tests</ai-text>
    </ai-stack>
  `,
};

// ── ai-surface ────────────────────────────────────────────

const surfaceMeta: Meta = {
  title: "Visual/AiSurface",
  component: "ai-surface",
  tags: ["autodocs"],
};

export const SurfacePlayground: StoryObj = {
  args: {
    variant: "outlined",
    tone: "neutral",
    radius: "md",
    interactive: false,
  },
  render: (args) => html`
    <ai-surface
      variant=${args.variant ?? "flat"}
      tone=${args.tone ?? "neutral"}
      radius=${args.radius ?? "md"}
      ?interactive=${args.interactive ?? false}
    >
      <div style="padding: 12px;">Surface content</div>
    </ai-surface>
  `,
};
export const SurfaceMeta = surfaceMeta;

// ── ai-text ───────────────────────────────────────────────

const textMeta: Meta = {
  title: "Visual/AiText",
  component: "ai-text",
  tags: ["autodocs"],
};

export const TextPlayground: StoryObj = {
  args: {
    size: "body",
    weight: "normal",
    tone: "default",
    mono: false,
    truncate: false,
    inline: false,
  },
  render: (args) => html`
    <ai-text
      size=${args.size ?? "body"}
      weight=${args.weight ?? "normal"}
      tone=${args.tone ?? "default"}
      ?mono=${args.mono ?? false}
      ?truncate=${args.truncate ?? false}
      ?inline=${args.inline ?? false}
    >
      The quick brown fox jumps over the lazy dog.
    </ai-text>
  `,
};

export const TextSizes: StoryObj = {
  render: () => html`
    <ai-stack gap="xs">
      <ai-text size="caption">Caption — 0.75rem</ai-text>
      <ai-text size="meta">Meta — 0.8125rem</ai-text>
      <ai-text size="ui">UI — 0.875rem</ai-text>
      <ai-text size="body">Body — 1rem</ai-text>
      <ai-text size="title" weight="bold">Title — 1.125rem</ai-text>
      <ai-text size="display" weight="bold">Display — 1.375rem</ai-text>
    </ai-stack>
  `,
};

export const TextTones: StoryObj = {
  render: () => html`
    <ai-stack gap="xs">
      <ai-text tone="default">Default</ai-text>
      <ai-text tone="muted">Muted</ai-text>
      <ai-text tone="accent">Accent</ai-text>
      <ai-text tone="success">Success</ai-text>
      <ai-text tone="warning">Warning</ai-text>
      <ai-text tone="error">Error</ai-text>
    </ai-stack>
  `,
};
export const TextMeta = textMeta;

// ── ai-markdown ───────────────────────────────────────────

const markdownMeta: Meta = {
  title: "Visual/AiMarkdown",
  component: "ai-markdown",
  tags: ["autodocs"],
};

export const MarkdownPlayground: StoryObj = {
  args: {
    content:
      "## Heading\n\nThis is **markdown** with `inline code` and [links](https://example.com).\n\n- List item one\n- List item two\n\n```\nconst x = 42;\n```",
    tone: "assistant",
    trusted: false,
  },
  render: (args) => html`
    <ai-markdown
      .content=${args.content ?? ""}
      tone=${args.tone ?? "assistant"}
      ?trusted=${args.trusted ?? false}
    ></ai-markdown>
  `,
};
export const MarkdownMeta = markdownMeta;

// ── ai-badge ──────────────────────────────────────────────

const badgeMeta: Meta = {
  title: "Visual/AiBadge",
  component: "ai-badge",
  tags: ["autodocs"],
};

export const BadgePlayground: StoryObj = {
  args: {
    tone: "neutral",
    size: "md",
    dot: false,
  },
  render: (args) => html`
    <ai-badge
      tone=${args.tone ?? "neutral"}
      size=${args.size ?? "md"}
      ?dot=${args.dot ?? false}
    >
      label
    </ai-badge>
  `,
};

export const BadgesAll: StoryObj = {
  render: () => html`
    <ai-stack direction="row" gap="sm" align="center">
      <ai-badge>neutral</ai-badge>
      <ai-badge tone="accent">accent</ai-badge>
      <ai-badge tone="success">success</ai-badge>
      <ai-badge tone="warning">warning</ai-badge>
      <ai-badge tone="error">error</ai-badge>
      <ai-badge tone="info">info</ai-badge>
    </ai-stack>
  `,
};
export const BadgeMeta = badgeMeta;

// ── ai-status ─────────────────────────────────────────────

const statusMeta: Meta = {
  title: "Visual/AiStatus",
  component: "ai-status",
  tags: ["autodocs"],
};

export const StatusPlayground: StoryObj = {
  args: {
    state: "success",
    size: "md",
    variant: "dot",
  },
  render: (args) => html`
    <ai-status
      state=${args.state ?? "unknown"}
      size=${args.size ?? "md"}
      variant=${args.variant ?? "dot"}
    ></ai-status>
  `,
};

export const StatusAll: StoryObj = {
  render: () => html`
    <ai-stack direction="row" gap="lg" align="center">
      <ai-status state="idle"></ai-status>
      <ai-status state="running"></ai-status>
      <ai-status state="success"></ai-status>
      <ai-status state="error"></ai-status>
      <ai-status state="cancelled"></ai-status>
      <ai-status state="unknown"></ai-status>
    </ai-stack>
  `,
};
export const StatusMeta = statusMeta;

// ── ai-avatar ─────────────────────────────────────────────

const avatarMeta: Meta = {
  title: "Visual/AiAvatar",
  component: "ai-avatar",
  tags: ["autodocs"],
};

export const AvatarPlayground: StoryObj = {
  args: {
    name: "Ada Lovelace",
    size: "md",
    tone: "neutral",
  },
  render: (args) => html`
    <ai-avatar
      name=${args.name ?? ""}
      size=${args.size ?? "md"}
      tone=${args.tone ?? "neutral"}
    ></ai-avatar>
  `,
};
export const AvatarMeta = avatarMeta;

// ── ai-icon ───────────────────────────────────────────────

const iconMeta: Meta = {
  title: "Visual/AiIcon",
  component: "ai-icon",
  tags: ["autodocs"],
};

export const IconPlayground: StoryObj = {
  args: {
    size: "md",
    tone: "default",
  },
  render: (args) => html`
    <ai-icon
      size=${args.size ?? "md"}
      tone=${args.tone ?? "default"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
    </ai-icon>
  `,
};
export const IconMeta = iconMeta;

// ── ai-divider ────────────────────────────────────────────

const dividerMeta: Meta = {
  title: "Visual/AiDivider",
  component: "ai-divider",
  tags: ["autodocs"],
};

export const DividerPlayground: StoryObj = {
  args: {
    orientation: "horizontal",
    tone: "default",
  },
  render: (args) => html`
    <div style="width: 300px;">
      <ai-text>Before</ai-text>
      <ai-divider
        orientation=${args.orientation ?? "horizontal"}
        tone=${args.tone ?? "default"}
      ></ai-divider>
      <ai-text>After</ai-text>
    </div>
  `,
};
export const DividerMeta = dividerMeta;
