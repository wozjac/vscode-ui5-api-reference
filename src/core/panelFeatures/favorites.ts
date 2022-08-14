import { WorkspaceConfiguration } from "vscode";

export type Favorites = string[];

let favorites: Favorites | undefined;
let configuration: WorkspaceConfiguration;

export function initialize(config: WorkspaceConfiguration) {
  configuration = config;
  favorites = configuration.get("favorites");
}

export function isEmpty() {
  return favorites === undefined || favorites.length === 0;
}

export function addFavorite(ui5ObjectName: string) {
  if (favorites && !favorites.includes(ui5ObjectName)) {
    favorites.push(ui5ObjectName);
    configuration.update("favorites", favorites);
  }
}

export function removeFavorite(ui5ObjectName: string) {
  if (favorites) {
    for (let index = 0; index < favorites.length; index++) {
      const element = favorites[index];

      if (element === ui5ObjectName) {
        favorites.splice(index, 1);
        configuration.update("favorites", favorites);
      }
    }
  }
}

export function getFavorites() {
  if (favorites) {
    return [...favorites];
  } else {
    return [];
  }
}

export function isFavorite(ui5ObjectName: string) {
  if (!favorites) {
    return false;
  }

  for (let index = 0; index < favorites.length; index++) {
    const element = favorites[index];

    if (element === ui5ObjectName) {
      return true;
    }
  }

  return false;
}
