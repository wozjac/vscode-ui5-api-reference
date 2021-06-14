const vscode = require("vscode");
const APIReferenceProvider = require("./src/view/APIReferenceProvider");
const ui5ApiService = require("./src/core/ui5APIService");
const dataSource = require("./src/core/dataSource.js");
const constants = require("./src/core/constants.js");

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
        const findControl = () => {
          const isLowerCase = (string) => /^[a-z]*$/.test(string);

          //Formats the namespace so we can use it for search
          const getNamespace = (text) => {
            let namespace = text.includes(":") ? text.split(":")[0] : "";
            text = text.includes(":") ? text.split(":")[1] : text;
            let xmlns = editor.document
              .getText()
              .split("\n")
              .find((sLine) =>
                namespace === ""
                  ? sLine.includes("xmlns=")
                  : sLine.includes("xmlns") && sLine.includes(namespace)
              )
              .trim();

            xmlns = (xmlns.includes(">") ? xmlns.slice(0, -1) : xmlns).match(
              /\"(.*?)\"/
            )[1];

            return `${xmlns}.${text}`;
          };
          const cursorPosition = editor.selection.active;
          let text;
          let line = editor.document.lineAt(cursorPosition.line);
          if (line.text.includes("<")) {
            //If the first character after the < is lowercase, then it's an aggregation
            if (isLowerCase(line.text.trim().charAt(1))) {
              let foundControl = false;
              let count = 1;
              while (foundControl === false) {
                line = editor.document.lineAt(cursorPosition.line - count);
                if (
                  line.text.includes("<") &&
                  !isLowerCase(line.text.trim().charAt(1))
                ) {
                  foundControl = true;
                } else {
                  count++;
                }
              }
            }
            //just for good measure, check if it's the end tag
            let tagSplit = line.text.includes("</") ? "</" : "<";
            let endSplit = line.text.includes(" ")
              ? " "
              : line.text.includes(">")
              ? ">"
              : "\n";
            text = line.text.split(tagSplit)[1].split(endSplit)[0];
          } else {
            let count = cursorPosition.line - 1;
            while (!text) {
              line = editor.document.lineAt(count);
              if (line.text.includes("<")) {
                let endSplit = line.text.includes(">")
                  ? ">"
                  : line.text.includes(" ")
                  ? " "
                  : "\n";
                text = line.text.split("<")[1].split(endSplit)[0];
              } else {
                count = count - 1;
              }
            }
          }
          text = text.includes(">") ? text.slice(0, -1) : text;
          return getNamespace(text);
        };

        const input =
          editor.selection !== "" ? findControl() : editor.selection;
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
