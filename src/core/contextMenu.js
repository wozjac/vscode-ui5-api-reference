//Formats the namespace so we can use it for search
const getNamespace = (text, editor) => {
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

  xmlns = xmlns.includes(">") ? xmlns.slice(0, -1) : xmlns;
  let regex = new RegExp(
    namespace === "" ? "xmlns=\"(.*?)\"" : `xmlns:${namespace}="(.*?)\"`
  );

  xmlns = xmlns.match(regex)[0].match(/\"(.*?)\"/)[1];

  return `${xmlns}.${text}`;
};

const findControl = (editor) => {
  const isLowerCase = (string) => /^[a-z]*$/.test(string);

  const cursorPosition = editor.selection.active;
  let line = editor.document.lineAt(cursorPosition.line);
  let text = line.text.trim();

  if (text.includes("<")) {
    //If the first character after the < is lowercase, then it's an aggregation
    if (
      isLowerCase(text.charAt(1) === "/" ? text.charAt(2) : text.charAt(1)) &&
      isLowerCase(
        text.indexOf(":") === -1 ? true : text.charAt(text.indexOf(":") + 1)
      )
    ) {
      let foundControl = false;
      let count = 1;
      let navigator = text.charAt(1) === "/" ? "-" : "+";
      while (foundControl === false) {
        count =
          navigator === "+"
            ? cursorPosition.line - count
            : cursorPosition.line + count;
        line = editor.document.lineAt(count);
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
    let tagSplit = text.includes("</") ? "</" : "<";
    let endSplit = text.includes(" ") ? " " : text.includes(">") ? ">" : "\n";
    text = text.split(tagSplit)[1].split(endSplit)[0];
  } else {
    let count = cursorPosition.line - 1;
    text = "";
    while (!text) {
      line = editor.document.lineAt(count);
      text = line.text.trim();
      if (text.includes("<")) {
        let endSplit = text.includes(">")
          ? ">"
          : text.includes(" ")
          ? " "
          : "\n";
        text = text.split("<")[1].split(endSplit)[0];
      } else {
        count = count - 1;
      }
    }
  }
  text = text.includes(">") ? text.slice(0, -1) : text;
  return getNamespace(text, editor);
};

module.exports = {
  getNamespace,
  findControl,
};
