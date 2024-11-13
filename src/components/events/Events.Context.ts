import React from "react";

import type { Event, EventFormData } from "../../data/events";

export const EventsContext = React.createContext<{
  events: Event[];
  addEvent: (eventData: Omit<EventFormData, "id">) => void;
  deleteEvent: (eventId: string) => void;
  updateEvent: (eventId: string, eventData: Partial<EventFormData>) => void;
}>({
  events: [],
  addEvent: () => {},
  deleteEvent: () => {},
  updateEvent: () => {},
});
