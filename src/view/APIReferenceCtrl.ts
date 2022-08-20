import * as vscode from "vscode";
import * as ui5APIService from "../core/ui5ApiService";
import * as ui5APIFormatter from "../objectApi/objectApiFormat";
import * as ui5APIFinder from "../search/ui5ApiFinder";
import * as constants from "../core/constants";
import * as favorites from "../panelFeatures/favorites";
import * as filtering from "../panelFeatures/apiDocsFiltering";
import * as mustache from "mustache";
import { TemplatesContent } from "../core/dataSource";

interface GlobalState {
  hitlistObjectsLimit: number;
  visibleObjectName: string | null;
}

interface SearchState {
  previousSearchedObjectName: string | null;
  searchedObjectName: string | null;
  memberSearchString: string | null;
  memberGroupFilter: string | null;
  searchTimeout?: ReturnType<typeof setTimeout>;
}

interface SearchMessage {
  searchInput: string;
}

interface GetDesignApiMessage {
  source?: string;
  ui5Object: string;
}

interface ChangeFavoriteMessage {
  operation: string;
  ui5Object: string;
}

export class ApiReferenceCtrl {
  private _webviewView: vscode.WebviewView;
  private _templates: TemplatesContent;
  private _globalState: GlobalState;
  private _searchState: SearchState;

  constructor(webviewView: vscode.WebviewView, templates: TemplatesContent) {
    this._webviewView = webviewView;
    this._templates = templates;

    const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");

    this._globalState = {
      hitlistObjectsLimit: configuration.get("hitlistSize") as number,
      visibleObjectName: null,
    };

    this._searchState = {
      previousSearchedObjectName: null,
      searchedObjectName: null,
      memberSearchString: null,
      memberGroupFilter: null,
    };
  }

  handleSearch(message: SearchMessage) {
    clearTimeout(this._searchState.searchTimeout);
    const searchInput = message.searchInput;

    if (!searchInput) {
      this._webviewView.webview.postMessage({
        type: "emptySearch",
      });

      if (this._searchState.memberGroupFilter) {
        this._searchState.memberGroupFilter = null;
        this._searchState.memberSearchString = null;

        if (this._globalState.visibleObjectName) {
          this.handleGetDesignAPIHtml(
            { ui5Object: this._globalState.visibleObjectName }
            //"oneSearchResult"
          );
        }
      }

      return;
    }

    this._searchState.searchTimeout = setTimeout(() => {
      if (searchInput === "?") {
        return;
      }

      const justMembersFiltering = searchInput.match(/(^\?[mpeac])(.*)$/i);

      if (justMembersFiltering) {
        // no API shown
        if (!this._globalState.visibleObjectName) {
          return;
        }

        this._searchState.memberGroupFilter = justMembersFiltering[1]
          .replace("?", "")
          .toLowerCase();

        const memberSearchPart = justMembersFiltering[2].trim();

        if (
          memberSearchPart &&
          this._searchState.memberGroupFilter !== constants.memberGroupFilter.construct
        ) {
          this._searchState.memberSearchString = memberSearchPart;
        } else {
          this._searchState.memberSearchString = null;
        }

        this.handleGetDesignAPIHtml(
          { ui5Object: this._globalState.visibleObjectName }
          // "oneSearchResult"
        );

        return;
      }

      const parts = searchInput.split(" ");

      if (parts.length === 2 && parts[1]) {
        this._searchState.previousSearchedObjectName = this._searchState.searchedObjectName;
        this._searchState.searchedObjectName = parts[0];

        // if (parts.length === 2 && parts[1]) {
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
        this._searchState.searchedObjectName = searchInput.trim();

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

      const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");
      this._globalState.hitlistObjectsLimit = configuration.get("hitlistSize") as number;

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
          this.handleGetDesignAPIHtml({ ui5Object: foundObjects[0].name }); // , "oneSearchResult");
        }
      } else {
        this._webviewView.webview.postMessage({
          type: "noSearchResults",
          notification: "Nothing found",
        });
      }
    }, 500);
  }

  handleGetDesignAPIHtml(message: GetDesignApiMessage) {
    this._globalState.visibleObjectName = message.ui5Object;

    if (message.source === "favorite") {
      this._searchState.memberGroupFilter = null;
      this._searchState.memberSearchString = null;
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

  handleOpenURL(apiDocURL: string) {
    vscode.env.openExternal(vscode.Uri.parse(apiDocURL));
  }

  handleChangeFavorite(message: ChangeFavoriteMessage) {
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

  getDesignAPI(ui5ObjectName: string) {
    let designApi = ui5APIService.getUi5ObjectDesignApi(ui5ObjectName);

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

  triggerSearch(input: string) {
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

  getDesignAPIHtml(ui5ObjectName: string) {
    const designAPI = this.getDesignAPI(ui5ObjectName);

    if (!designAPI) {
      return null;
    } else {
      return mustache.render(this._templates.objectAPI, designAPI, {
        membersTemplate: this._templates.members,
      });
    }
  }
}
