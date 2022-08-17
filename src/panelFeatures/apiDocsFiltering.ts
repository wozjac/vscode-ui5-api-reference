import * as constants from "../core/constants";
import { LibraryApiSymbol } from "../core/types";

interface DeleteMarkers {
  events: boolean;
  methods: boolean;
  aggregations: boolean;
  properties: boolean;
  construct: boolean;
}

export function filterApiMembers(
  ui5ObjectApi: LibraryApiSymbol,
  memberSearchString: string,
  memberGroupFilter: string
) {
  const objectApi = JSON.parse(JSON.stringify(ui5ObjectApi));

  function filterMembers(key1: string, key2?: string) {
    let filterable;

    if (key2) {
      filterable = objectApi[key1][key2];
    } else {
      filterable = objectApi[key1];
    }

    if (filterable) {
      return filterable.filter((member: any) => {
        if (member.visibility !== "public") {
          return false;
        }

        return new RegExp(memberSearchString, "i").test(member.name);
      });
    }
  }

  const filterableKeys = ["methods", "events", "properties", "aggregations"];

  if (memberSearchString) {
    for (const key of filterableKeys) {
      if (objectApi.kind === "class" && (key === "properties" || key === "aggregations")) {
        objectApi["ui5-metadata"][key] = filterMembers("ui5-metadata", key);

        if (
          !objectApi["ui5-metadata"][key] ||
          (objectApi["ui5-metadata"][key] && objectApi["ui5-metadata"][key].length === 0)
        ) {
          delete objectApi["ui5-metadata"][key];
        }
      } else {
        objectApi[key] = filterMembers(key);

        if (!objectApi[key] || (objectApi[key] && objectApi[key].length === 0)) {
          delete objectApi[key];
        }
      }
    }

    delete objectApi.constructor;
  }

  if (memberGroupFilter) {
    const deleteMarkers: DeleteMarkers = {
      properties: true,
      methods: true,
      events: true,
      aggregations: true,
      construct: true,
    };

    switch (memberGroupFilter) {
      case constants.memberGroupFilter.aggregations:
        deleteMarkers.aggregations = false;
        break;
      case constants.memberGroupFilter.methods:
        deleteMarkers.methods = false;
        break;
      case constants.memberGroupFilter.properties:
        deleteMarkers.properties = false;
        break;
      case constants.memberGroupFilter.events:
        deleteMarkers.events = false;
        break;
      case constants.memberGroupFilter.construct:
        deleteMarkers.construct = false;
        break;
    }

    _deleteMembers(objectApi, deleteMarkers);
  }

  if (objectApi.inheritedApi) {
    for (const name in objectApi.inheritedApi) {
      objectApi.inheritedApi[name] = filterApiMembers(
        objectApi.inheritedApi[name],
        memberSearchString,
        memberGroupFilter
      );
    }
  }

  return objectApi;
}

function _deleteMembers(objectApi: LibraryApiSymbol, deleteMarkers: DeleteMarkers) {
  if (deleteMarkers.properties === true) {
    if (objectApi.kind === "class" && objectApi["ui5-metadata"]) {
      delete objectApi["ui5-metadata"].properties;
    } else {
      delete objectApi.properties;
    }
  }

  if (deleteMarkers.aggregations === true) {
    if (objectApi.kind === "class" && objectApi["ui5-metadata"]) {
      delete objectApi["ui5-metadata"].aggregations;
    } else {
      delete objectApi.aggregations;
    }
  }

  if (deleteMarkers.events === true) {
    delete objectApi.events;
  }

  if (deleteMarkers.methods === true) {
    delete objectApi.methods;
  }

  if (deleteMarkers.construct === true) {
    delete objectApi.constructor;
  }
}
