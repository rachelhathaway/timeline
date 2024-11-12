import React from "react";

import type { Event, EventFormData } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (newEvent: EventFormData) => void;
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
