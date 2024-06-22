import { expect } from "chai";
import * as stubber from "../../../support/stubber.js";
import { prepareProperties } from "../../../../objectApi/propertiesFormat.js";
import { Ui5ObjectProperty } from "../../../../core/types.js";
import { ColumnListItemApiSymbol } from "../common.js";

const rawPropertyBasic: Ui5ObjectProperty = {
  name: "myName",
  description: "this is <code>description</code>",
  type: "string",
  visibility: "public",
};

const rawPropertyDeprecated = Object.assign({}, rawPropertyBasic);
rawPropertyDeprecated.deprecated = { text: "Deprecated in <code>1.94.0</code>" };

const rawPropertyWithSimpleDefaultValue = Object.assign({}, rawPropertyBasic);
rawPropertyWithSimpleDefaultValue.defaultValue = "string";

const rawPropertyWithUi5Type = Object.assign({}, rawPropertyBasic);
rawPropertyWithUi5Type.type = "sap.m.Tree";

describe("propertiesFormat tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should prepare basic fields", () => {
    const formatted = prepareProperties([rawPropertyBasic], ColumnListItemApiSymbol, true);

    expect(formatted).to.have.lengthOf(1);
    const property = formatted[0];
    expect(property.name).to.equal("myName");
    expect(property.description).to.equal("this is description");
    expect(property.type).to.equal("string");
    expect(property.hasUi5ObjectType).to.be.false;
    expect(property.objectName).to.equal("sap.m.ColumnListItem");
    expect(property.apiDocUrl).to.equal(
      "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem/controlProperties"
    );
    expect(property.hasDefaultValue).to.be.false;
  });

  it("should prepare deprecated text", () => {
    const formatted = prepareProperties([rawPropertyDeprecated], ColumnListItemApiSymbol, true);

    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].description).to.equal(
      "[DEPRECATED! Deprecated in 1.94.0] this is description"
    );
  });

  it("should prepare default value", () => {
    const formatted = prepareProperties(
      [rawPropertyWithSimpleDefaultValue],
      ColumnListItemApiSymbol,
      true
    );

    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].defaultValue).to.equal("string");
  });

  it("should prepare UI5 type", () => {
    const formatted = prepareProperties([rawPropertyWithUi5Type], ColumnListItemApiSymbol, true);

    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].hasUi5ObjectType).to.be.true;
    expect(formatted[0].ui5ObjectType).to.be.equal("sap.m.Tree");
  });
});
