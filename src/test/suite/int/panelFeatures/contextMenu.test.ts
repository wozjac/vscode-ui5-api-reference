import { expect } from "chai";
import * as contextMenu from "../../../../panelFeatures/contextMenu.js";
import * as stubber from "../../../support/stubber.js";
import * as vscode from "vscode";
import * as path from "path";

describe("Context Menu tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("Should find sap.ui.core.Title #1", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view1.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }
    const position = editor.selection.active;
    const newPosition = position.with(6, 14);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find sap.ui.core.Title #2", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view2.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(6, 28);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find sap.ui.core.Title #3", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view2.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(7, 17);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find sap.ui.core.Title #4", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view3.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(13, 18);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.ui.core.Title");
  });

  it("Should find sap.m.Page #1", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view3.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(9, 7);
    const newPosition2 = position.with(9, 11);
    const newSelection = new vscode.Selection(newPosition, newPosition2);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Page");
  });

  it("Should find sap.m.Page #2", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view3.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(9, 18);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Page");
  });

  it("Should find sap.m.App #1", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view3.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(8, 9);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.equal("sap.m.App");
  });

  it("Should find sap.m.App #2", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view3.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(10, 9);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.App");
  });

  it("Should find string sap.m.App #3", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view1.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(5, 6);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.App");
  });

  it("Should find sap.m.Text #1", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view2.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(8, 28);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Text");
  });

  it("Should find string sap.m.Text #2", async () => {
    const document = await vscode.workspace.openTextDocument(
      path.resolve(__dirname, "../../../support/editor/view1.xml")
    );

    await vscode.window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      expect.fail();
    }

    const position = editor.selection.active;
    const newPosition = position.with(7, 14);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    const out = contextMenu.findControl(editor);

    expect(out).to.deep.equal("sap.m.Text");
  });
});
