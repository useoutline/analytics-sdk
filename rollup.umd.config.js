import baseConfig from "./rollup.base.config.js";

export default {
  ...baseConfig,
  output: {
    file: "dist/useoutline-analytics.umd.js",
    format: "umd",
    name: "useoutline.analytics",
    compact: true,
  },
};
