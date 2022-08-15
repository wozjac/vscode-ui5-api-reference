export interface ApiIndexNode {
  kind: string;
  lib: string;
  name: string;
  displayName: string;
  visibility: string;
  nodes?: ApiIndexNode[];
}

export interface ApiIndex {
  symbols: ApiIndexNode[];
}

export interface ApiIndexNodeEnhanced {
  name: string;
  originalName: string;
  basename: string;
  kind: string;
  library: string;
  apiDocUrl: string;
}

export interface LibraryApi {
  symbols: LibraryApiSymbol[];
}

export interface LibraryApiSymbol {
  basename: string;
  description: string;
  experimental: {
    since: string;
  };
  export?: string;
  kind: string;
  module: string;
  name: string;
  resource: string;
  since: string;
  static: boolean;
  visibility: string;
  originalName: string;
  apiDocUrl: string;
  extends?: string;
  constructor?: Ui5ObjectConstructor;
  methods?: Ui5ObjectMethod[];
  "ui5-metamodel"?: boolean;
  "ui5-metadata"?: Ui5Metadata;
  inheritedApi?: LibraryApiSymbol;
}

export interface Ui5ObjectConstructor {
  description: string;
  parameters?: Ui5ObjectMethodParameter[];
}

export interface Ui5ObjectMethod {
  description: string;
  name: string;
  visiblity: string;
  returnType: {
    type: string;
  };
  parameters?: Ui5ObjectMethodParameter[];
}

export interface Ui5ObjectMethodParameter {
  description: string;
  name: string;
  optional: boolean;
  type: string;
}

export interface Ui5Metadata {
  metadataClass?: string;
  stereotype?: string;
}

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
