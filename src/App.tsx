import React from "react";

import dayjs from "dayjs";

import { Timeline } from "./components/Timeline";
import { generateData } from "./data/composed";
import type { Event } from "./data/events";

const { events: initialEvents, groups } = generateData();

const updateEvent = (
  events: Event[],
  eventId: string,
  updater: (changedEvent: Event) => Partial<Event>
) => {
  const changedEventIndex = events.findIndex((event) => event.id === eventId);
  const changedEvent = events[changedEventIndex];

  return [
    ...events.slice(0, changedEventIndex),
    ...events.slice(changedEventIndex + 1),
    {
      ...changedEvent,
      ...updater(changedEvent),
    },
  ];
};

const App = () => {
  const today = dayjs();
  const [events, setEvents] = React.useState<Event[]>(initialEvents);

  const handleCanvasDoubleClick = (groupId: string, time: number) => {
    // use to add event
    const group = groups.find((g) => g.id === groupId);

    alert(`Add event to ${group?.title}'s calendar?`);
  };

  const handleEventMove = (
    eventId: string,
    newStartTime: number,
    newGroupIndex: number
  ) => {
    const newGroup = groups[newGroupIndex];

    setEvents((currentEvents) =>
      updateEvent(currentEvents, eventId, (event) => ({
        end_time: newStartTime + (event.end_time - event.start_time),
        group: newGroup.id,
        start_time: newStartTime,
      }))
    );
  };

  const handleEventResize = (
    eventId: string,
    newTime: number,
    edge: "left" | "right"
  ) => {
    setEvents((currentEvents) =>
      updateEvent(currentEvents, eventId, (event) => ({
        end_time: edge === "left" ? event.end_time : newTime,
        start_time: edge === "left" ? newTime : event.start_time,
      }))
    );
  };

  return (
    <Timeline
      defaultTimeEnd={today.startOf("day").add(1, "day").toDate()}
      defaultTimeStart={today.startOf("day").toDate()}
      groups={groups}
      items={events}
      onCanvasDoubleClick={handleCanvasDoubleClick}
      onItemMove={handleEventMove}
      onItemResize={handleEventResize}
    />
  );
};

export default App;
