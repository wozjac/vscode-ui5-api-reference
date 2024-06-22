import { formatJsDoc } from "./formatter.js";
import { prepareParameters } from "./parameterFormat.js";
import { getUi5Objects } from "../core/ui5ApiService.js";
import { MethodApi, MethodsApi } from "./types.js";
import { Ui5ObjectMethods, LibraryApiSymbol } from "../core/types.js";

export function prepareMethods(
  methods: Ui5ObjectMethods,
  ui5ObjectApi: LibraryApiSymbol,
  cleanHtml: boolean,
  flatStatic: boolean
): MethodsApi {
  return methods.map((method) => {
    const methodApi = <MethodApi>{};
    methodApi.name = method.name;
    methodApi.objectName = ui5ObjectApi.name;
    methodApi.description = formatJsDoc(method.description, cleanHtml);

    if (method.deprecated) {
      methodApi.deprecated = method.deprecated;

      methodApi.description = `[DEPRECATED! ${formatJsDoc(methodApi.deprecated.text, true)}] ${
        methodApi.description
      }`;
    }

    if (method.static) {
      methodApi.static = true;
      if (flatStatic === true) {
        methodApi.name = method.name;
      } else {
        methodApi.name = `${ui5ObjectApi.name}.${method.name}`;
      }
    } else {
      methodApi.static = false;
    }

    if (method.parameters) {
      methodApi.hasParameters = true;
      methodApi.parameters = prepareParameters(method.parameters, cleanHtml);
    } else {
      methodApi.hasParameters = false;
    }

    if (method.returnValue && method.returnValue.type) {
      methodApi.hasReturnValue = true;
      //eslint-disable-next-line
      const returnType = method.returnValue.type.replace(/[\[\]]/g, "");
      methodApi.returnValue = { type: returnType };

      if (method.returnValue.description) {
        methodApi.returnValue.description = formatJsDoc(method.returnValue.description, cleanHtml);
      }

      let returnObject;

      try {
        returnObject = getUi5Objects()[returnType];
        //eslint-disable-next-line
      } catch (err) { 
        // ignore
      }

      if (returnObject) {
        methodApi.hasUi5ObjectReturnType = true;
        methodApi.ui5ObjectReturnType = returnType;
      } else {
        methodApi.hasUi5ObjectReturnType = false;
      }
    } else {
      methodApi.hasReturnValue = false;
    }

    let path = methodApi.name;

    if (path.indexOf("module:") !== -1) {
      path = path.replace("module:", "");
      path = encodeURIComponent(path);
    }

    methodApi.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/methods/${path}`;

    return methodApi;
  });
}
