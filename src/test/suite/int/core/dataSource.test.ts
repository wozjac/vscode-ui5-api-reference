import { expect } from "chai";
import * as dataSource from "../../../../core/dataSource";
import * as stubber from "../../../support/stubber";
import * as vscode from "vscode";
import * as path from "path";

describe("dataSource tests", () => {
  it("should return all template paths", () => {
    const fixturePath = path.resolve(__dirname, "../../../support/fixtures/template.html");
    const templatePath = vscode.Uri.parse(fixturePath);

    const templates = dataSource.readTemplates({
      webview: templatePath,
      members: templatePath,
      objectAPI: templatePath,
    });

    expect(templates.webview).to.equal("abc");
    expect(templates.members).to.equal("abc");
    expect(templates.objectAPI).to.equal("abc");
  });
});
