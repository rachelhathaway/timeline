import React from "react";

import type { Event } from "../../data/events";
import { EventsContext } from "./Events.Context";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((newEvent: Event) => {
    setEvents((currentEvents) => [...currentEvents, newEvent]);
  }, []);

  const updateEvent = React.useCallback(
    (eventId: string, updater: (event: Event) => Partial<Event>) => {
      setEvents((currentEvents) => {
        const eventToUpdateIndex = currentEvents.findIndex(
          (event) => event.id === eventId
        );
        const eventToUpdate = currentEvents[eventToUpdateIndex];

        return [
          ...currentEvents.slice(0, eventToUpdateIndex),
          ...currentEvents.slice(eventToUpdateIndex + 1),
          {
            ...eventToUpdate,
            ...updater(eventToUpdate),
          },
        ];
      });
    },
    []
  );

  const deleteEvent = React.useCallback(
    (eventId: string) =>
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      ),
    []
  );

  return (
    <EventsContext.Provider
      value={{ events, addEvent, deleteEvent, updateEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
};
