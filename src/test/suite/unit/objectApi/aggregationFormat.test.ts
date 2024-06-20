import { expect } from "chai";
import * as stubber from "../../../support/stubber.js";
import { prepareAggregations } from "../../../../objectApi/aggregationFormat.js";
import { Ui5ObjectAggregation, LibraryApiSymbol } from "../../../../core/types.js";
import { ColumnListItemApiSymbol } from "../common.js";

const rawAggregation: Ui5ObjectAggregation = {
  name: "myName",
  description: "this is <code>description</code>",
  type: "[string]",
  visibility: "public",
  cardinality: "[0..1]",
};

const rawAggregationWithUi5Type = Object.assign({}, rawAggregation);
rawAggregationWithUi5Type.type = "[sap.m.Tree]";

describe("aggregationFormat tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should prepare basic fields", () => {
    const formatted = prepareAggregations([rawAggregation], ColumnListItemApiSymbol, true);

    expect(formatted).to.have.lengthOf(1);
    const aggregation = formatted[0];
    expect(aggregation.name).to.equal("myName");
    expect(aggregation.description).to.equal("this is description");
    expect(aggregation.cardinality).to.equal("[0..1]");
    expect(aggregation.type).to.equal("string");
    expect(aggregation.hasUi5ObjectType).to.be.false;
    expect(aggregation.apiDocUrl).to.equal(
      "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem/aggregations"
    );
  });

  it("should prepare UI5 object type", () => {
    const formatted = prepareAggregations(
      [rawAggregationWithUi5Type],
      ColumnListItemApiSymbol,
      true
    );

    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].hasUi5ObjectType).to.be.true;
    expect(formatted[0].ui5ObjectType).to.be.equal("sap.m.Tree");
  });
});
