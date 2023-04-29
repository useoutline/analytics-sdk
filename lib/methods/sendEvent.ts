import { trackEvent } from "../apis";
import logger from "../logger";
import state from "../state";
import { EventKind } from "../types";
import { getPageData } from "./getPageData";

function sendEvent(event: string) {
  if (state.getTrackingState() !== "tracking") return;
  const page = getPageData();
  trackEvent("external", event, page);
  logger.log(`Custom event sent`, event);
}

function sendDefaultEvent(type: EventKind, event: string) {
  if (state.getTrackingState() !== "tracking") return;
  const page = getPageData();
  trackEvent(type, event, page);
  logger.log(
    `${type === "internal" ? "Internal" : "Tag based"} event sent`,
    event
  );
}

export { sendEvent, sendDefaultEvent };
