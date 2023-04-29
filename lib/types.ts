type TrackingState = "preinit" | "tracking" | "stopped";

type InitOptions = {
  trackDynamicRoutes?: boolean;
  extendPageData?: boolean;
  serverUrl?: string;
  apiVersion?: "v1";
  debug?: boolean;
};

type PageData = {
  path: string;
  query?: string;
  hash?: string;
  fullpath?: string;
  title?: string;
};

type Selector = string | "document" | "window";

type AnalyticsEvents = {
  event: string;
  selector: Selector;
  trigger: string;
  page?: string;
}[];

type EventKind = "external" | "internal" | "tag-based";

export type {
  TrackingState,
  InitOptions,
  PageData,
  AnalyticsEvents,
  EventKind,
  Selector,
};
