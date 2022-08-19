import { expect } from "chai";
import * as stubber from "../../../support/stubber";
import { prepareEvents } from "../../../../objectApi/eventFormat";
import { Ui5ObjectEvent, LibraryApiSymbol } from "../../../../core/types";
import { ui5ObjectApi } from "./common";

const rawEvent: Ui5ObjectEvent = {
  description: "This is <code>event</code>",
  name: "myEvent",
  visibility: "public",
};

const rawEventDeprecated = Object.assign({}, rawEvent);

rawEventDeprecated.deprecated = {
  text: "No longer used",
};

const rawEventWithParams = Object.assign({}, rawEvent);

rawEventWithParams.parameters = [
  {
    name: "myParam",
    description: "This is param",
    optional: false,
    type: "string",
  },
];

describe("eventFormat tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should prepare basic fields", () => {
    const formatted = prepareEvents([rawEvent], ui5ObjectApi, true);
    expect(formatted).to.have.lengthOf(1);
    const event = formatted[0];
    expect(event.description).to.equal("This is event");
    expect(event.name).to.equal("myEvent");
    expect(event.objectName).to.equal("sap.m.ColumnListItem");
    expect(event.apiDocUrl).to.equal(
      "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem/events/myEvent"
    );
  });

  it("should prepare deprecated", () => {
    const formatted = prepareEvents([rawEventDeprecated], ui5ObjectApi, true);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0].description).to.equal("[DEPRECATED! No longer used] This is event");
  });

  it("should prepare event parameters", () => {
    const formatted = prepareEvents([rawEventDeprecated], ui5ObjectApi, true);
    expect(formatted).to.have.lengthOf(1);
    expect(formatted[0]).not.to.be.undefined;
  });
});
