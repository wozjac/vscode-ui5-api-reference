const constants = require("./constants.js");
const dataSource = require("./dataSource.js");

const ui5ObjectsDesignApiBufferLength = 30;
const ui5Objects = {};
const ui5LibrariesDesignApi = {};
const ui5ObjectsDesignApiBuffer = [];

const sapLibraryDefs = {
  "!name": "sap"
};

const requireJsOverrides = {};
let apiBaseUrl;

function setAPIBaseURL(apiUrl) {
  apiBaseUrl = apiUrl;
}

function getApiIndex() {
  return dataSource.fetchJSON(`${apiBaseUrl}/docs/api/api-index.json`);
}

function getLibraryApi(libraryName) {
  const libraryApiDoc = ui5LibrariesDesignApi[libraryName];

  return new Promise((resolve, reject) => {
    if (Object.keys(libraryApiDoc).length) {
      resolve(libraryApiDoc);
    } else {
      const libraryUrlName = libraryName.replace(/\./g, "/");
      const libraryApiUrl = `${apiBaseUrl}/test-resources/${libraryUrlName}/designtime/api.json`;

      dataSource.fetchJSON(libraryApiUrl)
        .then((libraryApi) => {
          resolve(libraryApi);
        }, (error) => {
          reject(error);
        });
    }
  });
}

function getUi5ObjectApiDocUrl(objectFullName) {
  let path = objectFullName;

  if (path.indexOf("module:") !== -1) {
    path = encodeURIComponent(path);
  }

  return `${apiBaseUrl}/#/api/${path}`;
}

function getUi5Objects() {
  if (Object.keys(ui5Objects).length) {
    return ui5Objects;
  } else {
    throw new Error("UI5 objects could not be loaded");
  }
}

function getUi5ObjectDesignApi(objectName, resultApi) {
  const ui5Object = ui5Objects[objectName];
  const libraryName = ui5Object.library;

  //no library === just namespace
  if (!libraryName) {
    return {
      kind: "namespace",
      name: objectName
    };
  }

  let objectApi;
  const bufferedDesignApi = searchObjectDesignApiBuffer(ui5Object.name);

  if (bufferedDesignApi) {
    objectApi = bufferedDesignApi;
  } else {
    const libraryApi = ui5LibrariesDesignApi[ui5Object.library];

    objectApi = libraryApi.symbols.find((element) => {
      if (element.kind === "class" ||
        element.kind === "enum") {
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

    resultApi.inheritedApi[objectName] = objectApi;
  } else {
    resultApi = objectApi;
  }

  if (objectApi.extends) {
    return getUi5ObjectDesignApi(objectApi.extends, resultApi);
  } else {
    addToObjectDesignApiBuffer(resultApi);
    return resultApi;
  }
}

function loadUi5Objects() {
  if (Object.keys(ui5Objects).length) {
    return Promise.resolve(true);
  } else {
    return getApiIndex()
      .then((apiIndexJson) => {
        prepareUi5Objects(apiIndexJson);
        //exports.ui5Objects = ui5Objects; //unit testing only
        console.log(`${constants.pluginLogPrefix}: UI5 API loaded from ${apiBaseUrl}`);
        Promise.resolve(true);
      }, (error) => {
        Promise.reject(error);
      });
  }
}

function loadUi5LibrariesDesignApi() {
  const promises = [];

  for (const libraryKey in ui5LibrariesDesignApi) {
    promises.push(new Promise((resolve) => {
      getLibraryApi(libraryKey)
        .then((libraryApiJson) => {
          if (libraryApiJson.symbols && Array.isArray(libraryApiJson.symbols)) {
            libraryApiJson.symbols.forEach((element) => {
              element.name = getNormalizedName(element.name);
              element.originalName = element.name;
              element.apiDocUrl = getUi5ObjectApiDocUrl(element.name);
            });
          }

          ui5LibrariesDesignApi[libraryKey] = libraryApiJson;
          prepareDefinitions(libraryKey);
          console.log(`${constants.pluginLogPrefix}: loaded UI5 library: ${libraryKey}`);
          resolve();
        })
        .catch((error) => {
          //continue, no rejections
          console.error(`${error}`);
          return;
        });
    }));
  }

  return Promise.all(promises);
}

function prepareUi5Objects(apiEntry) {
  let normalizedName;

  if (apiEntry.symbols) {
    for (const object of apiEntry.symbols) {
      normalizedName = getNormalizedName(object.name);
      ui5Objects[normalizedName] = getEntry(object);

      //extract library
      ui5LibrariesDesignApi[object.lib] = {};

      if (object.nodes) {
        for (const node of object.nodes) {
          prepareUi5Objects(node);
        }
      }
    }
  } else {
    normalizedName = getNormalizedName(apiEntry.name);
    ui5Objects[normalizedName] = getEntry(apiEntry);
    ui5LibrariesDesignApi[apiEntry.lib] = {};

    if (apiEntry.nodes) {
      for (const node of apiEntry.nodes) {
        prepareUi5Objects(node);
      }
    }
  }
}

function getEntry(apiIndexObject) {
  return {
    name: getNormalizedName(apiIndexObject.name),
    originalName: apiIndexObject.name,
    basename: apiIndexObject.name.substring(apiIndexObject.name.lastIndexOf(".") + 1),
    kind: apiIndexObject.kind,
    library: apiIndexObject.lib,
    apiDocUrl: getUi5ObjectApiDocUrl(apiIndexObject.name)
  };
}

function searchObjectDesignApiBuffer(objectName) {
  let result;

  if (ui5ObjectsDesignApiBuffer.length > 0) {
    result = ui5ObjectsDesignApiBuffer.find((designApi) => {
      return designApi.name === objectName;
    });
  }

  return result;
}

function addToObjectDesignApiBuffer(objectApi) {
  if (!searchObjectDesignApiBuffer(objectApi.name)) {
    if (ui5ObjectsDesignApiBuffer.length === ui5ObjectsDesignApiBufferLength) {
      ui5ObjectsDesignApiBuffer.shift();
    }
    ui5ObjectsDesignApiBuffer.push(objectApi);
  }
}

function prepareDefinitions(libraryKey) {
  const library = ui5LibrariesDesignApi[libraryKey];

  for (const symbol of library.symbols) {
    requireJsOverrides[symbol.name.replace(/\./g, "/")] = `=${symbol.name}`;
    const nameParts = symbol.name.split(".");
    let objectRef = sapLibraryDefs;

    for (const [index, namePart] of nameParts.entries()) {
      if (!objectRef[namePart]) {
        objectRef[namePart] = {};
      }

      objectRef = objectRef[namePart];

      if (index === nameParts.length - 1) {
        //ui5TernDefinitions.prepareUi5Symbol(objectRef, symbol);
      }
    }
  }
}

function getNormalizedName(name) {
  return name
    .replace("module:", "")
    .replace(/\//g, ".");
}

module.exports = {
  getUi5Objects,
  getUi5ObjectDesignApi,
  getUi5ObjectApiDocUrl,
  loadUi5Objects,
  loadUi5LibrariesDesignApi,
  prepareDefinitions,
  getNormalizedName,
  getApiIndex,
  setAPIBaseURL,
  sapLibraryDefs,
  requireJsOverrides,
};