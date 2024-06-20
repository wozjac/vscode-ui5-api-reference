(function () {
  // eslint-disable-next-line
  const vscode = acquireVsCodeApi();

  const elements = {
    searchInputElement: $("#vsc-ui5-ar-search-input"),
    messagesElement: $("#vsc-ui5-ar-messages"),
    hitlistElement: $("#vsc-ui5-ar-hits"),
    apiDocsElement: $("#vsc-ui5-ar-api"),
    favoritesListElement: $("#vsc-ui5-ar-favorites"),
  };

  elements.searchInputElement.on("keyup", () => {
    vscode.postMessage({ type: "search", searchInput: elements.searchInputElement.val() });
  });

  window.addEventListener("message", (event) => {
    const message = event.data;

    switch (message.type) {
      case "tooManySearchResults":
        handleTooManySearchResults(message);
        break;
      case "multipleSearchResults":
        handleMultipleSearchResults(message);
        break;
      case "oneSearchResult":
        handleOneSearchResult(message);
        break;
      case "noSearchResults":
        handleNoSearchResults(message);
        break;
      case "emptySearch":
        handleEmptySearch();
        break;
      case "designAPINotFound":
        handleDesignAPINotFound(message);
        break;
      case "showDesignAPI":
        handleShowDesignAPI(message);
        break;
      case "triggerSearch":
        handleTriggerSearch(message);
        break;
      case "webviewResolved":
        handleWebviewResolved(message);
        break;
      case "updateFavorites":
        handleUpdateFavorites(message);
        break;
    }
  });

  function handleDesignAPINotFound(message) {
    setNotification(message.notification);
    elements.hitlistElement.empty();
    elements.apiDocsElement.empty();
  }

  function handleEmptySearch() {
    setNotification(null);
    elements.hitlistElement.empty();
  }

  function handleTooManySearchResults(message) {
    elements.hitlistElement.empty();
    elements.apiDocsElement.empty();
    setNotification(message.notification);
  }

  function handleShowDesignAPI(message) {
    setNotification(null);
    showObjectDesignAPI(message);
  }

  function handleOneSearchResult(message) {
    elements.hitlistElement.empty();
    setNotification(null);
    showObjectDesignAPI(message);
  }

  function handleNoSearchResults(message) {
    elements.hitlistElement.empty();
    setNotification(message.notification);
  }

  function handleMultipleSearchResults(message) {
    elements.apiDocsElement.empty();
    setNotification(null);
    showHitList(message.result);
  }

  function handleTriggerSearch(message) {
    elements.searchInputElement.val(message.input);
    vscode.postMessage({ type: "search", searchInput: message.input });
  }

  function handleUpdateFavorites(message) {
    prepareFavorites(message.favorites);
  }

  function handleWebviewResolved(message) {
    prepareFavorites(message.favorites);
  }

  function prepareFavorites(favorites) {
    elements.favoritesListElement.empty();

    for (let index = 0; index < favorites.length; index++) {
      const element = favorites[index];

      const objectLinkElement = $(`
        <a href="#" class="vsc-ui5-ar-favorite-link" title="${element}">
          ⭐${element}
        </a>`);

      const removeFavoriteLinkElement =
        $(`<a href="#" class="vsc-ui5-ar-favorite-link-remove" title="Remove from favorites" data-name="${element}">
          ➖
        </a>`);

      const listItemElement = $("<li></li>");
      objectLinkElement.appendTo(listItemElement);
      removeFavoriteLinkElement.appendTo(listItemElement);

      objectLinkElement.on(
        "click",
        {
          name: element,
        },
        (event) => {
          vscode.postMessage({
            type: "getDesignAPIHtml",
            ui5Object: event.data.name,
            source: "favorite",
          });
        }
      );

      removeFavoriteLinkElement.on(
        "click",
        {
          name: element,
        },
        (event) => {
          vscode.postMessage({
            type: "changeFavorite",
            operation: "remove",
            ui5Object: $(event.target).attr("data-name"),
          });

          const favoriteApiObjectLink = elements.apiDocsElement.find("#vsc-ui5-ar-favorite");

          if (
            favoriteApiObjectLink &&
            favoriteApiObjectLink.attr("data-name") === $(event.target).attr("data-name")
          ) {
            toggleApiObjectFavoriteLink(favoriteApiObjectLink, false);
          }
        }
      );

      listItemElement.appendTo(elements.favoritesListElement);
    }
  }

  function showObjectDesignAPI(message) {
    elements.apiDocsElement.empty();
    unregisterUi5ObjectLinkHandlers();

    elements.apiDocsElement.append(message.result);
    registerUi5ObjectLinkHandlers();
    removeEmptyBorrowedSections();
  }

  function registerUi5ObjectLinkHandlers() {
    elements.apiDocsElement.on("click", "#vsc-ui5-ar-show-descriptions", () => {
      expandCollapseDescriptions();
    });

    const objectNameLink = elements.apiDocsElement.find("#vsc-ui5-ar-object-name");

    objectNameLink.on("click", (event) => {
      vscode.postMessage({ type: "openURL", url: $(event.target).attr("data-apiDocUrl") });
    });

    const memberNameLink = elements.apiDocsElement.find(".vsc-ui5-ar-api-member-name");

    memberNameLink.on("click", (event) => {
      vscode.postMessage({ type: "openURL", url: $(event.target).attr("data-apiDocUrl") });
    });

    elements.apiDocsElement.on("click", ".vsc-ui5-ar-return-type-link", (event) => {
      vscode.postMessage({ type: "getDesignAPIHtml", ui5Object: $(event.target).text().trim() });
    });

    const extendsLinkElement = elements.apiDocsElement.find("#vsc-ui5-ar-extends-link");

    if (extendsLinkElement) {
      extendsLinkElement.on("click", () => {
        vscode.postMessage({ type: "getDesignAPIHtml", ui5Object: $(event.target).text().trim() });
      });
    }

    const favoriteLink = elements.apiDocsElement.find("#vsc-ui5-ar-favorite");

    favoriteLink.on("click", (event) => {
      const isFavorite = favoriteLink.hasClass("is-favorite");

      vscode.postMessage({
        type: "changeFavorite",
        operation: isFavorite ? "remove" : "add",
        ui5Object: $(event.target).attr("data-name"),
      });

      if (isFavorite) {
        toggleApiObjectFavoriteLink(favoriteLink, false);
      } else {
        toggleApiObjectFavoriteLink(favoriteLink, true);
      }
    });
  }

  function toggleApiObjectFavoriteLink(favoriteLinkElement, makeFavorite) {
    if (makeFavorite) {
      favoriteLinkElement.text("➖").attr("title", "Remove from favorites");
      favoriteLinkElement.addClass("is-favorite");
    } else {
      favoriteLinkElement.text("⭐").attr("title", "Add to favorites");
      favoriteLinkElement.removeClass("is-favorite");
    }
  }

  function unregisterUi5ObjectLinkHandlers() {
    elements.apiDocsElement.off("click", ".vsc-ui5-ar-expand-link");
    elements.apiDocsElement.off("click", "#vsc-ui5-ar-object-name");
    elements.apiDocsElement.off("click", "#vsc-ui5-ar-show-descriptions");
    elements.apiDocsElement.off("click", ".vsc-ui5-ar-return-type-link");
    elements.apiDocsElement.off("click", ".vsc-ui5-ar-api-member-name");
    elements.apiDocsElement.off("click", "#vsc-ui5-ar-favorite");
  }

  function expandCollapseDescriptions() {
    const button = $("#vsc-ui5-ar-show-descriptions");

    if (button.text() === "Show descriptions") {
      button.text("Hide descriptions");
      elements.apiDocsElement.find(".vsc-ui5-ar-object-description").show();
    } else {
      button.text("Show descriptions");
      elements.apiDocsElement.find(".vsc-ui5-ar-object-description").hide();
    }
  }

  function showHitList(ui5Objects) {
    elements.hitlistElement.empty();

    let htmlElement;

    for (const ui5Object of ui5Objects) {
      htmlElement = $(
        `<li>
          <a href="#" class="vsc-ui5-ar-link" title="${ui5Object.name}">${ui5Object.name}</a>
        </li>`
      );

      htmlElement.on(
        "click",
        {
          name: ui5Object.name,
        },
        (event) => {
          vscode.postMessage({
            type: "getDesignAPIHtml",
            ui5Object: event.data.name,
            source: "hitlist",
          });
        }
      );

      htmlElement.appendTo(elements.hitlistElement);
    }

    //eslint-disable-next-line
    elements.hitlistElement.append('<hr class="vsc-ui5-ar-hr"/>');
    elements.hitlistElement.show();
  }

  function removeEmptyBorrowedSections() {
    const inheritedElements = jQuery(".vsc-ui5-ar-borrowed");

    inheritedElements.each((index, element) => {
      if ($(element).children().length === 1) {
        $(element).hide();
      }
    });
  }

  function setNotification(message) {
    if (message) {
      elements.messagesElement.show();
      elements.messagesElement.find("div").text(message);
    } else {
      elements.messagesElement.hide();
    }
  }
})();
