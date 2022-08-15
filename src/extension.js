const vscode = require("vscode");
const APIReferenceProvider = require("./view/APIReferenceProvider");
const ui5ApiService = require("./core/ui5ApiService");
const dataSource = require("./core/dataSource.js");
const constants = require("./core/constants.js");
const contextMenu = require("./panelFeatures/contextMenu");
const favorites = require("./panelFeatures/favorites");

function activate(context) {
  const templatePaths = getTemplatePaths(context.extensionUri);
  const templates = dataSource.readTemplates(templatePaths);
  const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");
  const apiViewProvider = new APIReferenceProvider(context.extensionUri, templates);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("ui5ApiReferenceView", apiViewProvider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-ui5-api-reference.showAPIView", async () => {
      await vscode.commands.executeCommand("workbench.view.extension.ui5ApiReference");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-ui5-api-reference.showAPIViewForValue", async () => {
      const editor = vscode.window.activeTextEditor;
      // Gets the entire string from namespace and control
      const input = editor.selection !== "" ? contextMenu.findControl(editor) : editor.selection;
      await vscode.commands.executeCommand("workbench.view.extension.ui5ApiReference");
      apiViewProvider.triggerSearchCommand(input);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-ui5-api-reference.searchAPI", async () => {
      const input = await vscode.window.showInputBox();
      await vscode.commands.executeCommand("workbench.view.extension.ui5ApiReference");
      apiViewProvider.triggerSearchCommand(input);
    })
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

  favorites.initialize(configuration);
}

function getTemplatePaths(extensionUri) {
  return {
    webview: vscode.Uri.joinPath(extensionUri, "src/view/templates", "webview.html"),
    members: vscode.Uri.joinPath(extensionUri, "src/view/templates", "members.html"),
    objectAPI: vscode.Uri.joinPath(extensionUri, "src/view/templates", "objectAPI.html"),
  };
}

module.exports = {
  activate,
};
