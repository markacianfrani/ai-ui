import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../ai";

const ROLES = ["user", "assistant", "system", "tool"] as const;
const STATUSES = ["pending", "running", "success", "error", "cancelled", "unknown"] as const;

const meta: Meta = {
  title: "Semantic/AiMessage",
  component: "ai-message",
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: ROLES,
    },
    status: {
      control: "select",
      options: STATUSES,
    },
  },
};

export default meta;
type Story = StoryObj;

export const UserMessage: Story = {
  args: {
    role: "user",
    timestamp: "2026-06-03T18:30:00.000Z",
  },
  render: (args) => html`
    <ai-message role=${args.role ?? "assistant"} timestamp=${args.timestamp ?? ""}>
      <ai-markdown tone="user" content="Can you inspect the project and run tests?"></ai-markdown>
      <time slot="meta" datetime=${args.timestamp ?? ""}>6:30 PM</time>
    </ai-message>
  `,
};

export const AssistantMessage: Story = {
  args: {
    role: "assistant",
    timestamp: "2026-06-03T18:30:04.000Z",
  },
  render: (args) => html`
    <ai-message role=${args.role ?? "assistant"} timestamp=${args.timestamp ?? ""}>
      <ai-markdown content="I'll inspect the repository, then run the focused checks."></ai-markdown>
      <time slot="meta" datetime=${args.timestamp ?? ""}>6:30 PM</time>
    </ai-message>
  `,
};

export const ToolMessage: Story = {
  args: {
    role: "tool",
    for: "read-1",
    timestamp: "2026-06-03T18:30:06.000Z",
  },
  render: (args) => html`
    <ai-message role=${args.role ?? "tool"} for=${args.for ?? ""} timestamp=${args.timestamp ?? ""}>
      <ai-tool-result for=${args.for ?? ""} name="read" status="success" content="export const config = { port: 3000 };"></ai-tool-result>
      <time slot="meta" datetime=${args.timestamp ?? ""}>6:30 PM</time>
    </ai-message>
  `,
};

export const RunningAssistant: Story = {
  args: {
    role: "assistant",
    status: "running",
  },
  render: (args) => html`
    <ai-message role=${args.role ?? "assistant"} status=${args.status ?? "unknown"}>
      <ai-tool-call id="bash-1" name="bash" headline="bun test" status="running" open>
        <ai-tool-result for="bash-1" name="bash" status="unknown" content="Running..."></ai-tool-result>
      </ai-tool-call>
    </ai-message>
  `,
};
