import React from "react";
import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
} from "react-calendar-timeline";
import dayjs from "dayjs";

import "react-calendar-timeline/lib/Timeline.css";

import { EventsContext } from "../events/Events.Context";

type Item = TimelineItemBase<number> & {
  itemProps: React.HTMLAttributes<HTMLDivElement> & { "data-tip": string };
};

type TimelineProps = Pick<ReactCalendarTimelineProps, "groups">;

export const Timeline = ({ groups }: TimelineProps) => {
  const today = dayjs();
  const { events, updateEvent } = React.useContext(EventsContext);

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

    updateEvent(eventId, (event) => ({
      end_time: newStartTime + (event.end_time - event.start_time),
      group: newGroup.id.toString(),
      start_time: newStartTime,
    }));
  };

  const handleEventResize = (
    eventId: string,
    newTime: number,
    edge: "left" | "right"
  ) =>
    updateEvent(eventId, (event) => ({
      end_time: edge === "left" ? event.end_time : newTime,
      start_time: edge === "left" ? newTime : event.start_time,
    }));

  return (
    <ReactCalendarTimeline<Item>
      canResize="both"
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
