import React from "react";
import { faker } from "@faker-js/faker";

import { Event } from "../../data/events";
import { EventsContext } from "./Events.Context";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((newEvent: Omit<Event, "id">) => {
    setEvents((currentEvents) => [
      ...currentEvents,
      {
        ...newEvent,
        id: faker.string.uuid(),
      },
    ]);
  }, []);

  const deleteEvent = React.useCallback(
    (eventId: string) =>
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      ),
    []
  );

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

  return (
    <EventsContext.Provider
      value={{ events, addEvent, deleteEvent, updateEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
};
