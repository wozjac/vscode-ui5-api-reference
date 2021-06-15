const vscode = require("vscode");
const APIReferenceProvider = require("./src/view/APIReferenceProvider");
const ui5ApiService = require("./src/core/ui5APIService");
const dataSource = require("./src/core/dataSource.js");
const constants = require("./src/core/constants.js");
const contextMenu = require("./src/core/contextMenu");

function activate(context) {
  const templatePaths = getTemplatePaths(context.extensionUri);
  const templates = dataSource.readTemplates(templatePaths);
  const configuration = vscode.workspace.getConfiguration("");
  const apiViewProvider = new APIReferenceProvider(
    context.extensionUri,
    templates
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "ui5ApiReferenceView",
      apiViewProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-ui5-api-reference.showAPIView",
      async () => {
        await vscode.commands.executeCommand(
          "workbench.view.extension.ui5ApiReference"
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-ui5-api-reference.showAPIViewForValue",
      async () => {
        const editor = vscode.window.activeTextEditor;
        // Gets the entire string from namespace and control

        const input =
          editor.selection !== ""
            ? contextMenu.findControl(editor)
            : editor.selection;
        await vscode.commands.executeCommand(
          "workbench.view.extension.ui5ApiReference"
        );
        apiViewProvider.triggerSearchCommand(input);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-ui5-api-reference.searchAPI",
      async () => {
        const input = await vscode.window.showInputBox();
        await vscode.commands.executeCommand(
          "workbench.view.extension.ui5ApiReference"
        );
        apiViewProvider.triggerSearchCommand(input);
      }
    )
  );

  const apiBaseUrl = configuration.get("apiURL");
  ui5ApiService.setAPIBaseURL(apiBaseUrl);

  ui5ApiService
    .loadUi5Objects()
    .then(() => {
      return ui5ApiService.loadUi5LibrariesDesignApi();
    })
    .catch((error) => {
      console.error(`${constants.pluginLogPrefix} ${error}`);
    });
}

function getTemplatePaths(extensionUri) {
  return {
    webview: vscode.Uri.joinPath(
      extensionUri,
      "src/view/templates",
      "webview.html"
    ),
    members: vscode.Uri.joinPath(
      extensionUri,
      "src/view/templates",
      "members.html"
    ),
    objectAPI: vscode.Uri.joinPath(
      extensionUri,
      "src/view/templates",
      "objectAPI.html"
    ),
  };
}

module.exports = {
  activate,
};
