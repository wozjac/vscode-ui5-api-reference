export function getNormalizedName(name: string) {
  return name.replace("module:", "").replace(/\//g, ".");
}

export function getUi5ObjectApiDocUrl(ui5ObjectName: string, apiBaseUrl: string) {
  let path = ui5ObjectName;

  if (path.indexOf("module:") !== -1) {
    path = encodeURIComponent(path);
  }

  return `${apiBaseUrl}/#/api/${path}`;
}
