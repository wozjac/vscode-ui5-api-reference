import * as vscode from "vscode";
import { ApiReferenceProvider } from "./view/APIReferenceProvider";
import * as ui5ApiService from "./core/ui5ApiService";
import * as dataSource from "./core/dataSource";
import * as constants from "./core/constants.js";
import * as contextMenu from "./panelFeatures/contextMenu";
import * as favorites from "./panelFeatures/favorites";

export function activate(context: vscode.ExtensionContext) {
  const templatePaths = getTemplatePaths(context.extensionUri);
  const templates = dataSource.readTemplates(templatePaths);
  const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");
  const apiViewProvider = new ApiReferenceProvider(context.extensionUri, templates);

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
      if (editor) {
        const input = contextMenu.findControl(editor);

        if (input) {
          await vscode.commands.executeCommand("workbench.view.extension.ui5ApiReference");
          apiViewProvider.triggerSearchCommand(input.toString());
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-ui5-api-reference.searchAPI", async () => {
      const input = await vscode.window.showInputBox();
      if (input) {
        await vscode.commands.executeCommand("workbench.view.extension.ui5ApiReference");
        apiViewProvider.triggerSearchCommand(input);
      }
    })
  );

  const apiBaseUrl = configuration.get("apiURL") as string;
  ui5ApiService.setApiBaseURL(apiBaseUrl);

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

function getTemplatePaths(extensionUri: vscode.Uri) {
  return {
    webview: vscode.Uri.joinPath(extensionUri, "src/view/templates", "webview.html"),
    members: vscode.Uri.joinPath(extensionUri, "src/view/templates", "members.html"),
    objectAPI: vscode.Uri.joinPath(extensionUri, "src/view/templates", "objectAPI.html"),
  };
}
