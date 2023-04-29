import baseConfig from "./rollup.base.config.js";

export default {
  ...baseConfig,
  output: {
    file: "dist/useoutline-analytics.esm.js",
    format: "es",
    compact: true,
  },
};
