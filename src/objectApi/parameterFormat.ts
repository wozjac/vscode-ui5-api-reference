import { formatJsDoc } from "./formatter.js";
import { ParameterApi } from "./types.js";
import { Ui5ObjectParameters } from "../core/types.js";

export function prepareParameters(parameters: Ui5ObjectParameters, cleanHtml: boolean) {
  return parameters.map((parameter) => {
    const parameterApi = <ParameterApi>{};
    parameterApi.name = parameter.name;
    parameterApi.type = parameter.type;
    parameterApi.optional = parameter.optional;
    parameterApi.description = formatJsDoc(parameter.description, cleanHtml);

    if (parameter.parameterProperties) {
      parameterApi.parameterProperties = [];

      for (const p in parameter.parameterProperties) {
        const param = parameter.parameterProperties[p];
        param.name = p;
        param.description = formatJsDoc(param.description, cleanHtml);
        parameterApi.parameterProperties.push(param);
      }
    }

    return parameterApi;
  });
}
