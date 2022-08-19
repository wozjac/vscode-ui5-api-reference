import { expect } from "chai";
import * as favorites from "../../../../panelFeatures/favorites";
import * as stubber from "../../../support/stubber";
import * as vscode from "vscode";

describe("favorites tests", () => {
  before(() => {
    stubber.stubGetConfiguration({
      favorites: ["sap.f.Card", "sap.m.Button"],
    });
  });

  after(() => {
    stubber.restore();
  });

  beforeEach(() => {
    favorites.initialize(vscode.workspace.getConfiguration("UI5ReferencePanel"));
  });

  it("should have 2 favorites initially", () => {
    expect(favorites.getFavorites()).to.have.lengthOf(2);
  });

  it("should add a new favorite to the list", () => {
    favorites.addFavorite("sap.m.Header");
    const favs = favorites.getFavorites();
    expect(favs).to.have.lengthOf(3);
    expect(favs).to.include("sap.m.Header");
  });

  it("should delete sap.m.Button from the favorites", () => {
    favorites.removeFavorite("sap.m.Button");
    const favs = favorites.getFavorites();
    expect(favs).to.have.lengthOf(1);
    expect(favs).to.include("sap.f.Card");
  });

  it("should recognize empty favorites", () => {
    favorites.removeFavorite("sap.m.Button");
    favorites.removeFavorite("sap.f.Card");
    expect(favorites.isEmpty()).to.be.true;
  });

  it("should ignore if non-existent favorite is passed for remove", () => {
    favorites.removeFavorite("some");
    expect(favorites.getFavorites()).to.have.lengthOf(2);
  });

  it("should answer positively on isFavorite", () => {
    expect(favorites.isFavorite("sap.m.Button")).to.be.true;
  });

  it("should answer negatively on isFavorite", () => {
    expect(favorites.isFavorite("whatever")).to.be.false;
  });
});
