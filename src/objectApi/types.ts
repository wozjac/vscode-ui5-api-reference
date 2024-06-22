export interface Ui5SymbolApi {
  name: string;
  description: string;
  extends?: string;
  apiDocUrl: string;
  isDeprecated: boolean;
  hasMethods: boolean;
  hasEvents: boolean;
  hasConstructor: boolean;
  hasConstructorParams: boolean;
  hasProperties: boolean;
  hasInheritedMethods: boolean;
  hasBaseObject: boolean;
  hasAggregations: boolean;
  isFavorite: boolean;
  methods?: MethodsApi;
  events?: EventsApi;
  ui5Constructor?: Ui5ConstructorApi;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: any;
  aggregations?: AggregationsApi;
  inheritedApi?: { [key: string]: Ui5SymbolApi } | Ui5SymbolApi[];
}

export interface AggregationApi {
  cardinality: string;
  description: string;
  name: string;
  objectName: string;
  singularName: string;
  type: string;
  visibility: string;
  hasUi5ObjectType: boolean;
  ui5ObjectType: string;
  apiDocUrl: string;
}

export type AggregationsApi = AggregationApi[];

export interface MethodApi {
  description: string;
  name: string;
  visibility: string;
  returnValue: ReturnValue;
  deprecated: Deprecated;
  static: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters: any;
  objectName: string;
  apiDocUrl: string;
  hasParameters: boolean;
  hasReturnValue: boolean;
  hasUi5ObjectReturnType: boolean;
  ui5ObjectReturnType: string;
}

export type MethodsApi = MethodApi[];

export interface ParameterApi {
  name: string;
  type: string;
  description: string;
  objectName?: string;
  optional: boolean;
  hasProperties?: boolean;
  parameterProperties?: ParameterPropertiesApi;
}

export type ParametersApi = ParameterApi[];

export interface ParameterPropertyApi {
  name: string;
  description: string;
  objectName?: string;
  optional?: boolean;
  type?: string;
}

export type ParameterPropertiesApi = ParameterPropertyApi[];

export interface EventApi {
  name: string;
  description: string;
  objectName: string;
  deprecated: Deprecated;
  parameters?: ParametersApi;
  apiDocUrl: string;
}

export type EventsApi = EventApi[];

export interface Ui5ConstructorApi {
  description: string;
  parameters?: ParametersApi;
}

export interface PropertyApi {
  name: string;
  description: string;
  defaultValue?: string;
  type: string;
  visibility: string;
  hasUi5ObjectType: boolean;
  ui5ObjectType?: string;
  objectName: string;
  deprecated?: Deprecated;
  apiDocUrl: string;
  hasDefaultValue: boolean;
}

export type PropertiesApi = ParameterApi[];

interface Deprecated {
  text: string;
}

interface ReturnValue {
  type: string;
  description?: string;
}
