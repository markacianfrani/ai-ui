import type { ArgTypesEnhancer, Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components";
import customElements from "../src/custom-elements.json";
import "../src/index";

/*
 * Storybook's web-components Controls panel infers each arg's type from its
 * runtime value (e.g. `"success"` → `string` → a plain text box). The manifest's
 * string-literal unions (`"idle" | "running" | …`) never reach the Controls
 * panel, so enum props render as text inputs instead of dropdowns.
 *
 * This enhancer indexes every component's pure string-literal-union properties
 * from the manifest, then — for the current story's component — rewrites those
 * args to `{ name: "enum", value }`. It must run as a second-pass enhancer so
 * it executes *after* the framework's manifest-extracting `enhanceArgTypes`
 * (which otherwise leaves the raw union string as the arg type, falling
 * through to a JSON text control). With an enum type in place, the Controls
 * panel renders radio/select widgets.
 */
const STRING_UNION = /^\s*\|?\s*"[^"]*"(\s*\|\s*"[^"]*")*\s*$/;

const enumPropsByTag = new Map<string, Record<string, string[]>>();
for (const module of customElements.modules ?? []) {
  for (const decl of module.declarations ?? []) {
    const tag = decl.tagName;
    if (!tag) continue;
    const enums: Record<string, string[]> = {};
    for (const member of decl.members ?? []) {
      const text = member?.type?.text;
      if (typeof text !== "string" || !text.includes("|") || !STRING_UNION.test(text)) continue;
      const values = [...text.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
      if (values.length >= 2) enums[member.name] = values;
    }
    if (Object.keys(enums).length) enumPropsByTag.set(tag, enums);
  }
}

const inferEnumUnions: ArgTypesEnhancer = (context) => {
  const tag = typeof context.component === "string" ? context.component : undefined;
  const enums = tag ? enumPropsByTag.get(tag) : undefined;
  if (!enums) return context.argTypes;
  const argTypes = { ...context.argTypes };
  for (const [key, values] of Object.entries(enums)) {
    // Only override args the story actually exposes.
    if (!(key in (context.initialArgs ?? {}))) continue;
    argTypes[key] = {
      ...(argTypes[key] ?? {}),
      name: key,
      type: { name: "enum", value: values },
      options: values,
    };
  }
  return argTypes;
};
inferEnumUnions.secondPass = true;

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
  argTypesEnhancers: [inferEnumUnions],
};

export default preview;
