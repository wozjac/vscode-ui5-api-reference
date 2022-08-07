"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findControl = exports.getNamespace = void 0;
//Formats the namespace so we can use it for search
function getNamespace(text, editor) {
    const namespace = text.includes(":") ? text.split(":")[0] : "";
    text = text.includes(":") ? text.split(":")[1] : text;
    const textDocument = editor.document;
    if (!textDocument) {
        return;
    }
    const editorText = textDocument.getText();
    if (!editorText) {
        return;
    }
    const lines = editorText.split("\n");
    let xmlns = lines.find((line) => {
        return namespace === ""
            ? line.includes("xmlns=")
            : line.includes("xmlns") && line.includes(namespace);
    });
    if (!xmlns) {
        return;
    }
    xmlns.trim();
    xmlns = xmlns.includes(">") ? xmlns.slice(0, -1) : xmlns;
    const regex = new RegExp(namespace === "" ? `xmlns="(.*?)"` : `xmlns:${namespace}="(.*?)\"`);
    const matches = xmlns.match(regex);
    if (!matches) {
        return;
    }
    const match = matches[0].match(/\"(.*?)\"/);
    if (!match) {
        return;
    }
    xmlns = match[1];
    return `${xmlns}.${text}`;
}
exports.getNamespace = getNamespace;
function findControl(editor) {
    const isLowerCase = (str) => {
        return /^[a-z]*$/.test(str);
    };
    const cursorPosition = editor.selection.active;
    let line = editor.document.lineAt(cursorPosition.line);
    let text = line.text.trim();
    if (text.includes("<")) {
        //If the first character after the < is lowercase, then it's an aggregation
        if (isLowerCase(text.charAt(1) === "/" ? text.charAt(2) : text.charAt(1)) &&
            text.indexOf(":") === -1
            ? true
            : isLowerCase(text.charAt(text.indexOf(":") + 1))) {
            let foundControl = false;
            let count = 1;
            const navigator = text.charAt(1) === "/" ? "-" : "+";
            while (foundControl === false) {
                count = navigator === "+" ? cursorPosition.line - count : cursorPosition.line + count;
                line = editor.document.lineAt(count);
                text = line.text.trim();
                if (text.includes("<") &&
                    !isLowerCase(text.charAt(1) === "/" ? text.charAt(2) : text.charAt(1))) {
                    foundControl = true;
                }
                else {
                    count++;
                }
            }
        }
        //just for good measure, check if it's the end tag
        const tagSplit = text.includes("</") ? "</" : "<";
        const endSplit = text.includes(" ") ? " " : text.includes(">") ? ">" : "\n";
        text = text.split(tagSplit)[1].split(endSplit)[0];
    }
    else {
        let count = cursorPosition.line - 1;
        text = "";
        while (!text) {
            line = editor.document.lineAt(count);
            text = line.text.trim();
            if (text.includes("<")) {
                const endSplit = text.includes(">") ? ">" : text.includes(" ") ? " " : "\n";
                text = text.split("<")[1].split(endSplit)[0];
            }
            else {
                count = count - 1;
            }
        }
    }
    text = text.includes(">") ? text.slice(0, -1) : text;
    return getNamespace(text, editor);
}
exports.findControl = findControl;
//# sourceMappingURL=contextMenu.js.map