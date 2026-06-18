/** @type {import("@custom-elements-manifest/analyzer").Plugin} */
const excludeStories = {
  name: "exclude-stories",
  moduleLinkPhase({ moduleDoc }) {
    // Story files aren't custom elements — clear their declarations/exports
    // so they don't pollute the manifest.
    if (moduleDoc.path?.includes(".stories.")) {
      moduleDoc.declarations = [];
      moduleDoc.exports = [];
    }
  },
};

export default {
  globs: ["src/**/*.ts"],
  exclude: [
    "src/index.ts",
    "src/native-styles.ts",
    "src/**/*.test.ts",
    "src/stories/**",
  ],
  outdir: "src",
  litelement: true,
  packagejson: false,
  plugins: [excludeStories],
};
