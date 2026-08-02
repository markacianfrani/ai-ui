import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiText",
  component: "ai-text",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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

export const Sizes: Story = {
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

export const Tones: Story = {
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
