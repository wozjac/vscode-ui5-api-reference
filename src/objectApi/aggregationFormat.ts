import * as formatter from "./formatter.js";
import * as ui5ApiService from "../core/ui5ApiService.js";
import { AggregationApi } from "./types.js";
import { Ui5ObjectAggregations } from "../core/types.js";

export function prepareAggregations(
  aggregations: Ui5ObjectAggregations,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  ui5ObjectApi: any,
  cleanHtml: boolean
) {
  return aggregations.map((aggregation) => {
    const aggregationApi = <AggregationApi>{};
    aggregationApi.name = aggregation.name;
    aggregationApi.cardinality = aggregation.cardinality;
    aggregationApi.objectName = ui5ObjectApi.name;

    //eslint-disable-next-line
    const theType = aggregation.type.replace(/[\[\]]/g, "");
    aggregationApi.type = theType;
    const typeObject = ui5ApiService.getUi5Objects()[theType];

    if (typeObject) {
      aggregationApi.hasUi5ObjectType = true;
      aggregationApi.ui5ObjectType = theType;
    } else {
      aggregationApi.hasUi5ObjectType = false;
    }

    aggregationApi.description = formatter.formatJsDoc(aggregation.description, cleanHtml);
    aggregationApi.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/aggregations`;

    return aggregationApi;
  });
}
