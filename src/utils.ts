import dayjs from "dayjs";

import { Event } from "./data/events";

export const filterEventsByGroup = (events: Event[], groupId: string) =>
  events.filter((event) => event.group === groupId);

export const doEventsOverlap = (
  firstEvent: Pick<Event, "end_time" | "start_time">,
  secondEvent: Event
) => {
  const firstDates = {
    start: dayjs(firstEvent.start_time),
    end: dayjs(firstEvent.end_time),
  };
  const secondDates = {
    start: dayjs(secondEvent.start_time),
    end: dayjs(secondEvent.end_time),
  };

  return (
    dayjs(firstDates.start).isBetween(secondDates.start, secondDates.end) ||
    dayjs(firstDates.end).isBetween(secondDates.start, secondDates.end) ||
    dayjs(secondDates.start).isBetween(firstDates.start, firstDates.end) ||
    dayjs(secondDates.end).isBetween(firstDates.start, firstDates.end)
  );
};

export const isEventTooLong = (startTime: number, endTime: number) =>
  dayjs(endTime).isAfter(dayjs(startTime).add(24, "hours"));

export const isTimeInPast = (time: number) => dayjs(time).isBefore(dayjs());
