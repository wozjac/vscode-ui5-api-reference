import { formatJsDoc } from "./formatter";
import { EventApi, EventsApi } from "./types";
import * as parameterFormat from "./parameterFormat";
import { Ui5ObjectEvents } from "../core/types";

export function prepareEvents(events: Ui5ObjectEvents, ui5ObjectApi: any, cleanHtml: boolean) {
  return events.map((event) => {
    const eventApi = <EventApi>{};
    eventApi.name = event.name;
    eventApi.objectName = ui5ObjectApi.name;
    eventApi.description = formatJsDoc(event.description, cleanHtml);

    if (event.deprecated) {
      eventApi.description = `[DEPRECATED! ${formatJsDoc(event.deprecated.text, true)}] ${
        eventApi.description
      }`;
    }

    if (event.parameters) {
      eventApi.parameters = parameterFormat.prepareParameters(event.parameters, cleanHtml);
    }

    eventApi.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/events/${event.name}`;

    return eventApi;
  });
}
