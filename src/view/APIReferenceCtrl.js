const vscode = require("vscode");
const ui5APIService = require("../core/ui5ApiService.js");
const ui5APIFormatter = require("../objectApi/objectApiFormat.js");
const ui5APIFinder = require("../search/ui5ApiFinder.js");
const constants = require("../core/constants.js");
const favorites = require("../panelFeatures/favorites");
const filtering = require("../panelFeatures/apiDocsFiltering");
const Mustache = require("mustache");

class APIReferenceCtrl {
  constructor(webviewView, templates) {
    this._webviewView = webviewView;
    this._templates = templates;

    this._globalState = {
      hitlistObjectsLimit: 25,
      visibleObjectName: null,
    };

    this._searchState = {
      previousSearchedObjectName: null,
      searchedObjectName: null,
      memberSearchString: null,
      memberGroupFilter: null,
      searchTimeout: 0,
    };
  }

  handleSearch(message) {
    clearTimeout(this._searchState.searchTimeout);
    const searchInput = message.searchInput;

    if (!searchInput) {
      this._webviewView.webview.postMessage({
        type: "emptySearch",
      });

      if (this._searchState.memberGroupFilter) {
        this._searchState.memberGroupFilter = null;

        if (this._globalState.visibleObjectName) {
          this.handleGetDesignAPIHtml(
            { ui5Object: this._globalState.visibleObjectName },
            "oneSearchResult"
          );
        }
      }

      return;
    }

    this._searchState.searchTimeout = setTimeout(() => {
      if (searchInput === "?") {
        return;
      }

      const justMembersFiltering = searchInput.match(/(\?[mpeac])(.*)/i);

      if (justMembersFiltering) {
        this._searchState.memberGroupFilter = justMembersFiltering[1]
          .replace("?", "")
          .toLowerCase();

        this.handleGetDesignAPIHtml(
          { ui5Object: this._globalState.visibleObjectName },
          "oneSearchResult"
        );

        return;
      }

      const parts = searchInput.split(" ");
      this._searchState.previousSearchedObjectName = this._searchState.searchedObjectName;
      this._searchState.searchedObjectName = parts[0];

      if (parts.length === 2 && parts[1]) {
        this._searchState.memberSearchString = parts[1];
        const match = this._searchState.memberSearchString.match(/(\?[mpeac])(.*)/i);

        if (match) {
          this._searchState.memberGroupFilter = match[1].replace("?", "").toLowerCase();
          const memberSearchPart = match[2].trim();

          if (
            memberSearchPart &&
            this._searchState.memberGroupFilter !== constants.memberGroupFilter.construct
          ) {
            this._searchState.memberSearchString = memberSearchPart;
          } else {
            this._searchState.memberSearchString = null;
          }
        } else {
          this._searchState.memberGroupFilter = null;
        }
      } else {
        if (this._searchState.previousSearchedObjectName !== this._searchState.searchedObjectName) {
          this._globalState.visibleObjectName = null;
        }

        this._searchState.memberSearchString = null;
        this._searchState.memberGroupFilter = null;
      }

      //skip single ? sign
      if (this._searchState.memberSearchString === "?") {
        this._searchState.memberSearchString = null;
      }

      const foundObjects = ui5APIFinder.findUi5ApiObjects({
        name: this._searchState.searchedObjectName,
      });

      if (foundObjects && foundObjects.length > 0) {
        if (foundObjects.length > this._globalState.hitlistObjectsLimit) {
          this._webviewView.webview.postMessage({
            type: "tooManySearchResults",
            notification: `Found ${foundObjects.length} objects. Please narrow your search.`,
          });
        } else if (
          foundObjects.length > 1 &&
          foundObjects.length <= this._globalState.hitlistObjectsLimit
        ) {
          this._webviewView.webview.postMessage({
            type: "multipleSearchResults",
            result: foundObjects,
          });
        } else {
          this.handleGetDesignAPIHtml({ ui5Object: foundObjects[0].name }, "oneSearchResult");
        }
      } else {
        this._webviewView.webview.postMessage({
          type: "noSearchResults",
          notification: "Nothing found",
        });
      }
    }, 500);
  }

  handleGetDesignAPIHtml(message) {
    this._globalState.visibleObjectName = message.ui5Object;

    if (message.source === "favorite") {
      this._searchState.memberGroupFilter = undefined;
      this._searchState.memberSearchString = undefined;
    }

    const designAPIHtml = this.getDesignAPIHtml(message.ui5Object);

    if (!designAPIHtml) {
      this._webviewView.webview.postMessage({
        type: "designAPINotFound",
        notification: "Design API not found",
      });
    } else {
      if (message.source === "hitlist" || message.source === "favorite") {
        this._webviewView.webview.postMessage({
          type: "showDesignAPI",
          result: designAPIHtml,
        });
      } else {
        this._webviewView.webview.postMessage({
          type: "oneSearchResult",
          result: designAPIHtml,
        });
      }
    }
  }

  handleOpenURL(apiDocURL) {
    vscode.env.openExternal(vscode.Uri.parse(apiDocURL));
  }

  handleChangeFavorite(message) {
    if (message.operation === "remove") {
      favorites.removeFavorite(message.ui5Object);
    } else {
      favorites.addFavorite(message.ui5Object);
    }

    this._webviewView.webview.postMessage({
      type: "updateFavorites",
      favorites: favorites.getFavorites(),
    });
  }

  getDesignAPI(ui5ObjectPath) {
    let designApi = ui5APIService.getUi5ObjectDesignApi(ui5ObjectPath);

    if (!designApi) {
      return;
    }

    if (this._searchState.memberSearchString || this._searchState.memberGroupFilter) {
      designApi = filtering.filterApiMembers(
        designApi,
        this._searchState.memberSearchString,
        this._searchState.memberGroupFilter
      );
    }

    return ui5APIFormatter.getFormattedObjectApi(designApi, true, true);
  }

  triggerSearch(input) {
    this._webviewView.webview.postMessage({
      type: "triggerSearch",
      input,
    });
  }

  triggerWebviewResolved() {
    const favs = favorites.getFavorites();

    this._webviewView.webview.postMessage({
      type: "webviewResolved",
      favorites: favs,
    });
  }

  getDesignAPIHtml(ui5Object) {
    const designAPI = this.getDesignAPI(ui5Object);

    if (!designAPI) {
      return null;
    } else {
      return Mustache.render(this._templates.objectAPI, designAPI, {
        membersTemplate: this._templates.members,
      });
    }
  }
}

module.exports = APIReferenceCtrl;
