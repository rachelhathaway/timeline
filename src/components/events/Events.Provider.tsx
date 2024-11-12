import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import React from "react";

import type { Event, EventFormData } from "../../data/events";
import { EventsContext } from "./Events.Context";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((eventData: EventFormData) => {
    const { end_time, start_time, ...restEventData } = eventData;

    setEvents((currentEvents) => [
      ...currentEvents,
      {
        canMove: true,
        canResize: true,
        className: "",
        end_time: dayjs(end_time).valueOf(),
        id: faker.string.uuid(),
        itemProps: {
          "data-tip": eventData.title,
        },
        start_time: dayjs(start_time).valueOf(),
        ...restEventData,
      },
    ]);
  }, []);

  const updateEvent = React.useCallback(
    (eventId: string, eventData: Partial<EventFormData>) => {
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
            ...eventData,
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
