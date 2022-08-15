import * as ui5API from "./ui5API";
import * as constants from "./constants";
import * as dataSource from "./dataSource";
import * as apiBuffer from "./ui5APIBuffer";

interface ApiIndexNode {
  kind: string;
  lib: string;
  name: string;
  displayName: string;
  visibility: string;
  nodes?: ApiIndexNode[];
}

interface ApiIndexNodeEnhanced {
  name: string;
  originalName: string;
  basename: string;
  kind: string;
  library: string;
  apiDocUrl: string;
}

interface ApiIndex {
  symbols: ApiIndexNode[];
}

interface Ui5LibrariesApi {
  [index: string]: LibraryApi;
}

interface LibraryApi {
  symbols: LibraryApiSymbol[];
}

export interface LibraryApiSymbol {
  basename: string;
  description: string;
  experimental: {
    since: string;
  };
  export?: string;
  kind: string;
  module: string;
  name: string;
  resource: string;
  since: string;
  static: boolean;
  visibility: string;
  originalName: string;
  apiDocUrl: string;
  extends?: string;
  constructor?: Ui5ObjectConstructor;
  methods?: Ui5ObjectMethod[];
  "ui5-metamodel"?: boolean;
  "ui5-metadata"?: Ui5Metadata;
  inheritedApi?: LibraryApiSymbol;
}

interface Ui5ObjectConstructor {
  description: string;
  parameters?: Ui5ObjectMethodParameter[];
}

interface Ui5ObjectMethod {
  description: string;
  name: string;
  visiblity: string;
  returnType: {
    type: string;
  };
  parameters?: Ui5ObjectMethodParameter[];
}

interface Ui5ObjectMethodParameter {
  description: string;
  name: string;
  optional: boolean;
  type: string;
}

interface Ui5Metadata {
  metadataClass?: string;
  stereotype?: string;
}

interface SapLibraryDefs {
  [index: string]: string | object;
}

const apiIndexNodes: { [key: string]: ApiIndexNodeEnhanced } = {};
const ui5Libraries: Ui5LibrariesApi = {};

export const sapLibraryDefs: SapLibraryDefs = {
  "!name": "sap",
};

let apiBaseUrl: string;

export function setAPIBaseURL(apiUrl: string) {
  apiBaseUrl = apiUrl;
}

export function fetchApiIndex(): Promise<ApiIndex> {
  return dataSource.fetchJSON(`${apiBaseUrl}/docs/api/api-index.json`) as Promise<ApiIndex>;
}

function fetchLibraryApi(libraryApiUrl: string): Promise<LibraryApi> {
  return dataSource.fetchJSON(libraryApiUrl) as Promise<LibraryApi>;
}

function getLibraryApi(libraryName: string): Promise<LibraryApi> {
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
  resultApi: LibraryApiSymbol
): LibraryApiSymbol | undefined {
  const ui5Object = apiIndexNodes[ui5ObjectName];

  //no library === just namespace
  // if (!ui5Object.library) {
  //   return {
  //     kind: "namespace",
  //     name: ui5ObjectName,
  //   };
  // }

  let objectApi: LibraryApiSymbol | undefined;
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
      resultApi.inheritedApi = <LibraryApiSymbol>{};
    }

    // @ts-ignore
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
                element.name = ui5API.getNormalizedName(element.name);
                element.originalName = element.name;
                element.apiDocUrl = ui5API.getUi5ObjectApiDocUrl(element.name, apiBaseUrl);
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

function prepareUi5Objects(apiIndexEntry: ApiIndex | ApiIndexNode) {
  let normalizedName;

  if ("symbols" in apiIndexEntry) {
    for (const object of apiIndexEntry.symbols) {
      normalizedName = ui5API.getNormalizedName(object.name);
      apiIndexNodes[normalizedName] = enhanceApiIndexNode(object);

      //extract library
      ui5Libraries[object.lib] = <LibraryApi>{};

      if (object.nodes) {
        for (const node of object.nodes) {
          prepareUi5Objects(node);
        }
      }
    }
  } else {
    normalizedName = ui5API.getNormalizedName(apiIndexEntry.name);
    apiIndexNodes[normalizedName] = enhanceApiIndexNode(apiIndexEntry);
    ui5Libraries[apiIndexEntry.lib] = <LibraryApi>{};

    if (apiIndexEntry.nodes) {
      for (const node of apiIndexEntry.nodes) {
        prepareUi5Objects(node);
      }
    }
  }
}

function enhanceApiIndexNode(apiIndexNode: ApiIndexNode): ApiIndexNodeEnhanced {
  return {
    name: ui5API.getNormalizedName(apiIndexNode.name),
    originalName: apiIndexNode.name,
    basename: apiIndexNode.name.substring(apiIndexNode.name.lastIndexOf(".") + 1),
    kind: apiIndexNode.kind,
    library: apiIndexNode.lib,
    apiDocUrl: ui5API.getUi5ObjectApiDocUrl(apiIndexNode.name, apiBaseUrl),
  };
}
