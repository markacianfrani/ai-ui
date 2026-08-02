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

/** @type {import("@custom-elements-manifest/analyzer").Plugin} */
const excludePrivateMembers = {
  name: "exclude-private-members",
  packageLinkPhase({ customElementsManifest: manifest }) {
    // The manifest describes a component's PUBLIC API. Private fields, getters,
    // and methods (e.g. an internal HasSlotController, computed `tone`, etc.)
    // are implementation details and must not leak into the manifest — otherwise
    // they surface in Storybook's Properties table, IDE autocomplete, and any
    // other manifest consumer as if they were part of the public surface.
    for (const module of manifest.modules ?? []) {
      for (const decl of module.declarations ?? []) {
        if (Array.isArray(decl.members)) {
          decl.members = decl.members.filter((member) => member.privacy !== "private");
        }
      }
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
  plugins: [excludeStories, excludePrivateMembers],
};
