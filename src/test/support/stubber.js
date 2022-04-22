const sinon = require("sinon");
const ui5APIService = require("../../src/core/ui5APIService.js");
const apiIndexFixture = require("../support/fixtures/apiIndex.js");
const apiObjectsFixture = require("../support/fixtures/ui5ApiObjects.js");

function stubUI5Service() {
  sinon.stub(ui5APIService, "getApiIndex").returns(
    apiIndexFixture
  );

  sinon.stub(ui5APIService, "getUi5Objects").returns(
    apiObjectsFixture
  );
}

function restore() {
  sinon.restore();
}

module.exports = {
  stubUI5Service,
  restore
};