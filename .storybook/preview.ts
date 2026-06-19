import type { Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components";
import { html } from "lit";
import customElements from "../src/custom-elements.json";
import "../src/index";

setCustomElementsManifest(customElements);

type ThemeName = "dark" | "light";

type ContextLike = {
  globals?: Record<string, unknown>;
  parameters?: {
    backgrounds?: {
      default?: string;
    };
  };
};

const getBackgroundValue = (backgrounds: unknown): string => {
  if (typeof backgrounds === "string") {
    return backgrounds;
  }
  if (backgrounds && typeof backgrounds === "object" && "value" in backgrounds) {
    const value = (backgrounds as { value?: unknown }).value;
    return typeof value === "string" ? value : "";
  }
  return "";
};

const getTheme = (context: ContextLike): ThemeName => {
  const toolbarTheme = context.globals?.theme;
  if (toolbarTheme === "light" || toolbarTheme === "dark") {
    return toolbarTheme;
  }

  const backgroundValue = getBackgroundValue(context.globals?.backgrounds);
  if (backgroundValue.includes("sand") || backgroundValue === "#faf8f5") {
    return "light";
  }
  if (backgroundValue.includes("mauve") || backgroundValue === "#1c1917") {
    return "dark";
  }

  return context.parameters?.backgrounds?.default === "light" ? "light" : "dark";
};

const applyTheme = (theme: ThemeName) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.storybookTheme = theme;
  document.body.dataset.storybookTheme = theme;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        title: "Theme",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "var(--color-mauve-900)" },
        {
          name: "light",
          value: "color-mix(in oklch, var(--color-sand-100) 58%, var(--color-sand-300))",
        },
      ],
    },
    docs: {
      source: {
        language: "html",
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = getTheme(context);
      applyTheme(theme);

      return html`
        <style>
          /*
           * Self-contained palette so this Storybook renders standalone, without
           * a host app's tokens.css. Mirrors the pi-ui palette the components
           * were designed against; override --ai-* tokens to skin differently.
           */
          :root {
            --color-mauve-100: oklch(88% 0.02 352deg);
            --color-mauve-300: oklch(63% 0.035 352deg);
            --color-mauve-500: oklch(40% 0.04 354deg);
            --color-mauve-700: oklch(25% 0.027 354deg);
            --color-mauve-900: oklch(18% 0.014 347deg);

            --color-sand-100: oklch(99% 0.003 95deg);
            --color-sand-300: oklch(93% 0.04 90deg);
            --color-sand-500: oklch(72% 0.032 76deg);
            --color-sand-700: oklch(52% 0.016 67deg);
            --color-sand-900: oklch(22% 0.007 67deg);

            --color-red-700: oklch(49.14% 0.186 19deg);

            --color-coral-500: oklch(58.5% 0.174 30.5deg);

            --color-amber-300: oklch(84.05% 0.124 93deg);
            --color-amber-700: oklch(54.23% 0.101 85deg);

            --color-green-500: oklch(58% 0.12 155deg);
            --color-green-700: oklch(43.75% 0.09 155deg);

            --color-cyan-300: oklch(80% 0.15 195deg);
            --color-cyan-700: oklch(55% 0.15 195deg);

            --color-blue-300: oklch(80% 0.12 250deg);
            --color-blue-700: oklch(48% 0.17 258deg);

            --font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --spacing-lg: 16px;

            --text-on-accent: var(--color-sand-100);
          }

          :root[data-storybook-theme="dark"] {
            color-scheme: dark;

            --bg: var(--color-mauve-900);
            --surface: color-mix(in oklch, var(--color-mauve-900) 45%, var(--color-mauve-700));
            --surface-hover: var(--color-mauve-700);
            --text: var(--color-sand-300);
            --text-muted: var(--color-sand-500);
            --border: color-mix(in oklch, var(--color-mauve-700) 65%, var(--color-mauve-500));
            --accent: var(--color-coral-500);
            --focus: var(--color-cyan-300);
            --success: var(--color-green-500);
            --warning: var(--color-amber-300);
            --error: var(--color-red-700);
            --info: var(--color-blue-300);
            --scrollbar-thumb: color-mix(in oklch, var(--color-mauve-700) 33%, var(--color-mauve-500));
          }

          :root[data-storybook-theme="light"] {
            color-scheme: light;

            --bg: color-mix(in oklch, var(--color-sand-100) 58%, var(--color-sand-300));
            --surface: var(--color-sand-100);
            --surface-hover: var(--color-sand-300);
            --text: var(--color-sand-900);
            --text-muted: var(--color-sand-700);
            --border: color-mix(in oklch, var(--color-sand-300) 43%, var(--color-sand-500));
            --accent: var(--color-coral-500);
            --focus: var(--color-cyan-700);
            --success: var(--color-green-700);
            --warning: var(--color-amber-700);
            --error: var(--color-red-700);
            --info: var(--color-blue-700);
            --scrollbar-thumb: var(--color-sand-500);
          }

          :root[data-storybook-theme] {
            --ai-color-background: var(--bg);
            --ai-color-surface: var(--surface);
            --ai-color-surface-raised: var(--surface-hover);
            --ai-color-text: var(--text);
            --ai-color-text-muted: var(--text-muted);
            --ai-color-border: var(--border);
            --ai-color-accent: var(--accent);
            --ai-color-on-accent: var(--text-on-accent);
            --ai-color-success: var(--success);
            --ai-color-warning: var(--warning);
            --ai-color-error: var(--error);
            --ai-color-info: var(--info);
          }

          html,
          body,
          .sb-show-main,
          #storybook-root,
          .sbdocs,
          .sbdocs-wrapper,
          .docs-story {
            background: var(--bg) !important;
            color: var(--text) !important;
          }

          body {
            font-family: var(--font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
          }

          .docs-story > div,
          .sb-story,
          .ai-storybook-canvas {
            background: var(--bg);
            color: var(--text);
          }

          .ai-storybook-canvas {
            min-height: 100vh;
            padding: var(--spacing-lg);
          }
        </style>
        <div class="ai-storybook-canvas" data-theme=${theme}>${story()}</div>
      `;
    },
  ],
};

export default preview;
