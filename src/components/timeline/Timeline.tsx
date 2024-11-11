import React from "react";
import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
} from "react-calendar-timeline";
import dayjs from "dayjs";

import "react-calendar-timeline/lib/Timeline.css";

import { DialogContext } from "../dialog/Dialog.Context";
import { EventsContext } from "../events/Events.Context";

type Item = TimelineItemBase<number> & {
  itemProps: React.HTMLAttributes<HTMLDivElement> & { "data-tip": string };
};

type TimelineProps = Pick<ReactCalendarTimelineProps, "groups">;

export const Timeline = ({ groups }: TimelineProps) => {
  const today = dayjs();
  const { openDialog } = React.useContext(DialogContext);
  const { events, updateEvent } = React.useContext(EventsContext);

  const handleCanvasDoubleClick = (groupId: string, time: number) => {
    const group = groups.find((g) => g.id === groupId);

    if (dayjs(time).isAfter(dayjs()) && group) {
      openDialog(
        <div>
          <p>{group?.title}</p>
        </div>
      );
    }
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

  const handleItemDoubleClick = (eventId: string) => {
    const clickedEvent = events.find((event) => event.id === eventId);

    if (clickedEvent && dayjs(clickedEvent.start_time).isAfter(dayjs())) {
      openDialog(
        <div>
          <p>{clickedEvent?.title}</p>
        </div>
      );
    }
  };

  return (
    <ReactCalendarTimeline<Item>
      canResize="both"
      defaultTimeEnd={today.startOf("day").add(1, "day").toDate()}
      defaultTimeStart={today.startOf("day").toDate()}
      groups={groups}
      items={events}
      onCanvasDoubleClick={handleCanvasDoubleClick}
      onItemDoubleClick={handleItemDoubleClick}
      onItemMove={handleEventMove}
      onItemResize={handleEventResize}
    />
  );
};
