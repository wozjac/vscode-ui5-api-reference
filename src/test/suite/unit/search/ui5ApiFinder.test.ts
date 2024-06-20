import { expect } from "chai";
import * as ui5ApiFinder from "../../../../search/ui5ApiFinder.js";
import ui5ApiObjects from "../../../support/fixtures/ui5ApiObjects.js";
import * as stubber from "../../../support/stubber.js";

describe("ui5ApiFinder tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("Should find the object", () => {
    const found = ui5ApiFinder.findUi5ApiObjects({
      name: "event",
    });

    expect(found).not.to.be.undefined;

    if (found) {
      expect(found[0]).to.deep.equal(ui5ApiObjects["sap.ui.base.EventProvider"]);
    }
  });

  it("Should find the object ignoring case", () => {
    const found = ui5ApiFinder.findUi5ApiObjects({
      name: "Event",
    });

    expect(found).not.to.be.undefined;

    if (found) {
      expect(found[0]).to.deep.equal(ui5ApiObjects["sap.ui.base.EventProvider"]);
    }
  });

  it("Should not find the object due to case search", () => {
    const found = ui5ApiFinder.findUi5ApiObjects({
      name: "event",
      ignoreCase: false,
    });

    expect(found).to.equal(undefined);
  });

  it("Should return undefined if object not found", () => {
    const found = ui5ApiFinder.findUi5ApiObjects({
      name: "button",
    });

    expect(found).to.equal(undefined);
  });

  it("Should return searched object by name", () => {
    expect(ui5ApiFinder.findUi5ObjectByName("sap.m.Tree")).to.deep.equal(
      ui5ApiObjects["sap.m.Tree"]
    );
  });

  it("Should return searched object by name ignoring case", () => {
    expect(ui5ApiFinder.findUi5ObjectByName("sap.m.tree")).to.deep.equal(
      ui5ApiObjects["sap.m.Tree"]
    );
  });

  it("Should not return searched object by due to case search", () => {
    expect(ui5ApiFinder.findUi5ObjectByName("sap.m.tree", false)).to.be.undefined;
  });

  it("Should return searched object by basename ignoring case", () => {
    expect(ui5ApiFinder.findUi5ObjectByBasename("tree")).to.deep.equal([
      ui5ApiObjects["sap.m.Tree"],
    ]);
  });

  it("Should return searched object by basename", () => {
    expect(ui5ApiFinder.findUi5ObjectByBasename("Tree")).to.deep.equal([
      ui5ApiObjects["sap.m.Tree"],
    ]);
  });

  it("Should not return searched object by basename due to case search", () => {
    expect(ui5ApiFinder.findUi5ObjectByBasename("tree", false)).to.equal(undefined);
  });
});
