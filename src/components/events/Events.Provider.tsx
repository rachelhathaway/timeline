import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import React from "react";

import type { Event, EventFormData } from "../../data/events";
import {
  doEventsOverlap,
  filterEventsByGroup,
  isEventTooLong,
  isTimeInPast,
} from "../../utils";
import { DialogContext } from "../dialog/Dialog.Context";
import { EventsContext } from "./Events.Context";

export const EventsProvider = ({
  children,
  initialEvents,
}: React.PropsWithChildren<{ initialEvents: Event[] }>) => {
  const { openDialog } = React.useContext(DialogContext);
  const [events, setEvents] = React.useState(initialEvents);

  const addEvent = React.useCallback((eventData: Omit<EventFormData, "id">) => {
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
      if (
        eventData.end_time &&
        eventData.start_time &&
        isEventTooLong(eventData.start_time, eventData.end_time)
      ) {
        openDialog("Event duration cannot exceed 24 hours");

        return;
      }

      if (eventData.start_time && isTimeInPast(eventData.start_time)) {
        openDialog("Cannot move event start to the past");

        return;
      }

      setEvents((currentEvents) => {
        const eventToUpdateIndex = currentEvents.findIndex(
          (event) => event.id === eventId
        );
        const eventToUpdate = currentEvents[eventToUpdateIndex];
        const updatedEvent = {
          ...eventToUpdate,
          ...eventData,
        };

        const eventsInGroup = filterEventsByGroup(
          currentEvents,
          updatedEvent.group
        ).filter((event) => event.id !== updatedEvent.id);
        const overlappingEvent = eventsInGroup.find((eventInGroup) =>
          doEventsOverlap(updatedEvent, eventInGroup)
        );

        if (overlappingEvent) {
          openDialog("Events cannot overlap");

          return currentEvents;
        }

        return [
          ...currentEvents.slice(0, eventToUpdateIndex),
          ...currentEvents.slice(eventToUpdateIndex + 1),
          updatedEvent,
        ];
      });
    },
    [openDialog]
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
