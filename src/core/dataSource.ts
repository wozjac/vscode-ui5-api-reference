import * as fs from "fs";
import * as https from "https";
import * as vscode from "vscode";

export interface TemplatePaths {
  webview: vscode.Uri;
  members: vscode.Uri;
  objectAPI: vscode.Uri;
}

export function readTemplates(templatePaths: TemplatePaths) {
  return {
    webview: readFileContent(templatePaths.webview),
    members: readFileContent(templatePaths.members),
    objectAPI: readFileContent(templatePaths.objectAPI),
  };
}

export async function fetchJSON(url: string): Promise<unknown> {
  let body = "";
  let result: unknown;

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

export function readFileContent(fileUri: vscode.Uri) {
  const file = fs.readFileSync(fileUri.fsPath, { encoding: "utf-8" });

  return file.toString();
}
