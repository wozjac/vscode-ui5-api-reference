import * as ui5Api from "./types";
import * as constants from "./constants";
import * as dataSource from "./dataSource";
import * as apiBuffer from "./ui5ApiBuffer";

interface Ui5LibrariesApi {
  [index: string]: ui5Api.LibraryApi;
}

interface SapLibraryDefs {
  [index: string]: string | object;
}

const apiIndexNodes: { [key: string]: ui5Api.ApiIndexNodeEnhanced } = {};
const ui5Libraries: Ui5LibrariesApi = {};

export const sapLibraryDefs: SapLibraryDefs = {
  "!name": "sap",
};

let apiBaseUrl: string;

export function setAPIBaseURL(apiUrl: string) {
  apiBaseUrl = apiUrl;
}

export function fetchApiIndex(): Promise<ui5Api.ApiIndex> {
  return dataSource.fetchJSON(`${apiBaseUrl}/docs/api/api-index.json`) as Promise<ui5Api.ApiIndex>;
}

function fetchLibraryApi(libraryApiUrl: string): Promise<ui5Api.LibraryApi> {
  return dataSource.fetchJSON(libraryApiUrl) as Promise<ui5Api.LibraryApi>;
}

function getLibraryApi(libraryName: string): Promise<ui5Api.LibraryApi> {
  const libraryApi = ui5Libraries[libraryName] as any;

  return new Promise((resolve, reject) => {
    if (Object.keys(libraryApi).length) {
      resolve(libraryApi);
    } else {
      const libraryUrlName = libraryName.replace(/\./g, "/");
      const libraryApiUrl = `${apiBaseUrl}/test-resources/${libraryUrlName}/designtime/api.json`;

      fetchLibraryApi(libraryApiUrl).then(
        (libraryApi) => {
          resolve(libraryApi);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

export function getUi5Objects() {
  if (Object.keys(apiIndexNodes).length) {
    return apiIndexNodes;
  } else {
    throw new Error("UI5 objects could not be loaded");
  }
}

export function getUi5ObjectDesignApi(
  ui5ObjectName: string,
  resultApi: ui5Api.LibraryApiSymbol
): ui5Api.LibraryApiSymbol | undefined {
  const ui5Object = apiIndexNodes[ui5ObjectName];

  //no library === just namespace
  // if (!ui5Object.library) {
  //   return {
  //     kind: "namespace",
  //     name: ui5ObjectName,
  //   };
  // }

  let objectApi: ui5Api.LibraryApiSymbol | undefined;
  const bufferedDesignApi = apiBuffer.searchObjectDesignApiBuffer(ui5Object.name);

  if (bufferedDesignApi) {
    objectApi = bufferedDesignApi;
  } else {
    const libraryApi = ui5Libraries[ui5Object.library];

    objectApi = libraryApi.symbols.find((element) => {
      if (element.kind === "class" || element.kind === "enum") {
        return element.name === ui5Object.name;
      } else {
        return element.basename === ui5Object.basename;
      }
    });

    if (!objectApi) {
      return;
    }

    objectApi.apiDocUrl = ui5Object.apiDocUrl;
  }

  //method called recursively, we have previous result -> add new stuff
  if (resultApi) {
    if (!resultApi.inheritedApi) {
      resultApi.inheritedApi = {};
    }

    resultApi.inheritedApi[ui5ObjectName] = objectApi;
  } else {
    resultApi = objectApi;
  }

  if (objectApi.extends) {
    return getUi5ObjectDesignApi(objectApi.extends, resultApi);
  } else {
    apiBuffer.addToObjectDesignApiBuffer(resultApi);
    return resultApi;
  }
}

export function loadUi5Objects(): Promise<any> {
  if (Object.keys(apiIndexNodes).length > 0) {
    return Promise.resolve(true);
  } else {
    return fetchApiIndex().then(
      (apiIndex) => {
        prepareUi5Objects(apiIndex);
        console.log(`${constants.pluginLogPrefix}: UI5 API loaded from ${apiBaseUrl}`);
        Promise.resolve(true);
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }
}

export function loadUi5LibrariesDesignApi(): Promise<void[]> {
  const promises = [];

  for (const libraryKey in ui5Libraries) {
    promises.push(
      new Promise<void>((resolve) => {
        getLibraryApi(libraryKey)
          .then((libraryApi) => {
            if (libraryApi.symbols && Array.isArray(libraryApi.symbols)) {
              libraryApi.symbols.forEach((element) => {
                element.name = getNormalizedName(element.name);
                element.originalName = element.name;
                element.apiDocUrl = getUi5ObjectApiDocUrl(element.name, apiBaseUrl);
              });
            }

            ui5Libraries[libraryKey] = libraryApi;
            console.log(`${constants.pluginLogPrefix}: loaded UI5 library: ${libraryKey}`);
            resolve();
          })
          .catch((error) => {
            //continue, no rejections
            console.error(`${error}`);
            return;
          });
      })
    );
  }

  return Promise.all(promises);
}

function prepareUi5Objects(apiIndexEntry: ui5Api.ApiIndex | ui5Api.ApiIndexNode) {
  let normalizedName;

  if ("symbols" in apiIndexEntry) {
    for (const object of apiIndexEntry.symbols) {
      normalizedName = getNormalizedName(object.name);
      apiIndexNodes[normalizedName] = enhanceApiIndexNode(object);

      //extract library
      ui5Libraries[object.lib] = <ui5Api.LibraryApi>{};

      if (object.nodes) {
        for (const node of object.nodes) {
          prepareUi5Objects(node);
        }
      }
    }
  } else {
    normalizedName = getNormalizedName(apiIndexEntry.name);
    apiIndexNodes[normalizedName] = enhanceApiIndexNode(apiIndexEntry);
    ui5Libraries[apiIndexEntry.lib] = <ui5Api.LibraryApi>{};

    if (apiIndexEntry.nodes) {
      for (const node of apiIndexEntry.nodes) {
        prepareUi5Objects(node);
      }
    }
  }
}

function enhanceApiIndexNode(apiIndexNode: ui5Api.ApiIndexNode): ui5Api.ApiIndexNodeEnhanced {
  return {
    name: getNormalizedName(apiIndexNode.name),
    originalName: apiIndexNode.name,
    basename: apiIndexNode.name.substring(apiIndexNode.name.lastIndexOf(".") + 1),
    kind: apiIndexNode.kind,
    library: apiIndexNode.lib,
    apiDocUrl: getUi5ObjectApiDocUrl(apiIndexNode.name, apiBaseUrl),
  };
}

export function getNormalizedName(name: string) {
  return name.replace("module:", "").replace(/\//g, ".");
}

export function getUi5ObjectApiDocUrl(ui5ObjectName: string, apiBaseUrl: string) {
  let path = ui5ObjectName;

  if (path.indexOf("module:") !== -1) {
    path = encodeURIComponent(path);
  }

  return `${apiBaseUrl}/#/api/${path}`;
}
