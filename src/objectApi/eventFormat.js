const formatter = require("./formatter");
const parameterFormat = require("./parameterFormat");

function prepareEvents(events, ui5ObjectApi, cleanHtml) {
  events.forEach((event) => {
    event.objectName = ui5ObjectApi.name;
    event.description = formatter.formatJsDoc(event.description, cleanHtml);

    if (event.deprecated) {
      event.description = `[DEPRECATED! ${formatter.formatJsDoc(event.deprecated.text, true)}]  ${
        event.description
      }`;
    }

    if (event.parameters) {
      parameterFormat.prepareParameters(event.parameters, cleanHtml);
    }

    event.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/events/${event.name}`;
  });
}

module.exports = {
  prepareEvents,
};
