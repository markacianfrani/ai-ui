import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Semantic/AiEvent",
  component: "ai-event",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    kind: "status",
    severity: "info",
    source: "",
    open: true,
  },
  render: (args) => html`
    <ai-event
      kind=${args.kind ?? "custom"}
      severity=${args.severity ?? "info"}
      source=${args.source ?? ""}
      ?open=${args.open ?? false}
    >
      Session restored from checkpoint.
    </ai-event>
  `,
};

export const ConversationCompacted: Story = {
  render: () => html`
    <ai-event kind="checkpoint" severity="info" open>
      <span slot="summary">Conversation compacted</span>
      <span slot="meta">manual · tokens: 17,375 → 732</span>
      <ol>
        <li>
          <strong>Primary request and intent</strong>
          <ul>
            <li>Export the current conversation to HTML.</li>
            <li>Summarize the transcript with text-only output.</li>
          </ul>
        </li>
        <li>
          <strong>Key technical concepts</strong>
          <ul>
            <li>Session JSONL transcript files</li>
            <li>Export helper script</li>
          </ul>
        </li>
      </ol>
    </ai-event>
  `,
};

export const ModelChange: Story = {
  render: () => html`
    <ai-event kind="model-change" severity="info">
      <span slot="summary">Switched model</span>
      <span slot="meta">claude-sonnet-4</span>
    </ai-event>
  `,
};

export const ErrorEvent: Story = {
  render: () => html`
    <ai-event kind="error" severity="error" open> Connection lost. Reconnecting... </ai-event>
  `,
};

export const Warning: Story = {
  render: () => html`
    <ai-event kind="note" severity="warning" open> Approaching token limit. </ai-event>
  `,
};
