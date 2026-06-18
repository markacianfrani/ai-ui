import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Semantic/AiToolCall",
  component: "ai-tool-call",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <ai-conversation>
      <ai-message role="assistant">
        <ai-tool-call id="read" name="read" headline="src/frontend/chat-view.ts" status="success" open>
          <ai-tool-result
            for="read"
            name="read"
            status="success"
            content="Loaded 120 lines."
          ></ai-tool-result>
        </ai-tool-call>
        <ai-tool-call id="bash" name="bash" headline="bun test src/" status="running" open>
          <pre slot="input">bun test src/</pre>
          <ai-tool-result
            for="bash"
            name="bash"
            status="unknown"
            channel="stdout"
            content="Running tests…"
          ></ai-tool-result>
        </ai-tool-call>
        <ai-tool-call
          id="edit"
          name="edit"
          headline="ai-message.ts"
          subline="src/frontend/components/ai/semantic/ai-message.ts"
          status="error"
        >
          <ai-tool-result
            for="edit"
            name="edit"
            status="error"
            content='{"error":"Patch did not apply"}'
          ></ai-tool-result>
        </ai-tool-call>
      </ai-message>
    </ai-conversation>
  `,
};

export const Playground: Story = {
  args: {
    id: "playground-1",
    name: "read",
    headline: "src/config.ts",
    subline: "",
    status: "success",
    open: true,
  },
  render: (args) => html`
    <ai-conversation>
      <ai-message role="assistant">
        <ai-tool-call
          id=${args.id ?? ""}
          name=${args.name ?? ""}
          headline=${args.headline ?? ""}
          subline=${args.subline ?? ""}
          status=${args.status ?? "unknown"}
          ?open=${args.open ?? false}
        >
          <pre slot="input">src/config.ts</pre>
          <ai-tool-result for=${args.id ?? ""} name=${args.name ?? ""} status="success" content="export const config = { port: 3000 };"></ai-tool-result>
        </ai-tool-call>
      </ai-message>
    </ai-conversation>
  `,
};

export const CustomSummary: Story = {
  render: () => html`
    <ai-tool-call id="custom" name="custom" status="success" open>
      <div slot="summary">Custom summary slot</div>
      <ai-tool-result for="custom" content="Custom result content"></ai-tool-result>
    </ai-tool-call>
  `,
};
