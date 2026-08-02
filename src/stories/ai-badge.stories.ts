import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiBadge",
  component: "ai-badge",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    tone: "neutral",
    size: "md",
    dot: false,
  },
  render: (args) => html`
    <ai-badge tone=${args.tone ?? "neutral"} size=${args.size ?? "md"} ?dot=${args.dot ?? false}>
      label
    </ai-badge>
  `,
};

export const All: Story = {
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
