import * as ui5Api from "../core/types.js";
import * as ui5ApiService from "../core/ui5ApiService.js";
import * as favorites from "../panelFeatures/favorites.js";
import * as formatter from "./formatter.js";
import * as methodFormat from "./methodFormat.js";
import * as eventFormat from "./eventFormat.js";
import * as aggregationFormat from "./aggregationFormat.js";
import * as constructorFormat from "./constructorFormat.js";
import * as propertiesFormat from "./propertiesFormat.js";
import { Ui5SymbolApi } from "./types.js";

export function getFormattedObjectApi(
  ui5ObjectApi: ui5Api.LibraryApiSymbol,
  cleanHtml = false,
  inheritedAsArray = false,
  flatStatic = false
) {
  const formattedApi: Ui5SymbolApi = {
    name: ui5ObjectApi.name,
    description: formatter.formatJsDoc(ui5ObjectApi.description, cleanHtml),
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

  if (ui5ObjectApi.extends) {
    formattedApi.hasBaseObject = true;
  }

  if (ui5ObjectApi.methods) {
    formattedApi.hasMethods = true;

    const publicMethods = ui5ObjectApi.methods.filter((element) => {
      return element.visibility === "public";
    });

    if (publicMethods) {
      formattedApi.methods = methodFormat.prepareMethods(
        publicMethods,
        ui5ObjectApi,
        cleanHtml,
        flatStatic
      );
    }
  }

  if (ui5ObjectApi.events) {
    formattedApi.hasEvents = true;

    const publicEvents = ui5ObjectApi.events.filter((element) => {
      return element.visibility === "public";
    });

    if (publicEvents) {
      formattedApi.events = eventFormat.prepareEvents(publicEvents, ui5ObjectApi, cleanHtml);
    }
  }

  let properties;

  switch (ui5ObjectApi.kind) {
    case "class":
      try {
        const metadata = ui5ObjectApi["ui5-metadata"] as ui5Api.Ui5Metadata;

        if (metadata && "properties" in metadata) {
          properties = metadata.properties;
        }
      } catch (error) {
        properties = [];
      }

      if (ui5ObjectApi.hasOwnProperty("constructor")) {
        formattedApi.hasConstructor = true;

        if (ui5ObjectApi.constructor) {
          formattedApi.ui5Constructor = constructorFormat.prepareConstructor(
            ui5ObjectApi.constructor,
            ui5ObjectApi,
            cleanHtml
          );

          if (formattedApi.ui5Constructor.parameters) {
            formattedApi.hasConstructorParams = true;
          }
        }
      }

      break;
    case "enum":
    case "namespace":
      properties = ui5ObjectApi.properties;
      break;
  }

  if (properties && properties.length > 0) {
    const publicProperties = properties.filter((property: any) => {
      return property.visibility === "public";
    });

    formattedApi.hasProperties = true;
    formattedApi.properties = propertiesFormat.prepareProperties(
      publicProperties,
      ui5ObjectApi,
      cleanHtml
    );
  }

  if (ui5ObjectApi.deprecated) {
    formattedApi.isDeprecated = true;
  }

  if (ui5ObjectApi["ui5-metadata"] && ui5ObjectApi["ui5-metadata"].aggregations) {
    formattedApi.hasAggregations = true;

    const publicAggregations = ui5ObjectApi["ui5-metadata"].aggregations.filter((element) => {
      return element.visibility === "public";
    });

    formattedApi.aggregations = aggregationFormat.prepareAggregations(
      publicAggregations,
      ui5ObjectApi,
      cleanHtml
    );
  }

  if (ui5ObjectApi.inheritedApi) {
    formattedApi.inheritedApi = {};

    for (const objectKey in ui5ObjectApi.inheritedApi) {
      formattedApi.inheritedApi[objectKey] = getFormattedObjectApi(
        ui5ObjectApi.inheritedApi[objectKey],
        cleanHtml
      );

      if (ui5ObjectApi.inheritedApi[objectKey].methods) {
        formattedApi.hasInheritedMethods = true;
      }
    }
  }

  if (inheritedAsArray === true) {
    const inheritedApiAsArray = [];
    let inheritedObject;

    for (const objectName in formattedApi.inheritedApi) {
      const inheritedApiCast = formattedApi.inheritedApi as { [key: string]: Ui5SymbolApi };
      inheritedObject = inheritedApiCast[objectName];
      inheritedApiAsArray.push(inheritedObject);
    }

    formattedApi.inheritedApi = inheritedApiAsArray;
  }

  return formattedApi;
}
