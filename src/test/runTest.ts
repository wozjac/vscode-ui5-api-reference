import { resolve } from "path";
import { mkdirSync } from "fs";
import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = resolve(__dirname, "../");

    // The path to the extension test script
    // Passed to --extensionTestsPath
    const extensionTestsPath = resolve(__dirname, "./suite/index");

    const launchArgs = [];

    if (process.env.GITHUB_ACTIONS === "true" && process.platform !== "win32") {
      const vscodeCiBasePath = "/tmp/vsc-test";
      const userDataDir = resolve(vscodeCiBasePath, "user-data");
      const extensionsDir = resolve(vscodeCiBasePath, "extensions");

      mkdirSync(userDataDir, { recursive: true });
      mkdirSync(extensionsDir, { recursive: true });

      launchArgs.unshift(`--extensions-dir=${extensionsDir}`);
      launchArgs.unshift(`--user-data-dir=${userDataDir}`);
    }

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs,
    });
  } catch (err) {
    console.error(err);
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
