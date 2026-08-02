import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiSurface",
  component: "ai-surface",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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
