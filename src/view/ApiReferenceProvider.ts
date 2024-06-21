import * as vscode from "vscode";
import { ApiReferenceCtrl } from "./ApiReferenceController.js";
import Mustache from "mustache";
import { TemplatesContent } from "../core/dataSource.js";

export class ApiReferenceProvider {
  private extensionUri: vscode.Uri;
  private templates: TemplatesContent;
  private view: vscode.WebviewView | undefined;
  private apiReferenceCtrl: ApiReferenceCtrl | undefined;

  constructor(extensionUri: vscode.Uri, templates: TemplatesContent) {
    this.extensionUri = extensionUri;
    this.templates = templates;
  }

  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext) {
    this.view = webviewView;
    this.apiReferenceCtrl = new ApiReferenceCtrl(webviewView, this.templates);

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [this.extensionUri],
    };

    const variables = {
      nonce: getNonce(),
      styleVSCodeUri: this.view.webview.asWebviewUri(
        vscode.Uri.joinPath(this.extensionUri, "assets", "vscode.css")
      ),
      styleMainUri: this.view.webview.asWebviewUri(
        vscode.Uri.joinPath(this.extensionUri, "assets", "main.css")
      ),
      jQueryScriptUri: this.view.webview.asWebviewUri(
        vscode.Uri.joinPath(this.extensionUri, "src/view", "jquery.min.js")
      ),
      purifyScriptUri: this.view.webview.asWebviewUri(
        vscode.Uri.joinPath(this.extensionUri, "src/view", "purify.min.js")
      ),
      mainScriptUri: this.view.webview.asWebviewUri(
        vscode.Uri.joinPath(this.extensionUri, "src/view", "main.js")
      ),
      cspSource: this.view.webview.cspSource,
    };

    webviewView.webview.html = Mustache.render(this.templates.webview, variables);

    webviewView.webview.onDidReceiveMessage(
      (message) => {
        if (!this.apiReferenceCtrl) {
          throw new Error("UI5 Api Reference controller is not available");
        }

        switch (message.type) {
          case "search":
            this.apiReferenceCtrl.handleSearch(message);
            break;
          case "getDesignAPIHtml":
            this.apiReferenceCtrl.handleGetDesignAPIHtml(message);
            break;
          case "openURL":
            this.apiReferenceCtrl.handleOpenURL(message.url);
            break;
          case "changeFavorite":
            this.apiReferenceCtrl.handleChangeFavorite(message);
            break;
        }
      },
      undefined
      // context.subscriptions
    );

    this.apiReferenceCtrl.triggerWebviewResolved();
  }

  triggerSearchCommand(input: string) {
    if (!this.apiReferenceCtrl) {
      throw new Error("UI5 Api Reference controller is not available");
    }

    this.apiReferenceCtrl.triggerSearch(input);
  }
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
