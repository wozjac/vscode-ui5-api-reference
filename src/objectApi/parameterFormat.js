const formatter = require("./formatter");

function prepareParameters(parameters, cleanHtml) {
  parameters.forEach((parameter) => {
    parameter.description = formatter.formatJsDoc(parameter.description, cleanHtml);

    if (parameter.parameterProperties) {
      const paramProperties = [];

      for (const p in parameter.parameterProperties) {
        const param = parameter.parameterProperties[p];
        param.name = p;
        param.description = formatter.formatJsDoc(param.description, cleanHtml);
        paramProperties.push(param);
      }

      parameter.parameterProperties = paramProperties;
    }
  });
}

module.exports = {
  prepareParameters,
};
