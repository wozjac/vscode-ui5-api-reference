import * as vscode from "vscode";
import * as ui5APIService from "../core/ui5ApiService.js";
import * as ui5APIFormatter from "../objectApi/objectApiFormat.js";
import * as ui5APIFinder from "../search/ui5ApiFinder.js";
import * as constants from "../core/constants.js";
import * as favorites from "../panelFeatures/favorites.js";
import * as filtering from "../panelFeatures/apiDocsFiltering.js";
import Mustache from "mustache";
import { TemplatesContent } from "../core/dataSource.js";

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
  private webviewView: vscode.WebviewView;
  private templates: TemplatesContent;
  private globalState: GlobalState;
  private searchState: SearchState;

  constructor(webviewView: vscode.WebviewView, templates: TemplatesContent) {
    this.webviewView = webviewView;
    this.templates = templates;

    const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");

    this.globalState = {
      hitlistObjectsLimit: configuration.get("hitlistSize") as number,
      visibleObjectName: null,
    };

    this.searchState = {
      previousSearchedObjectName: null,
      searchedObjectName: null,
      memberSearchString: null,
      memberGroupFilter: null,
    };
  }

  handleSearch(message: SearchMessage) {
    clearTimeout(this.searchState.searchTimeout);
    const searchInput = message.searchInput;

    if (!searchInput) {
      this.webviewView.webview.postMessage({
        type: "emptySearch",
      });

      if (this.searchState.memberGroupFilter) {
        this.searchState.memberGroupFilter = null;
        this.searchState.memberSearchString = null;

        if (this.globalState.visibleObjectName) {
          this.handleGetDesignAPIHtml(
            { ui5Object: this.globalState.visibleObjectName }
            //"oneSearchResult"
          );
        }
      }

      return;
    }

    this.searchState.searchTimeout = setTimeout(() => {
      if (searchInput === "?") {
        return;
      }

      const justMembersFiltering = searchInput.match(/(^\?[mpeac])(.*)$/i);

      if (justMembersFiltering) {
        // no API shown
        if (!this.globalState.visibleObjectName) {
          return;
        }

        this.searchState.memberGroupFilter = justMembersFiltering[1].replace("?", "").toLowerCase();

        const memberSearchPart = justMembersFiltering[2].trim();

        if (
          memberSearchPart &&
          this.searchState.memberGroupFilter !== constants.memberGroupFilter.construct
        ) {
          this.searchState.memberSearchString = memberSearchPart;
        } else {
          this.searchState.memberSearchString = null;
        }

        this.handleGetDesignAPIHtml(
          { ui5Object: this.globalState.visibleObjectName }
          // "oneSearchResult"
        );

        return;
      }

      const parts = searchInput.split(" ");

      if (parts.length === 2 && parts[1]) {
        this.searchState.previousSearchedObjectName = this.searchState.searchedObjectName;
        this.searchState.searchedObjectName = parts[0];

        // if (parts.length === 2 && parts[1]) {
        this.searchState.memberSearchString = parts[1];
        const match = this.searchState.memberSearchString.match(/(\?[mpeac])(.*)/i);

        if (match) {
          this.searchState.memberGroupFilter = match[1].replace("?", "").toLowerCase();
          const memberSearchPart = match[2].trim();

          if (
            memberSearchPart &&
            this.searchState.memberGroupFilter !== constants.memberGroupFilter.construct
          ) {
            this.searchState.memberSearchString = memberSearchPart;
          } else {
            this.searchState.memberSearchString = null;
          }
        } else {
          this.searchState.memberGroupFilter = null;
        }
      } else {
        this.searchState.searchedObjectName = searchInput.trim();

        if (this.searchState.previousSearchedObjectName !== this.searchState.searchedObjectName) {
          this.globalState.visibleObjectName = null;
        }

        this.searchState.memberSearchString = null;
        this.searchState.memberGroupFilter = null;
      }

      //skip single ? sign
      if (this.searchState.memberSearchString === "?") {
        this.searchState.memberSearchString = null;
      }

      const foundObjects = ui5APIFinder.findUi5ApiObjects({
        name: this.searchState.searchedObjectName,
      });

      const configuration = vscode.workspace.getConfiguration("UI5ReferencePanel");
      this.globalState.hitlistObjectsLimit = configuration.get("hitlistSize") as number;

      if (foundObjects && foundObjects.length > 0) {
        if (foundObjects.length > this.globalState.hitlistObjectsLimit) {
          this.webviewView.webview.postMessage({
            type: "tooManySearchResults",
            notification: `Found ${foundObjects.length} objects. Please narrow your search.`,
          });
        } else if (
          foundObjects.length > 1 &&
          foundObjects.length <= this.globalState.hitlistObjectsLimit
        ) {
          this.webviewView.webview.postMessage({
            type: "multipleSearchResults",
            result: foundObjects,
          });
        } else {
          this.handleGetDesignAPIHtml({ ui5Object: foundObjects[0].name }); // , "oneSearchResult");
        }
      } else {
        this.webviewView.webview.postMessage({
          type: "noSearchResults",
          notification: "Nothing found",
        });
      }
    }, 500);
  }

  handleGetDesignAPIHtml(message: GetDesignApiMessage) {
    this.globalState.visibleObjectName = message.ui5Object;

    if (message.source === "favorite") {
      this.searchState.memberGroupFilter = null;
      this.searchState.memberSearchString = null;
    }

    const designAPIHtml = this.getDesignAPIHtml(message.ui5Object);

    if (!designAPIHtml) {
      this.webviewView.webview.postMessage({
        type: "designAPINotFound",
        notification: "Design API not found",
      });
    } else {
      if (message.source === "hitlist" || message.source === "favorite") {
        this.webviewView.webview.postMessage({
          type: "showDesignAPI",
          result: designAPIHtml,
        });
      } else {
        this.webviewView.webview.postMessage({
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

    this.webviewView.webview.postMessage({
      type: "updateFavorites",
      favorites: favorites.getFavorites(),
    });
  }

  getDesignAPI(ui5ObjectName: string) {
    let designApi = ui5APIService.getUi5ObjectDesignApi(ui5ObjectName);

    if (!designApi) {
      return;
    }

    if (this.searchState.memberSearchString || this.searchState.memberGroupFilter) {
      designApi = filtering.filterApiMembers(
        designApi,
        this.searchState.memberSearchString,
        this.searchState.memberGroupFilter
      );
    }

    return ui5APIFormatter.getFormattedObjectApi(designApi, true, true);
  }

  triggerSearch(input: string) {
    this.webviewView.webview.postMessage({
      type: "triggerSearch",
      input,
    });
  }

  triggerWebviewResolved() {
    const favs = favorites.getFavorites();

    this.webviewView.webview.postMessage({
      type: "webviewResolved",
      favorites: favs,
    });
  }

  getDesignAPIHtml(ui5ObjectName: string) {
    const designAPI = this.getDesignAPI(ui5ObjectName);

    if (!designAPI) {
      return null;
    } else {
      return Mustache.render(this.templates.objectAPI, designAPI, {
        membersTemplate: this.templates.members,
      });
    }
  }
}
