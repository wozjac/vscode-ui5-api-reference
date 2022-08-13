const expect = require("chai").expect;
const ui5APIFormatter = require("../../../core/ui5APIFormatter.js");
const sapUiCoreApi = require("../../support/fixtures/sapUiCoreApi.js");
const stubber = require("../../support/stubber.js");

describe("ui5APIFormatter tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should return formatted ui5 api object (EventProvider)", () => {
    const api = ui5APIFormatter.getFormattedObjectApi(sapUiCoreApi.symbols[1]);
    expect(api).not.to.be.null;
    expect(api.hasConstructorParams).to.be.false;
    expect(api.hasProperties).to.be.false;
    expect(api.hasConstructor).to.be.true;
    expect(api.hasMethods).to.be.true;
    expect(api.hasEvents).to.be.false;
    expect(api.methods).to.have.length(7);
  });

  it("should return formatted ui5 api object (Tree)", () => {
    const api = ui5APIFormatter.getFormattedObjectApi(sapUiCoreApi.symbols[0]);
    expect(api).not.to.be.null;
    expect(api.events).to.have.length(1);
    expect(api.methods).to.have.length(13);
    expect(api.hasProperties).to.be.false;
    expect(api.hasConstructor).to.be.true;
  });

  it("Should format JS doc with html and corrected headers", () => {
    expect(
      ui5APIFormatter.formatJsDoc(
        "This <h1>is</h1> object{@jsdoc} <p class='css'>with</p> #member " + "<h5>member</h5>."
      )
    ).to.equal("This <h5>is</h5> object with <h5>member</h5>.");
  });

  it("Should format JS doc without any html except headers", () => {
    expect(
      ui5APIFormatter.formatJsDoc(
        "This <h1>is</h1> object{@jsdoc} <p class='css'>with</p> #member " + "<h5>member</h5>.",
        true
      )
    ).to.equal("This is object with member.");
  });
});
