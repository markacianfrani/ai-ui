import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Visual/AiMarkdown",
  component: "ai-markdown",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
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
