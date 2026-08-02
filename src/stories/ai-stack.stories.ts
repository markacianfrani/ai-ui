import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiStack",
  component: "ai-stack",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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

export const Row: Story = {
  render: () => html`
    <ai-stack direction="row" gap="sm" align="center">
      <ai-badge tone="success">pass</ai-badge>
      <ai-text size="meta">42 tests</ai-text>
    </ai-stack>
  `,
};
