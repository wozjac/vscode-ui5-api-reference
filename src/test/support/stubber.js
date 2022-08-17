import * as sinon from "sinon";
import * as ui5APIService from "../../core/ui5ApiService";
import apiIndexFixture from "./fixtures/apiIndex";
import apiObjectsFixture from "./fixtures/ui5ApiObjects";

export function stubUI5Service() {
  sinon.stub(ui5APIService, "fetchApiIndex").returns(apiIndexFixture);
  sinon.stub(ui5APIService, "getUi5Objects").returns(apiObjectsFixture);
}

export function restore() {
  sinon.restore();
}
