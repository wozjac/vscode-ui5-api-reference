import * as constants from "../core/constants";

export function convertModuleNameToPath(moduleName: string): string {
  return moduleName.replace("module:", "").replace(/\//g, ".");
}

function formatJsDoc(jsDoc: string, cleanHtml = false): string {
  if (!jsDoc) {
    return "";
  }

  jsDoc = jsDoc.replace(/{@\w+/g, "").replace(/}/g, "").replace(/#\w+/g, "").replace(/\s\s+/g, " ");
  //.replace(/#\w+:?\w+/g, "");

  if (cleanHtml) {
    jsDoc = jsDoc.replace(constants.regex.htmlTags, "");
  } else {
    //leave only headers and adjust
    jsDoc = jsDoc.replace(constants.regex.htmlTagsWoHeaders, "");

    jsDoc = jsDoc
      .replace(constants.regex.headingsTags, "$1" + "5" + "$3")
      .replace(constants.regex.tagsAttributes, "<$1>");
  }

  return jsDoc;
}
