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
  experimental?: {
    since: string;
  };
  export?: string;
  kind: string;
  module: string;
  name: string;
  resource: string;
  since?: string;
  static: boolean;
  visibility: string;
  originalName?: string;
  apiDocUrl: string;
  extends?: string;
  constructor?: Ui5ObjectConstructor;
  methods?: Ui5ObjectMethods;
  events?: Ui5ObjectEvents;
  "ui5-metamodel"?: boolean;
  "ui5-metadata"?: Ui5Metadata;
  inheritedApi?: { [key: string]: LibraryApiSymbol };
  properties?: any;
  deprecated?: Deprecated;
  aggregations?: Ui5ObjectAggregations;
}

export interface Ui5ObjectConstructor {
  description: string;
  parameters?: Ui5ObjectParameter[];
}

export interface Ui5ObjectMethod {
  description: string;
  name: string;
  visibility: string;
  returnValue?: ReturnValue;
  parameters?: Ui5ObjectParameters;
  static?: boolean;
  deprecated?: Deprecated;
}

export type Ui5ObjectMethods = Ui5ObjectMethod[];

export interface Ui5ObjectParameter {
  description: string;
  name: string;
  optional: boolean;
  type: string;
  parameterProperties?: Ui5ObjectParameterProperties;
}

export type Ui5ObjectParameters = Ui5ObjectParameter[];

export interface Ui5ObjectEvent {
  description: string;
  name: string;
  visibility: string;
  parameters?: Ui5ObjectParameters;
  deprecated?: Deprecated;
}

export type Ui5ObjectEvents = Ui5ObjectEvent[];

export interface Ui5Metadata {
  metadataClass?: string;
  stereotype?: string;
  properties?: any;
  aggregations?: Ui5ObjectAggregations;
}

export interface Ui5ObjectParameterProperty {
  name: string;
  description: string;
}

export type Ui5ObjectParameterProperties = Ui5ObjectParameterProperty[];

export interface Ui5ObjectAggregation {
  name: string;
  description: string;
  type: string;
  visibility: string;
  cardinality: string;
}

export type Ui5ObjectAggregations = Ui5ObjectAggregation[];

export interface Ui5ObjectProperty {
  name: string;
  description: string;
  defaultValue?: string;
  type: string;
  visibility: string;
  deprecated?: Deprecated;
}

export type Ui5ObjectProperties = Ui5ObjectProperty[];

interface Deprecated {
  text: string;
}

interface ReturnValue {
  type: string;
  description?: string;
}
