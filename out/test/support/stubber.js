"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restore = exports.stubUI5Service = void 0;
// const sinon = require("sinon");
const sinon = require("sinon");
const ui5APIService = require("../../src/core/ui5APIService.js");
const apiIndexFixture = require("./fixtures/apiIndex.js");
const apiObjectsFixture = require("./fixtures/ui5ApiObjects.js");
function stubUI5Service() {
    sinon.stub(ui5APIService, "getApiIndex").returns(apiIndexFixture);
    sinon.stub(ui5APIService, "getUi5Objects").returns(apiObjectsFixture);
}
exports.stubUI5Service = stubUI5Service;
function restore() {
    sinon.restore();
}
exports.restore = restore;
//# sourceMappingURL=stubber.js.map