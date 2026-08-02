import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiAvatar",
  component: "ai-avatar",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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
