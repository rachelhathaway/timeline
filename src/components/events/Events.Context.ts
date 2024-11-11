import React from "react";

import { Event } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (newEvent: Omit<Event, "id">) => void;
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
