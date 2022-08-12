let favorites;
let configuration;

function initialize(config) {
  configuration = config;
  favorites = configuration.get("favorites");
}

function isEmpty() {
  return Array.isEmpty(favorites);
}

function addFavorite(ui5ObjectName) {
  if (!favorites.includes(ui5ObjectName)) {
    favorites.push(ui5ObjectName);
    configuration.update("favorites", favorites);
  }
}

function removeFavorite(ui5ObjectName) {
  for (let index = 0; index < favorites.length; index++) {
    const element = favorites[index];

    if (element === ui5ObjectName) {
      favorites.splice(index, 1);
      configuration.update("favorites", favorites);
    }
  }
}

function getFavorites() {
  return [...favorites];
}

function isFavorite(ui5ObjectName) {
  for (let index = 0; index < favorites.length; index++) {
    const element = favorites[index];

    if (element === ui5ObjectName) {
      return true;
    }
  }

  return false;
}

module.exports = {
  isEmpty,
  isFavorite,
  addFavorite,
  removeFavorite,
  getFavorites,
  initialize,
};
