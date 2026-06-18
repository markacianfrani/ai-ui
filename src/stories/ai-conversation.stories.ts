import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Semantic/AiConversation",
  component: "ai-conversation",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SimpleConversation: Story = {
  render: () => html`
    <ai-conversation>
      <ai-message role="user" timestamp="2026-06-03T18:30:00.000Z">
        <ai-markdown tone="user" content="Can you read the file at \`src/config.ts\`?"></ai-markdown>
        <time slot="meta" datetime="2026-06-03T18:30:00.000Z">6:30 PM</time>
      </ai-message>
      <ai-message role="assistant" timestamp="2026-06-03T18:30:04.000Z">
        <ai-markdown content="Sure, let me take a look at that file."></ai-markdown>
        <ai-tool-call id="read-1" name="read" headline="src/config.ts" status="success" open>
          <pre slot="input">src/config.ts</pre>
          <ai-tool-result
            for="read-1"
            name="read"
            status="success"
            content='{"text":"export const config = { port: 3000 };"}'
          ></ai-tool-result>
        </ai-tool-call>
        <time slot="meta" datetime="2026-06-03T18:30:04.000Z">6:30 PM</time>
      </ai-message>
    </ai-conversation>
  `,
};

export const Playground: Story = {
  args: {
    density: "comfortable",
    live: false,
  },
  render: (args) => html`
    <ai-conversation
      density=${args.density ?? "comfortable"}
      ?live=${args.live ?? false}
    >
      <ai-message role="user">
        <ai-markdown tone="user" content="Hello, how are you?"></ai-markdown>
      </ai-message>
      <ai-message role="assistant">
        <ai-markdown content="I'm doing well! How can I help?"></ai-markdown>
      </ai-message>
    </ai-conversation>
  `,
};

export const Compact: Story = {
  render: () => html`
    <ai-conversation density="compact">
      <ai-message role="user"><ai-markdown tone="user" content="Hello"></ai-markdown></ai-message>
      <ai-message role="assistant"><ai-markdown content="Hi there!"></ai-markdown></ai-message>
      <ai-message role="user"><ai-markdown tone="user" content="Thanks"></ai-markdown></ai-message>
    </ai-conversation>
  `,
};

export const Live: Story = {
  render: () => html`
    <ai-conversation live>
      <ai-message role="assistant" status="running">
        <ai-thinking .content=${"I need to inspect the latest logs before answering."} open></ai-thinking>
        <ai-tool-call id="bash-1" name="bash" headline="tail -20 server.log" status="running" open></ai-tool-call>
      </ai-message>
    </ai-conversation>
  `,
};
