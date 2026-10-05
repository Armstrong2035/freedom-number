"use client";

import * as React from "react";
import { track, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics";

interface TrackViewProps {
  event: AnalyticsEvent;
  properties?: AnalyticsProperties;
}

export function TrackView({ event, properties }: TrackViewProps) {
  React.useEffect(() => {
    track(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
