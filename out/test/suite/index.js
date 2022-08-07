"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const path = require("path");
const Mocha = require("mocha");
const glob = require("glob");
const doCoverage = false;
function setupCoverage() {
    const NYC = require("nyc");
    const nyc = new NYC({
        cwd: path.join(__dirname, "..", ".."),
        exclude: ["**/test/**", ".vscode-test/**"],
        reporter: ["lcov"],
        all: true,
        instrument: true,
        hookRequire: true,
        hookRunInContext: true,
        hookRunInThisContext: true,
    });
    nyc.reset();
    nyc.wrap();
    return nyc;
}
async function run() {
    const nyc = doCoverage ? setupCoverage() : null;
    const mocha = new Mocha({
        ui: "bdd",
        color: true,
        timeout: 10 * 1000,
    });
    const testsRoot = path.resolve(__dirname, "..");
    const files = glob.sync("**/*.test.js", { cwd: testsRoot });
    console.log(files);
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));
    try {
        await new Promise((resolve, reject) => mocha.run((failures) => failures ? reject(new Error(`${failures} tests failed`)) : resolve(undefined)));
    }
    finally {
        if (nyc) {
            nyc.writeCoverageFile();
            await nyc.report();
        }
    }
}
exports.run = run;
//# sourceMappingURL=index.js.map