"use strict";
(function () {
    // eslint-disable-next-line
    const vscode = acquireVsCodeApi();
    const elements = {
        searchInputElement: $("#vsc-ui5-ar-search-input"),
        messagesElement: $("#vsc-ui5-ar-messages"),
        hitlistElement: $("#vsc-ui5-ar-hits"),
        apiDocsElement: $("#vsc-ui5-ar-api")
    };
    elements.searchInputElement.on("keyup", () => {
        vscode.postMessage({ type: "search", searchInput: elements.searchInputElement.val() });
    });
    window.addEventListener("message", event => {
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
        showObjectDesignAPI(message.result);
    }
    function handleOneSearchResult(message) {
        elements.hitlistElement.empty();
        setNotification(null);
        showObjectDesignAPI(message.result);
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
    function showObjectDesignAPI(designAPIHtml) {
        elements.apiDocsElement.empty();
        unregisterUi5ObjectLinkHandlers();
        elements.apiDocsElement.append(designAPIHtml);
        registerUi5ObjectLinkHandlers();
        removeEmptyBorrowedSections();
    }
    ;
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
        objectNameLink.on("click", (event) => {
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
    }
    function unregisterUi5ObjectLinkHandlers() {
        elements.apiDocsElement.off("click", ".vsc-ui5-ar-expand-link");
        elements.apiDocsElement.off("click", "#vsc-ui5-ar-object-name");
        elements.apiDocsElement.off("click", "#vsc-ui5-ar-show-descriptions");
        elements.apiDocsElement.off("click", ".vsc-ui5-ar-return-type-link");
        elements.apiDocsElement.off("click", ".vsc-ui5-ar-api-member-name");
    }
    function expandCollapseDescriptions() {
        const button = $("#vsc-ui5-ar-show-descriptions");
        if (button.text() === "Show descriptions") {
            button.text("Hide descriptions");
            elements.apiDocsElement.find(".vsc-ui5-ar-object-description").show();
        }
        else {
            button.text("Show descriptions");
            elements.apiDocsElement.find(".vsc-ui5-ar-object-description").hide();
        }
    }
    function showHitList(ui5Objects) {
        elements.hitlistElement.empty();
        let htmlElement;
        for (const ui5Object of ui5Objects) {
            htmlElement = $(`<li>
          <a href="#" class="vsc-ui5-ar-link" title="{{path}}">${ui5Object.name}</a>
        </li>`);
            htmlElement.on("click", {
                name: ui5Object.name
            }, (event) => {
                vscode.postMessage({ type: "getDesignAPIHtml", ui5Object: event.data.name, source: "hitlist" });
            });
            htmlElement.appendTo(elements.hitlistElement);
        }
        elements.hitlistElement.append("<hr class=\"vsc-ui5-ar-hr\"/>");
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
        }
        else {
            elements.messagesElement.hide();
        }
    }
}());
//# sourceMappingURL=main.js.map