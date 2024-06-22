import { expect } from "chai";
import * as ui5ApiService from "../../../../core/ui5ApiService.js";
import * as stubber from "../../../support/stubber.js";

describe("ui5ApiBuffer tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should return normalized name", () => {
    expect(ui5ApiService.getNormalizedName("module:sap/base/assert")).to.equal("sap.base.assert");
    expect(ui5ApiService.getNormalizedName("sap/base/assert")).to.equal("sap.base.assert");
  });

  it("should return API doc URL", () => {
    expect(
      ui5ApiService.getUi5ObjectApiDocUrl("module:sap/base/assert", "http://somewhere")
    ).to.equal("http://somewhere/#/api/module%3Asap%2Fbase%2Fassert");

    expect(ui5ApiService.getUi5ObjectApiDocUrl("sap/base/assert", "http://somewhere")).to.equal(
      "http://somewhere/#/api/sap/base/assert"
    );
  });

  it("should enhance API index node", () => {
    ui5ApiService.setApiBaseURL("http://somewhere");

    const result = ui5ApiService.enhanceApiIndexNode({
      name: "sap.m.Button",
      kind: "class",
      lib: "sap.m",
      displayName: "sap.m.Button",
      visibility: "public",
    });

    expect(result.apiDocUrl).to.equal("http://somewhere/#/api/sap.m.Button");
    expect(result.library).to.equal("sap.m");
    expect(result.basename).to.equal("Button");
    expect(result.name).to.equal("sap.m.Button");
    expect(result.originalName).to.equal("sap.m.Button");
    expect(result.kind).to.equal("class");
  });
});
