const expect = require("chai").expect;
const contextMenu = require("../src/core/contextMenu");
const stubber = require("./support/stubber.js");
const vscode = require("vscode");
const path = require("path");

describe("Context Menu tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("Should find string sap.ui.core.Title", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view1.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(6, 14);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find string sap.m.Text", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view1.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(7, 14);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Text");
  });

  it("Should find string sap.m.App", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view1.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(5, 6);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.App");
  });

  it("Should find string sap.ui.core.Title", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view2.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(6, 28);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find string sap.ui.core.Title", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view2.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(7, 17);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find string sap.m.Text", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view2.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(8, 28);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Text");
  });

  it("Should find string sap.ui.core.Title", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view3.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(13, 18);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find string sap.m.Page", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view3.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(9, 18);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Page");
  });

  it("Should find string sap.m.App", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view3.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(8, 9);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.App");
  });

  it("Should find string sap.m.App", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view3.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(10, 9);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.App");
  });

  it("Should find string sap.m.Page", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "./support/editor/view3.xml")
    );
    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;

    var newPosition = position.with(9, 7);
    let newPosition2 = position.with(9, 11);
    var newSelection = new vscode.Selection(newPosition, newPosition2);
    editor.selection = newSelection;

    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Page");
  });
});
