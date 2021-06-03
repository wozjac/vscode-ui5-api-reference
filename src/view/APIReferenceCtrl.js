const vscode = require("vscode");
const ui5APIService = require("../core/ui5APIService.js");
const ui5APIFormatter = require("../core/ui5APIFormatter.js");
const ui5APIFinder = require("../core/ui5APIFinder.js");
const constants = require("../core/constants.js");
const Mustache = require("mustache");

class APIReferenceCtrl {
  constructor(webviewView, templates) {
    this._webviewView = webviewView;
    this._templates = templates;

    this._globalState = {
      hitlistObjectsLimit: 25,
      visibleObjectName: null
    };

    this._searchState = {
      previousSearchedObjectName: null,
      searchedObjectName: null,
      memberSearchString: null,
      memberGroupFilter: null,
      searchTimeout: 0
    };
  }

  handleSearch(message) {
    clearTimeout(this._searchState.searchTimeout);
    const searchInput = message.searchInput;

    if (!searchInput) {
      this._webviewView.webview.postMessage({
        type: "emptySearch"
      });

      return;
    }

    this._searchState.searchTimeout = setTimeout(() => {
      const parts = searchInput.split(" ");
      this._searchState.previousSearchedObjectName = this._searchState.searchedObjectName;
      this._searchState.searchedObjectName = parts[0];

      if (parts.length === 2 && parts[1]) {
        this._searchState.memberSearchString = parts[1];
        const match = this._searchState.memberSearchString.match(/(\?[mpeac])(.*)/i);

        if (match) {
          this._searchState.memberGroupFilter = match[1].replace("?", "").toLowerCase();
          const memberSearchPart = match[2].trim();

          if (memberSearchPart &&
            this._searchState.memberGroupFilter !== constants.memberGroupFilter.construct) {

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

      const foundObjects = ui5APIFinder.findUi5ApiObjects({ name: this._searchState.searchedObjectName });

      if (foundObjects && foundObjects.length > 0) {
        if (foundObjects.length > this._globalState.hitlistObjectsLimit) {
          this._webviewView.webview.postMessage({
            type: "tooManySearchResults",
            notification: `Found ${foundObjects.length} objects. Please narrow your search.`
          });
        } else if (foundObjects.length > 1 && foundObjects.length <= this._globalState.hitlistObjectsLimit) {
          this._webviewView.webview.postMessage({
            type: "multipleSearchResults",
            result: foundObjects
          });
        } else {
          this.handleGetDesignAPIHtml({ ui5Object: foundObjects[0].name }, "oneSearchResult");
        }
      } else {
        this._webviewView.webview.postMessage({
          type: "noSearchResults",
          notification: "Nothing found"
        });
      }
    }, 500);
  }

  handleGetDesignAPIHtml(message) {
    this._globalState.visibleObjectName = message.ui5Object;
    const designAPIHtml = this.getDesignAPIHtml(message.ui5Object);

    if (!designAPIHtml) {
      this._webviewView.webview.postMessage({
        type: "designAPINotFound",
        notification: "Design API not found"
      });
    } else {
      if (message.source === "hitlist") {
        this._webviewView.webview.postMessage({
          type: "showDesignAPI",
          result: designAPIHtml
        });
      } else {
        this._webviewView.webview.postMessage({
          type: "oneSearchResult",
          result: designAPIHtml
        });
      }
    }
  }

  handleOpenURL(apiDocURL) {
    vscode.env.openExternal(vscode.Uri.parse(apiDocURL));
  }

  getDesignAPI(ui5ObjectPath) {
    let designApi = ui5APIService.getUi5ObjectDesignApi(ui5ObjectPath);

    if (!designApi) {
      return;
    }

    if (this._searchState.memberSearchString || this._searchState.memberGroupFilter) {
      designApi = ui5APIFormatter.filterApiMembers(
        designApi,
        this._searchState.memberSearchString,
        this._searchState.memberGroupFilter);
    }

    designApi = ui5APIFormatter.getFormattedObjectApi(designApi, true, true);

    return designApi;
  }

  triggerSearch(input) {
    this._webviewView.webview.postMessage({
      type: "triggerSearch",
      input
    });
  }

  getDesignAPIHtml(ui5Object) {
    const designAPI = this.getDesignAPI(ui5Object);

    if (!designAPI) {
      return null;
    } else {
      return Mustache.render(this._templates.objectAPI, designAPI, { membersTemplate: this._templates.members });
    }
  }
}

module.exports = APIReferenceCtrl;