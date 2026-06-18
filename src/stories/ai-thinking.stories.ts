import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const thinkingText =
  "The user is asking about TypeScript generics. I should explain covariance and contravariance with practical examples that relate to their codebase.";

const meta: Meta = {
  title: "Semantic/AiThinking",
  component: "ai-thinking",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const frame = (content: unknown) => html`
  <div style="max-width: 360px; margin: 0 auto;">
    <ai-conversation>
      <ai-message role="assistant">
        ${content}
      </ai-message>
    </ai-conversation>
  </div>
`;

export const Closed: Story = {
  args: {
    source: "model",
    open: false,
    redacted: false,
  },
  render: (args) =>
    frame(html`
    <ai-thinking
      source=${args.source ?? "unknown"}
      ?open=${args.open ?? false}
      ?redacted=${args.redacted ?? false}
      .content=${thinkingText}
    ></ai-thinking>
  `),
};

export const Open: Story = {
  args: {
    source: "model",
    open: true,
    redacted: false,
  },
  render: (args) =>
    frame(html`
    <ai-thinking
      source=${args.source ?? "unknown"}
      ?open=${args.open ?? false}
      ?redacted=${args.redacted ?? false}
      .content=${thinkingText}
    ></ai-thinking>
  `),
};

export const Redacted: Story = {
  args: {
    source: "model",
    redacted: true,
  },
  render: (args) =>
    frame(html`
    <ai-thinking
      source=${args.source ?? "unknown"}
      ?redacted=${args.redacted ?? false}
    ></ai-thinking>
  `),
};
