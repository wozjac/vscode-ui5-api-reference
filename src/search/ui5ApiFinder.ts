import * as ui5ApiService from "../core/ui5ApiService";
import { ApiIndexNodeEnhanced } from "../core/ui5Api";

export interface SearchQuery {
  name: string;
  ignoreCase: boolean;
}

export function findUi5ApiObjects(query: SearchQuery): ApiIndexNodeEnhanced[] | undefined {
  const result = [];

  if (query.ignoreCase === undefined) {
    query.ignoreCase = true;
  }

  const ui5Objects = ui5ApiService.getUi5Objects();
  const keys = Object.keys(ui5Objects);

  let regexQuery = query.name;

  if (regexQuery.indexOf("module:") !== -1) {
    regexQuery = regexQuery.replace("module:", "").replace(/\//g, ".");
  }

  regexQuery = regexQuery.replace(".", "\\.");

  const objectNames = keys.filter((key) => {
    let regex;

    if (query.ignoreCase === true) {
      regex = new RegExp(regexQuery, "i");
    } else {
      regex = new RegExp(regexQuery);
    }

    return key.search(regex) !== -1;
  });

  //full path search?
  if (objectNames.length > 0 && query.name !== "sap") {
    const object = objectNames.find((key) => {
      return key === query.name;
    });

    if (object) {
      result.push(ui5Objects[object]);
      return result;
    }
  }

  let ui5Object;

  for (const name of objectNames) {
    ui5Object = ui5Objects[name];
    result.push(ui5Object);
  }

  return result.length > 0 ? result : undefined;
}

export function findUi5ObjectByName(
  searchedName: string,
  ignoreCase = true
): ApiIndexNodeEnhanced | undefined {
  const ui5Objects = ui5ApiService.getUi5Objects();
  let objectName;

  for (const objectKey in ui5Objects) {
    objectName = objectKey;
    let searchString = searchedName;

    if (ignoreCase === true) {
      objectName = objectName.toLowerCase();
      searchString = searchString.toLowerCase();
    }

    if (objectName === searchString) {
      return ui5Objects[objectKey];
    }

    //module check
    searchString = `module:${searchString.replace(/\./g, "/")}`;

    if (objectName === searchString) {
      return ui5Objects[objectKey];
    }
  }
}

export function findUi5ObjectByBasename(
  searchedBasename: string,
  ignoreCase = true
): ApiIndexNodeEnhanced[] | undefined {
  const result = [];
  let objectBasename, ui5Object;

  const ui5Objects = ui5ApiService.getUi5Objects();

  for (const objectKey in ui5Objects) {
    ui5Object = ui5Objects[objectKey];
    objectBasename = ui5Object.basename;

    if (ignoreCase) {
      objectBasename = objectBasename.toLowerCase();
      searchedBasename = searchedBasename.toLowerCase();
    }

    if (objectBasename === searchedBasename) {
      result.push(ui5Object);
    }
  }

  return result.length > 0 ? result : undefined;
}
