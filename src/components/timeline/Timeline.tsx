import dayjs from "dayjs";
import React from "react";
import ReactCalendarTimeline, {
  type ReactCalendarTimelineProps,
  type TimelineItemBase,
  DateHeader,
  Id,
  SidebarHeader,
  TimelineHeaders,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

import { User } from "../../data/users";
import { isTimeInPast } from "../../utils";
import { DialogContext } from "../dialog/Dialog.Context";
import { EventsContext } from "../events/Events.Context";
import { Form } from "../form/Form";
import "./Timeline.css";

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
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleCanvasClick = () => setSelected([]);

  const handleCanvasDoubleClick = (groupId: string, startTime: number) => {
    const selectedGroup = groups.find((group) => group.id === groupId);

    if (!isTimeInPast(startTime) && selectedGroup) {
      openDialog(
        <Form
          eventData={{
            group: selectedGroup.id.toString(),
            start_time: startTime,
          }}
          events={events}
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

    if (resizedEvent && edge !== "left") {
      updateEvent(eventId, {
        end_time: dayjs
          .max(
            dayjs(newTime),
            dayjs(resizedEvent.start_time).add(10, "minutes")
          )
          .valueOf(),
        start_time: resizedEvent.start_time,
      });
    }
  };

  const handleItemDoubleClick = (eventId: string) => {
    const clickedEvent = events.find((event) => event.id === eventId);

    if (clickedEvent && !isTimeInPast(clickedEvent.start_time)) {
      openDialog(
        <Form
          eventData={{
            end_time: clickedEvent.end_time,
            group: clickedEvent.group,
            id: clickedEvent.id,
            start_time: clickedEvent.start_time,
            title: clickedEvent.title,
          }}
          events={events}
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

  const handleItemSelect = (eventId: Id) => {
    const selectedEvent = events.find((event) => event.id === eventId);

    setSelected(
      selectedEvent && isTimeInPast(selectedEvent?.start_time)
        ? []
        : [eventId.toString()]
    );
  };

  return (
    <ReactCalendarTimeline<Item>
      canResize="both"
      defaultTimeEnd={today.startOf("day").add(1, "day").toDate()}
      defaultTimeStart={today.startOf("day").toDate()}
      groups={groups}
      items={events}
      lineHeight={50}
      onCanvasClick={handleCanvasClick}
      onCanvasDoubleClick={handleCanvasDoubleClick}
      onItemDoubleClick={handleItemDoubleClick}
      onItemMove={handleEventMove}
      onItemResize={handleEventResize}
      onItemSelect={handleItemSelect}
      selected={selected}
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
