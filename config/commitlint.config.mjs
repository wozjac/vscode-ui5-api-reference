export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [2, "always", 120],
  },
  ignores: [
    (message) => {
      /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message);
    },
  ],
};
