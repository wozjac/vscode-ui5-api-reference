[![Build Status](https://app.travis-ci.com/wozjac/vscode-ui5-api-reference.svg?branch=main)](https://app.travis-ci.com/wozjac/vscode-ui5-api-reference)
[![GitHub license](https://img.shields.io/github/license/wozjac/vscode-ui5-api-reference)](https://github.com/wozjac/vscode-ui5-api-reference/blob/main/LICENSE)

# VSCode-UI5: API reference

VS Code extension - SAP/Open UI5 reference view in a side bar view.

## Features

- show/hide desciptions
- filtering options (show only members like properties, aggregations)
- full API (with inherited members)

## Installation

Search & install the extension via VSCode Extensions.

## Usage

After installation a new icon is available:  
![Search icon](https://publicrepo.vipserv.org/images/vscode-api/icon-sidebar.png)  
API side bar can be also opened using command:
![show-command](https://publicrepo.vipserv.org/images/vscode-api/show-command.png)

### Basic search

- if an UI5 object can be matched with the search input, it will be displayed immadiately,
  otherwise the hitlist is showed
  ![Basic search](https://publicrepo.vipserv.org/images/vscode-api/basic-search.gif)

- search can be done with or without namespace
- search can be also triggered using command:
  ![Search command](https://publicrepo.vipserv.org/images/vscode-api/search-command.gif)

- clicking on the object name or method, property etc. will open the original UI5 API page in your default browser

### Filtering

- API can be filtered, for example typing "hbox add" will show only members matching "add".
  Filtering works also if the hitlist if firstly displayed.
- displaying specific members: ?p will display only properties, ?c - constructor, ?e - events, ?m - methods;
  ![Filtering](https://publicrepo.vipserv.org/images/vscode-api/search-members1.gif)

- members can be also filtered by a search term, for example to display only methods with "add", type "hbox ?madd"
  ![Filtering](https://publicrepo.vipserv.org/images/vscode-api/search-members2.gif)

### XML views

API can be also opened for controls in XML views; use the context menu option on a selected control:
![Context menu](https://publicrepo.vipserv.org/images/vscode-api/context.gif)

## Extension Settings

This extension contributes the following settings:

- `apiURL`: The path to SAPUI5/OpenUI5 version; default is <https://openui5.hana.ondemand.com/1.96.10>  
  **Please remember to reload VS Code after changing this setting!**

## Release Notes

See CHANGELOG.md

## License

This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Author

Feel free to contact me:

- wozjac@zoho.com
- [jacekw.dev](https://jacekw.dev)
- Twitter (<https://twitter.com/jacekwoz>)
- LinkedIn (<https://www.linkedin.com/in/jacek-wznk>)
