import type { Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components";
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
      codePanel: true,
      source: {
        language: "html",
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = getTheme(context);
      applyTheme(theme);

      // Render the story directly. The palette + theme CSS lives in
      // preview-head.html so Storybook's Source/Code capture shows only the
      // component markup, not the stylesheet shell.
      return story();
    },
  ],
};

export default preview;
