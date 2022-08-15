const formatter = require("./formatter");
const ui5ApiService = require("../core/ui5ApiService");

function prepareAggregations(aggregations, ui5ObjectApi, cleanHtml) {
  aggregations.forEach((aggregation) => {
    aggregation.objectName = ui5ObjectApi.name;

    const theType = aggregation.type.replace("[]", "");
    const typeObject = ui5ApiService.getUi5Objects()[theType];

    if (typeObject) {
      aggregation.hasUi5ObjectType = true;
      aggregation.ui5ObjectType = theType;
    } else {
      aggregation.hasUi5ObjectType = false;
    }

    aggregation.description = formatter.formatJsDoc(aggregation.description, cleanHtml);
    aggregation.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/aggregations`;
  });
}

module.exports = {
  prepareAggregations,
};
