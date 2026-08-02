import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiIcon",
  component: "ai-icon",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    size: "md",
    tone: "default",
  },
  render: (args) => html`
    <ai-icon size=${args.size ?? "md"} tone=${args.tone ?? "default"}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    </ai-icon>
  `,
};
