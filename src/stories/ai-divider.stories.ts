import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiDivider",
  component: "ai-divider",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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
