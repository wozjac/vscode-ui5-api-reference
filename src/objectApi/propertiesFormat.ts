import { Ui5ObjectProperties, LibraryApiSymbol } from "../core/types";
import * as ui5ApiService from "../core/ui5ApiService";
import { PropertyApi } from "./types";
import * as formatter from "./formatter";

export function prepareProperties(
  properties: Ui5ObjectProperties,
  ui5ObjectApi: LibraryApiSymbol,
  cleanHtml: boolean
) {
  return properties.map((property) => {
    const propertyApi = <PropertyApi>{};
    propertyApi.name = property.name;
    propertyApi.description = formatter.formatJsDoc(property.description, cleanHtml);

    if (!property.type || property.type === "undefined") {
      propertyApi.type = "";
    } else {
      const theType = property.type.replace("[]", "");
      propertyApi.type = theType;
      const typeObject = ui5ApiService.getUi5Objects()[theType];

      if (typeObject) {
        propertyApi.hasUi5ObjectType = true;
        propertyApi.ui5ObjectType = theType;
      } else {
        propertyApi.hasUi5ObjectType = false;
      }
    }

    propertyApi.objectName = ui5ObjectApi.name;

    if (property.deprecated) {
      propertyApi.description = `[DEPRECATED! ${formatter.formatJsDoc(
        property.deprecated.text,
        true
      )}] ${propertyApi.description}`;

      propertyApi.deprecated = property.deprecated;
    }

    if (property.defaultValue) {
      propertyApi.defaultValue = property.defaultValue;
      propertyApi.hasDefaultValue = true;
    } else {
      propertyApi.hasDefaultValue = false;
    }

    propertyApi.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/controlProperties`;

    return propertyApi;
  });
}
