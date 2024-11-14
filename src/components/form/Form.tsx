import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";

import { Event, type EventFormData, EventFormSchema } from "../../data/events";
import { User } from "../../data/users";
import { doEventsOverlap, filterEventsByGroup } from "../../utils";
import "./Form.css";

const dateFormat = "YYYY-MM-DDTHH:mm";

type FormProps = {
  eventData: Pick<EventFormData, "group" | "start_time"> & {
    end_time?: EventFormData["end_time"];
    id?: EventFormData["id"];
    title?: EventFormData["title"];
  };
  events: Event[];
  onDelete?: () => void;
  onSave: (
    eventData: Omit<EventFormData, "id"> & { id?: EventFormData["id"] }
  ) => void;
  users: User[];
};

export const Form = ({
  eventData,
  events,
  onDelete,
  onSave,
  users,
}: FormProps) => {
  const {
    clearErrors,
    register,
    formState: { errors },
    handleSubmit,
    setError,
    watch,
  } = useForm({
    defaultValues: {
      end_time: eventData.end_time
        ? dayjs(eventData.end_time).format(dateFormat)
        : dayjs(eventData.start_time).add(2, "hours").format(dateFormat),
      group: eventData.group,
      start_time: dayjs(eventData.start_time).format(dateFormat),
      title: eventData.title ?? "",
    },
    resolver: zodResolver(EventFormSchema),
  });

  const endTime = watch("end_time");
  const groupId = watch("group");
  const startTime = watch("start_time");

  React.useEffect(() => {
    const eventsInGroup = filterEventsByGroup(events, groupId).filter(
      (event) => event.id !== eventData.id
    );
    const overlappingEvent = eventsInGroup.find((eventInGroup) =>
      doEventsOverlap(
        {
          start_time: dayjs(startTime).valueOf(),
          end_time: dayjs(endTime).valueOf(),
        },
        eventInGroup
      )
    );

    if (overlappingEvent) {
      setError("root.overlappingEvent", {
        type: "custom",
        message: "This event overlaps an existing event",
      });
    } else {
      clearErrors("root.overlappingEvent");
    }
  }, [
    clearErrors,
    endTime,
    eventData.id,
    events,
    groupId,
    setError,
    startTime,
  ]);

  return (
    <form
      className="event-form"
      onSubmit={handleSubmit((data) => {
        onSave({
          ...data,
          end_time: dayjs(data.end_time).valueOf(),
          start_time: dayjs(data.start_time).valueOf(),
        });
      })}
    >
      <div>
        <label htmlFor="event-title">Title</label>
        <input {...register("title")} id="event-title" />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
      </div>
      <div>
        <div>
          <label htmlFor="event-group">Assigned User</label>
        </div>
        <select {...register("group")} id="event-group">
          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >{`${user.firstName} ${user.lastName}`}</option>
          ))}
        </select>
        {errors.group && <p className="error-text">{errors.group.message}</p>}
      </div>
      <div className="flex">
        <div>
          <label htmlFor="start-time">Start Time</label>
          <input
            {...register("start_time", {
              setValueAs: (value) => dayjs(value).toISOString(),
            })}
            id="start-time"
            min={dayjs().format(dateFormat)}
            type="datetime-local"
          />
          {errors.start_time && (
            <p className="error-text">{errors.start_time.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="end-time">End Time</label>
          <input
            {...register("end_time", {
              setValueAs: (value) => dayjs(value).toISOString(),
            })}
            id="end-time"
            min={dayjs(startTime).format(dateFormat)}
            max={dayjs(startTime).add(24, "hours").format(dateFormat)}
            type="datetime-local"
          />
          {errors.end_time && (
            <p className="error-text">{errors.end_time.message}</p>
          )}
        </div>
      </div>
      {errors.root?.overlappingEvent && (
        <div>
          {errors.root?.overlappingEvent && (
            <p className="error-text">{errors.root.overlappingEvent.message}</p>
          )}
        </div>
      )}
      <div>
        {onDelete ? (
          <button onClick={onDelete} type="button">
            Delete
          </button>
        ) : (
          <div />
        )}
        <button disabled={!!errors.root?.overlappingEvent} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
