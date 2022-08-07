"use strict";
const expect = require("chai").expect;
const ui5APIFinder = require("../../../src/core/ui5APIFinder.js");
const ui5ApiObjects = require("../../support/fixtures/ui5ApiObjects.js");
const stubber = require("../../support/stubber.js");
describe("ui5APIFinder tests", () => {
    before(() => {
        stubber.stubUI5Service();
    });
    after(() => {
        stubber.restore();
    });
    it("Should find the object", () => {
        const found = ui5APIFinder.findUi5ApiObjects({
            name: "event",
        });
        expect(found[0]).to.deep.equal(ui5ApiObjects["sap.ui.base.EventProvider"]);
    });
    it("Should find the object ignoring case", () => {
        const found = ui5APIFinder.findUi5ApiObjects({
            name: "Event",
        });
        expect(found[0]).to.deep.equal(ui5ApiObjects["sap.ui.base.EventProvider"]);
    });
    it("Should not find the object due to case search", () => {
        const found = ui5APIFinder.findUi5ApiObjects({
            name: "event",
            ignoreCase: false,
        });
        expect(found).to.equal(null);
    });
    it("Should return null if object not found", () => {
        const found = ui5APIFinder.findUi5ApiObjects({
            name: "button",
        });
        expect(found).to.equal(null);
    });
    it("Should return searched object by name", () => {
        expect(ui5APIFinder.findUi5ObjectByName("sap.m.Tree")).to.deep.equal(ui5ApiObjects["sap.m.Tree"]);
    });
    it("Should return searched object by name ignoring case", () => {
        expect(ui5APIFinder.findUi5ObjectByName("sap.m.tree")).to.deep.equal(ui5ApiObjects["sap.m.Tree"]);
    });
    it("Should not return searched object by due to case search", () => {
        expect(ui5APIFinder.findUi5ObjectByName("sap.m.tree", false)).to.be.undefined;
    });
    it("Should return searched object by basename ignoring case", () => {
        expect(ui5APIFinder.findUi5ObjectByBasename("tree")).to.deep.equal([
            ui5ApiObjects["sap.m.Tree"],
        ]);
    });
    it("Should return searched object by basename", () => {
        expect(ui5APIFinder.findUi5ObjectByBasename("Tree")).to.deep.equal([
            ui5ApiObjects["sap.m.Tree"],
        ]);
    });
    it("Should not return searched object by basename due to case search", () => {
        expect(ui5APIFinder.findUi5ObjectByBasename("tree", false)).to.equal(null);
    });
});
//# sourceMappingURL=ui5APIFinder.test.js.map