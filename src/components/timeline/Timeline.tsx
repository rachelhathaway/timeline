import React from "react";
import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import dayjs from "dayjs";

import "react-calendar-timeline/lib/Timeline.css";
import "./Timeline.css";

import { User } from "../../data/users";
import { DialogContext } from "../dialog/Dialog.Context";
import { EventsContext } from "../events/Events.Context";
import { Form } from "../form/Form";

type Item = TimelineItemBase<number> & {
  itemProps: React.HTMLAttributes<HTMLDivElement> & { "data-tip": string };
};

type TimelineProps = Pick<ReactCalendarTimelineProps, "groups"> & {
  users: User[];
};

export const Timeline = ({ groups, users }: TimelineProps) => {
  const today = dayjs();
  const { closeDialog, openDialog } = React.useContext(DialogContext);
  const { events, addEvent, deleteEvent, updateEvent } =
    React.useContext(EventsContext);

  const handleCanvasDoubleClick = (groupId: string, time: number) => {
    const group = groups.find((g) => g.id === groupId);

    if (dayjs(time).isAfter(dayjs()) && group) {
      openDialog(
        <Form
          eventData={{
            group: group.id.toString(),
            start_time: time,
          }}
          onSave={(formData) => {
            addEvent(formData);
            closeDialog();
          }}
          users={users}
        />
      );
    }
  };

  const handleEventMove = (
    eventId: string,
    newStartTime: number,
    newGroupIndex: number
  ) => {
    const movedEvent = events.find((event) => event.id === eventId);
    const newGroup = groups[newGroupIndex];

    if (movedEvent) {
      updateEvent(eventId, {
        end_time: newStartTime + (movedEvent.end_time - movedEvent.start_time),
        group: newGroup.id.toString(),
        start_time: newStartTime,
      });
    }
  };

  const handleEventResize = (
    eventId: string,
    newTime: number,
    edge: "left" | "right"
  ) => {
    const resizedEvent = events.find((event) => event.id === eventId);

    if (resizedEvent) {
      updateEvent(eventId, {
        end_time: edge === "left" ? resizedEvent.end_time : newTime,
        start_time: edge === "left" ? newTime : resizedEvent.start_time,
      });
    }
  };

  const handleItemDoubleClick = (eventId: string) => {
    const clickedEvent = events.find((event) => event.id === eventId);

    if (clickedEvent && dayjs(clickedEvent.start_time).isAfter(dayjs())) {
      openDialog(
        <Form
          eventData={{
            end_time: clickedEvent.end_time,
            group: clickedEvent.group,
            start_time: clickedEvent.start_time,
            title: clickedEvent.title,
          }}
          onDelete={() => {
            deleteEvent(clickedEvent.id);
            closeDialog();
          }}
          onSave={(formData) => {
            updateEvent(clickedEvent.id, {
              ...formData,
              end_time: dayjs(formData.end_time).valueOf(),
              start_time: dayjs(formData.start_time).valueOf(),
            });
            closeDialog();
          }}
          users={users}
        />
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
    >
      <TimelineHeaders className="sticky-header">
        <SidebarHeader>
          {({ getRootProps }) => {
            return <div {...getRootProps()} />;
          }}
        </SidebarHeader>
        <DateHeader unit="primaryHeader" />
        <DateHeader labelFormat="ha" />
      </TimelineHeaders>
    </ReactCalendarTimeline>
  );
};
