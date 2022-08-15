import { LibraryApiSymbol } from "./ui5ApiService";

const ui5ObjectsDesignApiBufferLength = 30;
const ui5ObjectsDesignApiBuffer: LibraryApiSymbol[] = [];

export function searchObjectDesignApiBuffer(ui5ObjectName: string): LibraryApiSymbol | undefined {
  let result;

  if (ui5ObjectsDesignApiBuffer.length > 0) {
    result = ui5ObjectsDesignApiBuffer.find((designApi) => {
      return designApi.name === ui5ObjectName;
    });
  }

  return result;
}

export function addToObjectDesignApiBuffer(objectApi: LibraryApiSymbol) {
  if (!searchObjectDesignApiBuffer(objectApi.name)) {
    if (ui5ObjectsDesignApiBuffer.length === ui5ObjectsDesignApiBufferLength) {
      ui5ObjectsDesignApiBuffer.shift();
    }

    ui5ObjectsDesignApiBuffer.push(objectApi);
  }
}
