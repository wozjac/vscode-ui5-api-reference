const ui5APIService = require("../core/ui5ApiService.js");
const favorites = require("../panelFeatures/favorites.js");
const formatter = require("./formatter");
const methodFormat = require("./methodFormat");
const eventFormat = require("./eventFormat");
const aggregationFormat = require("./aggregationFormat");

function getFormattedObjectApi(
  ui5ObjectApi,
  cleanHtml = false,
  inheritedAsArray = false,
  flatStatic = false
) {
  const api = {
    name: ui5ObjectApi.name,
    extends: ui5ObjectApi.extends,
    apiDocUrl: ui5ObjectApi.apiDocUrl,
    isDeprecated: false,
    hasMethods: false,
    hasEvents: false,
    hasConstructor: false,
    hasConstructorParams: false,
    hasProperties: false,
    hasInheritedMethods: false,
    hasBaseObject: false,
    hasAggregations: false,
    isFavorite: favorites.isFavorite(ui5ObjectApi.name),
  };

  api.description = formatter.formatJsDoc(ui5ObjectApi.description, cleanHtml);

  if (ui5ObjectApi.extends) {
    api.hasBaseObject = true;
  }

  if (ui5ObjectApi.methods) {
    api.hasMethods = true;

    api.methods = ui5ObjectApi.methods.filter((element) => {
      return element.visibility === "public";
    });

    api.methods = JSON.parse(JSON.stringify(api.methods));

    if (api.methods) {
      methodFormat.prepareMethods(api.methods, ui5ObjectApi, cleanHtml, flatStatic);
    }
  }

  if (ui5ObjectApi.events) {
    api.hasEvents = true;

    api.events = ui5ObjectApi.events.filter((element) => {
      return element.visibility === "public";
    });

    api.events = JSON.parse(JSON.stringify(api.events));

    if (api.events) {
      eventFormat.prepareEvents(api.events, ui5ObjectApi, cleanHtml);
    }
  }

  let properties;

  switch (ui5ObjectApi.kind) {
    case "class":
      try {
        properties = ui5ObjectApi["ui5-metadata"].properties;
      } catch (error) {
        properties = [];
      }

      if (ui5ObjectApi.hasOwnProperty("constructor")) {
        api.hasConstructor = true;
        api.constructor = JSON.parse(JSON.stringify(ui5ObjectApi.constructor));
        api.constructor.description = formatter.formatJsDoc(api.constructor.description, cleanHtml);

        if (ui5ObjectApi.constructor.parameters) {
          api.hasConstructorParams = true;
          api.constructorParams = JSON.parse(JSON.stringify(ui5ObjectApi.constructor.parameters));

          api.constructorParams.forEach((param) => {
            param.description = formatter.formatJsDoc(param.description, cleanHtml);
            param.objectName = ui5ObjectApi.name;

            if (param.parameterProperties) {
              param.hasProperties = true;
              param.parameterProperties = JSON.parse(JSON.stringify(param.parameterProperties));
              const properties = [];

              for (const prop in param.parameterProperties) {
                const parameterProperty = param.parameterProperties[prop];
                parameterProperty.description = formatter.formatJsDoc(
                  parameterProperty.description,
                  cleanHtml
                );
                parameterProperty.objectName = ui5ObjectApi.name;
                properties.push(parameterProperty);
              }

              param.parameterProperties = properties;
            }
          });
        }
      }

      break;
    case "enum":
    case "namespace":
      properties = ui5ObjectApi.properties;
      break;
  }

  if (properties && properties.length > 0) {
    properties = properties.filter((property) => {
      return property.visibility === "public";
    });

    api.hasProperties = true;
    api.properties = JSON.parse(JSON.stringify(properties));

    api.properties.forEach((property) => {
      if (!property.type || property.type === "undefined") {
        property.type = "";
      } else {
        const theType = property.type.replace("[]", "");
        const typeObject = ui5APIService.getUi5Objects()[theType];

        if (typeObject) {
          property.hasUi5ObjectType = true;
          property.ui5ObjectType = theType;
        } else {
          property.hasUi5ObjectType = false;
        }
      }

      property.objectName = ui5ObjectApi.name;
      property.description = formatter.formatJsDoc(property.description, cleanHtml);

      if (property.deprecated) {
        property.description = `[DEPRECATED! ${formatter.formatJsDoc(
          property.deprecated.text,
          true
        )}]  ${property.description}`;
      }

      property.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/controlProperties`;
    });
  }

  if (ui5ObjectApi.deprecated) {
    api.isDeprecated = true;
  }

  if (ui5ObjectApi["ui5-metadata"] && ui5ObjectApi["ui5-metadata"].aggregations) {
    api.hasAggregations = true;

    api.aggregations = ui5ObjectApi["ui5-metadata"].aggregations.filter((element) => {
      return element.visibility === "public";
    });

    api.aggregations = JSON.parse(JSON.stringify(api.aggregations));
    aggregationFormat.prepareAggregations(api.aggregations, ui5ObjectApi, cleanHtml);
  }

  if (ui5ObjectApi.inheritedApi) {
    api.inheritedApi = {};

    for (const objectKey in ui5ObjectApi.inheritedApi) {
      api.inheritedApi[objectKey] = getFormattedObjectApi(
        ui5ObjectApi.inheritedApi[objectKey],
        cleanHtml
      );

      if (ui5ObjectApi.inheritedApi[objectKey].methods) {
        api.hasInheritedMethods = true;
      }
    }
  }

  if (inheritedAsArray === true) {
    const inheritedApiAsArray = [];
    let inheritedObject;

    for (const objectName in api.inheritedApi) {
      inheritedObject = api.inheritedApi[objectName];
      inheritedApiAsArray.push(inheritedObject);
    }

    api.inheritedApi = inheritedApiAsArray;
  }

  return api;
}

module.exports = {
  getFormattedObjectApi,
};
