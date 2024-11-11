import React from "react";

import type { Event, NewEvent } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (newEvent: NewEvent) => void;
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
