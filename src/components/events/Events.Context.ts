import React from "react";

import type { Event } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (newEvent: Event) => void;
  deleteEvent: (eventId: string) => void;
  updateEvent: (
    eventId: string,
    updater: (eventToUpdate: Event) => Partial<Event>
  ) => void;
}>({
  events: [],
  addEvent: () => {},
  deleteEvent: () => {},
  updateEvent: () => {},
});
