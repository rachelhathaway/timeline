import React from "react";
import { faker } from "@faker-js/faker";

import type { Event, NewEvent } from "../../data/events";
import { EventsContext } from "./Events.Context";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((newEvent: NewEvent) => {
    setEvents((currentEvents) => [
      ...currentEvents,
      {
        ...newEvent,
        id: faker.string.uuid(),
        canMove: true,
        canResize: true,
        className: "",
        itemProps: {
          "data-tip": newEvent.title,
        },
      },
    ]);
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
      updateEvent(eventId, () => ({
        className: "item-deleted",
      })),
    [updateEvent]
  );

  return (
    <EventsContext.Provider
      value={{ events, addEvent, deleteEvent, updateEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
};
