const fs = require("fs");
const https = require("https");

function readFileContent(fileUri) {
  const file = fs.readFileSync(fileUri.fsPath, { encoding: "UTF-8" });
  return file.toString();
}

function readTemplates(templatePaths) {
  return {
    webview: readFileContent(templatePaths.webview),
    members: readFileContent(templatePaths.members),
    objectAPI: readFileContent(templatePaths.objectAPI),
  };
}

async function fetchJSON(url) {
  let body = "";
  let result;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          result = JSON.parse(body);
        } catch (err) {
          reject(err);
        }
        resolve(result);
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
  });
}

module.exports = {
  readTemplates,
  fetchJSON,
};
