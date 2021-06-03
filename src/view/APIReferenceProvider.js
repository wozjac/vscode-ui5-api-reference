const vscode = require("vscode");
const APIReferenceCtrl = require("./APIReferenceCtrl.js");
const Mustache = require("mustache");

class APIReferenceProvider {
  constructor(extensionUri, templates) {
    this._extensionUri = extensionUri;
    this._templates = templates;
  }

  resolveWebviewView(webviewView, context) {
    this._view = webviewView;
    this._apiReferenceCtrl = new APIReferenceCtrl(webviewView, this._templates);

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    const variables = {
      nonce: getNonce(),
      styleVSCodeUri: this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "vscode.css")),
      styleMainUri: this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "assets", "main.css")),
      jQueryScriptUri: this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src/view", "jquery.min.js")),
      mainScriptUri: this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src/view", "main.js")),
      cspSource: this._view.webview.cspSource
    };

    webviewView.webview.html = Mustache.render(this._templates.webview, variables);

    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case "search":
            this._apiReferenceCtrl.handleSearch(message);
            break;
          case "getDesignAPIHtml":
            this._apiReferenceCtrl.handleGetDesignAPIHtml(message);
            break;
          case "openURL":
            this._apiReferenceCtrl.handleOpenURL(message.url);
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  }

  triggerSearchCommand(input) {
    this._apiReferenceCtrl.triggerSearch(input);
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

module.exports = APIReferenceProvider;