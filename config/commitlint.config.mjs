export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [1, "always", 120],
  },
  ignores: [
    (message) => {
      /^Bump \[.+]\(.+\) from .+ to .+\.$/m.test(message);
    },
  ],
};
