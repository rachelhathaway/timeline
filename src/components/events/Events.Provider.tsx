import React from "react";
import { faker } from "@faker-js/faker";

import type { Event, EventForm } from "../../data/events";
import { EventsContext } from "./Events.Context";
import dayjs from "dayjs";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((newEvent: EventForm) => {
    const { end_time, start_time, ...restFormData } = newEvent;

    setEvents((currentEvents) => [
      ...currentEvents,
      {
        canMove: true,
        canResize: true,
        className: "",
        end_time: dayjs(end_time).valueOf(),
        id: faker.string.uuid(),
        itemProps: {
          "data-tip": newEvent.title,
        },
        start_time: dayjs(start_time).valueOf(),
        ...restFormData,
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
