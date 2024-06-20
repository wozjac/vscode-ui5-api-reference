import { expect } from "chai";
import * as ui5ApiBuffer from "../../../../core/ui5ApiBuffer.js";
import * as stubber from "../../../support/stubber.js";
import * as vscode from "vscode";
import { ColumnListItemApiSymbol, BaseObjectApiSymbol } from "../../unit/common.js";

describe("ui5ApiBuffer tests", () => {
  before(() => {
    stubber.stubUI5Service();
  });

  after(() => {
    stubber.restore();
  });

  beforeEach(() => {
    ui5ApiBuffer.resetBuffer();
  });

  it("should find objects in the buffer", () => {
    ui5ApiBuffer.addToObjectDesignApiBuffer(ColumnListItemApiSymbol);
    ui5ApiBuffer.addToObjectDesignApiBuffer(BaseObjectApiSymbol);

    expect(ui5ApiBuffer.searchObjectDesignApiBuffer("sap.m.ColumnListItem")).to.equal(
      ColumnListItemApiSymbol
    );

    expect(ui5ApiBuffer.searchObjectDesignApiBuffer("sap.ui.base.Object")).to.equal(
      BaseObjectApiSymbol
    );
  });

  it("should return undefined for an object not present in the buffer", () => {
    ui5ApiBuffer.addToObjectDesignApiBuffer(ColumnListItemApiSymbol);
    ui5ApiBuffer.addToObjectDesignApiBuffer(BaseObjectApiSymbol);
    expect(ui5ApiBuffer.searchObjectDesignApiBuffer("sap.m.ColumnList")).to.be.undefined;
  });

  it("should not add the same objects again", () => {
    ui5ApiBuffer.addToObjectDesignApiBuffer(ColumnListItemApiSymbol);
    ui5ApiBuffer.addToObjectDesignApiBuffer(ColumnListItemApiSymbol);
    ui5ApiBuffer.addToObjectDesignApiBuffer(BaseObjectApiSymbol);
    ui5ApiBuffer.addToObjectDesignApiBuffer(BaseObjectApiSymbol);
    expect(ui5ApiBuffer.getBufferLength()).to.equal(2);
  });

  it("should shift the buffer when limit is reached", () => {
    ui5ApiBuffer.addToObjectDesignApiBuffer(ColumnListItemApiSymbol);

    for (let i = 0; i <= 29; i++) {
      const o = Object.assign({}, BaseObjectApiSymbol);
      o.name = `${o.name}${i}`;
      ui5ApiBuffer.addToObjectDesignApiBuffer(o);
    }

    ui5ApiBuffer.addToObjectDesignApiBuffer(BaseObjectApiSymbol);
    expect(ui5ApiBuffer.getBufferLength()).to.equal(30);
  });
});
