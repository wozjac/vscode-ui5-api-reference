"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const test_electron_1 = require("@vscode/test-electron");
async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = (0, path_1.resolve)(__dirname, "../");
        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath = (0, path_1.resolve)(__dirname, "./suite/index");
        const workdir = (0, path_1.resolve)(__dirname, "../../test-workdir");
        // Download VS Code, unzip it and run the integration test
        // Download VS Code, unzip it and run the integration test
        await (0, test_electron_1.runTests)({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [workdir],
        });
    }
    catch (err) {
        console.error("Failed to run tests");
        process.exit(1);
    }
}
main();
//# sourceMappingURL=runTest.js.map