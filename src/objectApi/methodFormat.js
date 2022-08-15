const formatter = require("./formatter");
const parameterFormat = require("./parameterFormat");
const ui5ApiService = require("../core/ui5ApiService");

function prepareMethods(methods, ui5ObjectApi, cleanHtml, flatStatic) {
  methods.forEach((method) => {
    method.objectName = ui5ObjectApi.name;
    method.description = formatter.formatJsDoc(method.description, cleanHtml);

    if (method.deprecated) {
      method.description = `[DEPRECATED! ${formatter.formatJsDoc(method.deprecated.text, true)}]  ${
        method.description
      }`;
    }

    if (method.static) {
      if (flatStatic === true) {
        method.name = method.name;
      } else {
        method.name = `${ui5ObjectApi.name}.${method.name}`;
      }
    }

    if (method.parameters) {
      method.hasParameters = true;
      parameterFormat.prepareParameters(method.parameters, cleanHtml);
    }

    let path = method.name;

    if (path.indexOf("module:") !== -1) {
      path = path.replace("module:", "");
      path = encodeURIComponent(path);
    }

    if (method.returnValue && method.returnValue.type) {
      method.hasReturnValue = true;
      const returnType = method.returnValue.type.replace("[]", "");
      let returnObject;

      try {
        returnObject = ui5ApiService.getUi5Objects()[returnType];
      } catch (err) {
        // ignore
      }

      if (returnObject) {
        method.hasUi5ObjectReturnType = true;
        method.ui5ObjectReturnType = returnType;
      } else {
        method.hasUi5ObjectReturnType = false;
      }
    }

    method.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/methods/${path}`;
  });
}

module.exports = {
  prepareMethods,
};
