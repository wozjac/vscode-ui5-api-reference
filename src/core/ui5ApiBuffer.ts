import { LibraryApiSymbol } from "./types.js";

const ui5ObjectsDesignApiBufferLength = 30;
let ui5ObjectsDesignApiBuffer: LibraryApiSymbol[] = [];

export function searchObjectDesignApiBuffer(
  requestedObjectName: string
): LibraryApiSymbol | undefined {
  let result;

  if (ui5ObjectsDesignApiBuffer.length > 0) {
    result = ui5ObjectsDesignApiBuffer.find((bufferedUi5Object) => {
      return bufferedUi5Object.name === requestedObjectName;
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

export function getBufferLength() {
  return ui5ObjectsDesignApiBuffer.length;
}

export function resetBuffer() {
  ui5ObjectsDesignApiBuffer = [];
}
