import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/web-components-vite";

// GitHub Pages project sites serve under /<repo>/ (e.g. /ai-ui/). Vite's default
// base is `./`, which works for relative asset paths, but setting it explicitly
// via STORYBOOK_BASE_PATH keeps deep links and asset URLs reliable.
const basePath = process.env.STORYBOOK_BASE_PATH ?? "./";

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.ts"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, { base: basePath });
  },
};

export default config;
