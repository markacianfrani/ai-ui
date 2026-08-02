import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiStatus",
  component: "ai-status",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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

export const All: Story = {
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
