import { TextEditor, TextDocument } from "vscode";

//Formats the namespace so we can use it for search
export function getNamespace(text: string, document: TextDocument): string | undefined {
  const namespace = text.includes(":") ? text.split(":")[0] : "";
  text = text.includes(":") ? text.split(":")[1] : text;
  const documentText = document.getText();

  if (!documentText) {
    return;
  }

  const documentTextLines = documentText.split("\n");

  let xmlns = documentTextLines
    .find((line: string) => {
      return namespace === ""
        ? line.includes("xmlns=")
        : line.includes("xmlns") && line.includes(namespace);
    })
    ?.trim();

  if (!xmlns) {
    return;
  }

  xmlns = xmlns.includes(">") ? xmlns.slice(0, -1) : xmlns;
  const regex = new RegExp(namespace === "" ? `xmlns="(.*?)"` : `xmlns:${namespace}="(.*?)"`);
  let matchResult = xmlns.match(regex);

  if (!matchResult) {
    return;
  }

  const match = matchResult[0];
  // eslint-disable-next-line
  matchResult = match.match(/\"(.*?)\"/);

  if (!matchResult) {
    return;
  }

  xmlns = matchResult[1];

  return `${xmlns}.${text}`;
}

export function findControl(editor: TextEditor): string | undefined {
  const isLowerCase = (input: string) => {
    return /^[a-z]*$/.test(input);
  };

  const cursorPosition = editor.selection.active;
  const document = editor.document;
  let line = document.lineAt(cursorPosition.line);
  let text = line.text.trim();

  if (text.includes("<")) {
    //If the first character after the < is lowercase, then it's an aggregation
    if (
      isLowerCase(text.charAt(1) === "/" ? text.charAt(2) : text.charAt(1)) &&
      text.indexOf(":") === -1
        ? true
        : isLowerCase(text.charAt(text.indexOf(":") + 1))
    ) {
      let foundControl = false;
      let count = 1;
      const navigator = text.charAt(1) === "/" ? "-" : "+";

      while (foundControl === false) {
        count = navigator === "+" ? cursorPosition.line - count : cursorPosition.line + count;
        line = document.lineAt(count);
        text = line.text.trim();
        if (
          text.includes("<") &&
          !isLowerCase(text.charAt(1) === "/" ? text.charAt(2) : text.charAt(1))
        ) {
          foundControl = true;
        } else {
          count++;
        }
      }
    }

    //just for good measure, check if it's the end tag
    const tagSplit = text.includes("</") ? "</" : "<";
    const endSplit = text.includes(" ") ? " " : text.includes(">") ? ">" : "\n";
    text = text.split(tagSplit)[1].split(endSplit)[0];
  } else {
    let count = cursorPosition.line - 1;
    text = "";

    while (!text) {
      line = editor.document.lineAt(count);
      text = line.text.trim();

      if (text.includes("<")) {
        const endSplit = text.includes(">") ? ">" : text.includes(" ") ? " " : "\n";
        text = text.split("<")[1].split(endSplit)[0];
      } else {
        count = count - 1;
      }
    }
  }

  text = text.includes(">") ? text.slice(0, -1) : text;

  return getNamespace(text, document);
}
