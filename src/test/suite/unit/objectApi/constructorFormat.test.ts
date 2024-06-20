import { expect } from "chai";
import * as stubber from "../../../support/stubber.js";
import { prepareConstructor } from "../../../../objectApi/constructorFormat.js";
import { Ui5ObjectConstructor, LibraryApiSymbol } from "../../../../core/types.js";
import { ColumnListItemApiSymbol } from "../common.js";

const rawConstructor: Ui5ObjectConstructor = {
  description: "This is <code>constructor</code>",
  parameters: [
    {
      description: "This is constructor <code>param</code>",
      type: "string",
      name: "myName",
      optional: false,
      parameterProperties: [
        {
          name: "property",
          description: "Parameter <code>property</code>",
        },
      ],
    },
  ],
};

describe("constructorFormat tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  it("should prepare basic fields with parameters", () => {
    const formattedConstructor = prepareConstructor(rawConstructor, ColumnListItemApiSymbol, true);

    expect(formattedConstructor).not.to.be.undefined;
    expect(formattedConstructor.description).to.equal("This is constructor");
    expect(formattedConstructor.parameters).to.have.lengthOf(1);

    if (formattedConstructor.parameters) {
      const parameter = formattedConstructor.parameters[0];
      expect(parameter.description).to.equal("This is constructor param");
      expect(parameter.objectName).to.equal("sap.m.ColumnListItem");
      expect(parameter.hasProperties).to.be.true;
      expect(parameter.parameterProperties).to.have.lengthOf(1);

      if (parameter.parameterProperties) {
        const paramProperty = parameter.parameterProperties[0];
        expect(paramProperty.name).to.equal("property");
        expect(paramProperty.description).to.equal("Parameter property");
        expect(paramProperty.objectName).to.equal("sap.m.ColumnListItem");
      }
    }
  });
});
