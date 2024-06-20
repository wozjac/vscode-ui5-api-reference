import { expect } from "chai";
import * as stubber from "../../../support/stubber.js";
import { prepareMethods } from "../../../../objectApi/methodFormat.js";
import { Ui5ObjectMethod, LibraryApiSymbol } from "../../../../core/types.js";
import { ColumnListItemApiSymbol } from "../common.js";

const rawMethod: Ui5ObjectMethod = {
  description: "This is <code>method</code>",
  name: "myMethod",
  visibility: "public",
};

const rawMethodDeprecated = Object.assign({}, rawMethod);

rawMethodDeprecated.deprecated = {
  text: "No longer used",
};

const rawMethodStatic = Object.assign({}, rawMethod);
rawMethodStatic.static = true;

const rawMethodWithParams = Object.assign({}, rawMethod);
rawMethodWithParams.parameters = [
  {
    name: "param",
    description: "param description",
    optional: false,
    type: "string",
  },
];

const rawMethodWithSimpleReturnType = Object.assign({}, rawMethod);
rawMethodWithSimpleReturnType.returnValue = {
  type: "string",
  description: "Return <code>description</code>",
};

const rawMethodWithUi5ReturnType = Object.assign({}, rawMethod);
rawMethodWithUi5ReturnType.returnValue = {
  type: "sap.m.ColumnListItem",
  description: "Return <code>description</code>",
};

describe("methodFormat tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should prepare basic fields", () => {
    const formatted = prepareMethods([rawMethod], ColumnListItemApiSymbol, true, true);
    expect(formatted).to.have.lengthOf(1);
    const method = formatted[0];
    expect(method.description).to.equal("This is method");
    expect(method.name).to.equal("myMethod");
    expect(method.objectName).to.equal("sap.m.ColumnListItem");
    expect(method.apiDocUrl).to.equal(
      "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem/methods/myMethod"
    );
  });

  it("should prepare deprecated", () => {
    const formatted = prepareMethods([rawMethodDeprecated], ColumnListItemApiSymbol, true, true);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].description).to.equal("[DEPRECATED! No longer used] This is method");
  });

  it("should prepare flat static name", () => {
    const formatted = prepareMethods([rawMethodStatic], ColumnListItemApiSymbol, true, true);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].static).to.be.true;
    expect(formatted[0].name).to.equal("myMethod");
  });

  it("should prepare full static name", () => {
    const formatted = prepareMethods([rawMethodStatic], ColumnListItemApiSymbol, true, false);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].static).to.be.true;
    expect(formatted[0].name).to.equal("sap.m.ColumnListItem.myMethod");
  });

  it("should prepare with params", () => {
    const formatted = prepareMethods([rawMethodWithParams], ColumnListItemApiSymbol, true, true);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].parameters).to.have.lengthOf(1);
  });

  it("should prepare with simple return value", () => {
    const formatted = prepareMethods(
      [rawMethodWithSimpleReturnType],
      ColumnListItemApiSymbol,
      true,
      true
    );
    expect(formatted).to.have.lengthOf(1);
    const method = formatted[0];
    expect(method.hasReturnValue).to.be.true;
    expect(method.returnValue.type).to.be.equal("string");
    expect(method.returnValue.description).to.equal("Return description");
  });

  it("should prepare with UI5 object return value", () => {
    const formatted = prepareMethods(
      [rawMethodWithUi5ReturnType],
      ColumnListItemApiSymbol,
      true,
      true
    );
    expect(formatted).to.have.lengthOf(1);
    const method = formatted[0];
    expect(method.hasReturnValue).to.be.true;
    expect(method.hasUi5ObjectReturnType).to.be.true;
    expect(method.returnValue.type).to.be.equal("sap.m.ColumnListItem");
    expect(method.returnValue.description).to.equal("Return description");
    expect(method.ui5ObjectReturnType).to.equal("sap.m.ColumnListItem");
  });
});
