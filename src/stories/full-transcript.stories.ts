import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "..";

const meta: Meta = {
  title: "Examples/FullTranscript",
  component: "ai-conversation",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const MessageFirst: Story = {
  render: () => html`
    <ai-conversation label="Example transcript">
      <ai-message role="user" timestamp="2026-06-03T18:00:00.000Z">
        <ai-markdown tone="user" content="Can you inspect the project and run tests?"></ai-markdown>
        <time slot="meta" datetime="2026-06-03T18:00:00.000Z">6:00 PM</time>
      </ai-message>

      <ai-message role="assistant" timestamp="2026-06-03T18:00:03.000Z">
        <ai-markdown content="I’ll inspect the repository, then run the focused checks."></ai-markdown>
        <ai-thinking
          content="I should first identify package scripts, then choose the smallest validation command."
          open
        ></ai-thinking>
        <ai-tool-call id="read-package" name="read" headline="package.json" status="success" open>
          <ai-tool-result
            for="read-package"
            name="read"
            status="success"
            content='{"text":"scripts: check, lint, test, analyze"}'
          ></ai-tool-result>
        </ai-tool-call>
        <ai-tool-call id="run-tests" name="bash" headline="bun test src/" status="running" open>
          <pre slot="input">bun test src/</pre>
          <ai-tool-result
            for="run-tests"
            name="bash"
            channel="stdout"
            content="42 tests passing…"
          ></ai-tool-result>
        </ai-tool-call>
        <time slot="meta" datetime="2026-06-03T18:00:03.000Z">6:00 PM</time>
      </ai-message>

      <ai-event kind="checkpoint" severity="info" open>
        <span slot="summary">Checkpoint saved</span>
        <span>Before message-first migration.</span>
      </ai-event>

      <ai-message role="tool" for="run-tests" timestamp="2026-06-03T18:00:08.000Z">
        <ai-tool-result
          for="run-tests"
          name="bash"
          status="success"
          content="All tests passed."
        ></ai-tool-result>
        <time slot="meta" datetime="2026-06-03T18:00:08.000Z">6:00 PM</time>
      </ai-message>
    </ai-conversation>
  `,
};

export const ConversationCompactedInAssistant: Story = {
  render: () => html`
    <div style="max-width: 820px; padding: 24px; background: var(--bg); color: var(--text)">
      <ai-conversation label="Compaction event in assistant message">
        <ai-message role="assistant" timestamp="2026-06-17T12:00:00.000Z">
          <ai-markdown
            content="I’ll run the export, then check the generated transcript."
          ></ai-markdown>
          <ai-tool-call
            id="run-export"
            name="bash"
            headline="node /home/god/.claude/skills/export/scripts/export-current.js"
            status="success"
          >
            <ai-tool-result
              for="run-export"
              name="bash"
              status="success"
              content="Updated! Exported to: /home/god/code/armor/whatup-66df4e86.html (162 KB)"
            ></ai-tool-result>
          </ai-tool-call>
          <ai-event kind="checkpoint" severity="info">
            <span slot="summary">Conversation compacted</span>
            <span slot="meta">manual · tokens: 17,375 → 732</span>
            <ol>
              <li>
                <strong>Primary request and intent</strong>
                <ul>
                  <li>User requested export of the current conversation to HTML.</li>
                  <li>User requested a detailed summary with text-only output.</li>
                </ul>
              </li>
            </ol>
          </ai-event>
          <ai-tool-call
            id="inspect-export"
            name="read"
            headline="/home/god/code/armor/whatup-66df4e86.html"
            status="success"
          >
            <ai-tool-result
              for="inspect-export"
              name="read"
              status="success"
              content="HTML transcript found."
            ></ai-tool-result>
          </ai-tool-call>
          <ai-event kind="checkpoint" severity="info" open>
            <span slot="summary">Conversation compacted</span>
            <span slot="meta">manual · tokens: 17,375 → 732</span>
            <ol>
              <li>
                <strong>Primary request and intent</strong>
                <ul>
                  <li>User requested export of the current conversation to HTML.</li>
                  <li>User requested a detailed summary with text-only output.</li>
                </ul>
              </li>
              <li>
                <strong>Key technical concepts</strong>
                <ul>
                  <li>Session JSONL transcript files</li>
                  <li>Bundled helper script</li>
                </ul>
              </li>
            </ol>
          </ai-event>
        </ai-message>
      </ai-conversation>
    </div>
  `,
};

export const EventStatesInContext: Story = {
  render: () => html`
    <div style="max-width: 820px; padding: 24px; background: var(--bg); color: var(--text)">
      <ai-conversation label="Event states in tool context">
        <ai-message role="assistant" timestamp="2026-06-17T12:00:00.000Z">
          <ai-markdown
            content="Here’s how transcript events sit between ordinary tool rows."
          ></ai-markdown>
          <ai-tool-call
            id="state-bash"
            name="bash"
            headline="bun run check"
            status="success"
          ></ai-tool-call>

          <ai-event kind="status" severity="info">
            <span slot="summary">Session restored</span>
            <span slot="meta">local snapshot</span>
          </ai-event>
          <ai-event kind="model-change" severity="info">
            <span slot="summary">Model switched</span>
            <span slot="meta">sonnet → opus</span>
          </ai-event>
          <ai-event kind="checkpoint" severity="info">
            <span slot="summary">Conversation compacted</span>
            <span slot="meta">manual · tokens: 17,375 → 732</span>
          </ai-event>
          <ai-event kind="note" severity="warning" open>
            <span slot="summary">Context budget high</span>
            <span slot="meta">82% used</span>
            <span>Older tool results may be summarized soon.</span>
          </ai-event>
          <ai-event kind="error" severity="error" open>
            <span slot="summary">Connection interrupted</span>
            <span slot="meta">retrying</span>
            <span>Reconnecting to the session stream.</span>
          </ai-event>
          <ai-event kind="system" severity="info">
            <span slot="summary">Runtime notice</span>
            <span slot="meta">server</span>
          </ai-event>
          <ai-event kind="custom" severity="info">
            <span slot="summary">Custom event</span>
            <span slot="meta">extension</span>
          </ai-event>

          <ai-tool-call
            id="state-read"
            name="read"
            headline="src/frontend/components/ai/semantic/ai-event.ts"
            status="success"
          ></ai-tool-call>
        </ai-message>
      </ai-conversation>
    </div>
  `,
};

export const Streaming: Story = {
  render: () => html`
    <ai-conversation live label="Streaming transcript">
      <ai-message role="assistant" status="running">
        <ai-thinking
          content="Need to preserve current live thinking disclosure behavior."
          open
        ></ai-thinking>
        <ai-tool-call id="streaming-bash" name="bash" headline="bun run check" status="running" open>
          <ai-tool-result
            for="streaming-bash"
            name="bash"
            channel="stdout"
            content="Checking…"
          ></ai-tool-result>
        </ai-tool-call>
        <ai-markdown content="I’m checking the refactor now…"></ai-markdown>
      </ai-message>
    </ai-conversation>
  `,
};
