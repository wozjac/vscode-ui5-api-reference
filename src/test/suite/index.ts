import * as path from "path";
import Mocha from "mocha";
import * as glob from "glob";

const doCoverage = true;

function setupCoverage() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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

export async function run() {
  const nyc = doCoverage ? setupCoverage() : null;

  const mocha = new Mocha({
    ui: "bdd",
    color: true,
    timeout: 10 * 1000,
  });

  const testsRoot = path.resolve(__dirname, "..");
  const files = glob.sync("**/*.test.js", { cwd: testsRoot });

  files.forEach((file) => {
    mocha.addFile(path.resolve(testsRoot, file));
  });

  try {
    await new Promise((resolve, reject) => {
      mocha.run((failures) => {
        failures ? reject(new Error(`${failures} tests failed`)) : resolve(undefined);
      });
    });
  } finally {
    if (nyc) {
      nyc.writeCoverageFile();
      await nyc.report();
    }
  }
}
