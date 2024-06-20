import { Ui5ObjectConstructor, LibraryApiSymbol } from "../core/types.js";
import { Ui5ConstructorApi } from "./types.js";
import * as formatter from "./formatter.js";

export function prepareConstructor(
  ui5Constructor: Ui5ObjectConstructor,
  ui5ObjectApi: LibraryApiSymbol,
  cleanHtml: boolean
) {
  let constructorApi = <Ui5ConstructorApi>{};

  constructorApi = JSON.parse(JSON.stringify(ui5Constructor));
  constructorApi.description = formatter.formatJsDoc(ui5Constructor.description, cleanHtml);

  if (ui5Constructor.parameters) {
    constructorApi.parameters = JSON.parse(JSON.stringify(ui5Constructor.parameters));

    if (constructorApi.parameters) {
      constructorApi.parameters.forEach((param) => {
        param.description = formatter.formatJsDoc(param.description, cleanHtml);
        param.objectName = ui5ObjectApi.name;

        if (param.parameterProperties) {
          param.hasProperties = true;
          param.parameterProperties = JSON.parse(JSON.stringify(param.parameterProperties));
          const properties = [];

          // for (const prop in param.parameterProperties) {
          if (param.parameterProperties) {
            for (const parameterProperty of param.parameterProperties) {
              // const parameterProperty = param.parameterProperties[prop];
              parameterProperty.description = formatter.formatJsDoc(
                parameterProperty.description,
                cleanHtml
              );
              parameterProperty.objectName = ui5ObjectApi.name;
              properties.push(parameterProperty);
            }

            param.parameterProperties = properties;
          }
        }
      });
    }
  }

  return constructorApi;
}
