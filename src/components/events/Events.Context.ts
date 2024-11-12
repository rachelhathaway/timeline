import React from "react";

import type { Event, EventForm } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (newEvent: EventForm) => void;
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
