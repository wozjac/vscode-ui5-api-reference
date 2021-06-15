"use strict";
const path = require("path");
const vscode_test_1 = require("vscode-test");
async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../");
    // The path to the extension test script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");
    // Download VS Code, unzip it and run the integration test
    await vscode_test_1.runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}
main();
//# sourceMappingURL=runTest.js.map
