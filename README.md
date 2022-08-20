[![Build Status](https://github.com/wozjac/vscode-ui5-api-reference/actions/workflows/build.yml/badge.svg)](https://github.com/wozjac/vscode-ui5-api-reference/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/wozjac/vscode-ui5-api-reference/badge.svg?branch=main)](https://coveralls.io/github/wozjac/vscode-ui5-api-reference?branch=main)
[![GitHub license](https://img.shields.io/github/license/wozjac/vscode-ui5-api-reference)](https://github.com/wozjac/vscode-ui5-api-reference/blob/main/LICENSE)

# VSCode-UI5: API reference

VS Code extension - SAP/Open UI5 reference view in a side bar view.

## Important

**Since version 1.2.1 there is a new config field for the API URL version - please
migrate your setting from the old, deprecated one.**

## Features

- show/hide desciptions
- filtering options (show only members like properties, aggregations)
- full API (with inherited members)
- favorites list for quick access

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
- displaying specific members: ?p will display only properties, ?c - constructor, ?e - events,
  ?m - methods, ?a - aggregations; for example hbox ?m will immediately display Hbox with
  methods only. m.butt ?p will show hitlist first and after selecting an object
  members filter will be applied, showing only properties

  ![Filtering](https://publicrepo.vipserv.org/images/vscode-api/search-members1.gif)

- members can be also filtered by a search term, for example to display only methods with "add", type "hbox ?madd"

  ![Filtering](https://publicrepo.vipserv.org/images/vscode-api/search-members2.gif)

- when an object's API is already displayed, putting only ?c, ?m etc. in the search input
  will apply fitlering on this object. It might be also narrowed to searched string, for
  example "get..." methods - ?mget etc.

### Favorites

They can be used to have frequently used objects always available. Favorites are stored in the
configuration (per workspace) and they can be maintained there or using the icons available
on the list and in the object API.
![Favorites](https://publicrepo.vipserv.org/images/vscode-api/favorites.png)

### XML views

API can be also opened for controls in XML views; use the context menu option on a selected control:
![Context menu](https://publicrepo.vipserv.org/images/vscode-api/context.gif)

## Extension Settings

This extension contributes the following settings:

- `apiURL`: the path to SAPUI5/OpenUI5 version; default is <https://openui5.hana.ondemand.com/1.96.10>  
  **Please remember to reload VS Code after changing this setting!**
- `favorites`: the list of favorites UI5 objects; they can be added via configuration or using the icons in the panel
- `hitlistSize`: maximum number of objects shown in the hitlist if multiple objects
  matches the search query; if more objects is found, then the
  hitlist is not displayed and you are asked to narrow your search

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
