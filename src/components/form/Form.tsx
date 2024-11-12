import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { type EventFormData, EventFormSchema } from "../../data/events";
import { User } from "../../data/users";
import "./Form.css";

const dateFormat = "YYYY-MM-DDTHH:mm";

type FormProps = {
  eventData: Pick<EventFormData, "group" | "start_time"> & {
    end_time?: EventFormData["end_time"];
    title?: EventFormData["title"];
  };
  onDelete?: () => void;
  onSave: (eventData: EventFormData) => void;
  users: User[];
};

export const Form = ({ eventData, onDelete, onSave, users }: FormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
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

  const startTime = watch("start_time");

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
            min={startTime}
            max={dayjs(startTime).add(24, "hours").format(dateFormat)}
            type="datetime-local"
          />
          {errors.end_time && (
            <p className="error-text">{errors.end_time.message}</p>
          )}
        </div>
      </div>
      <div>
        {onDelete ? (
          <button onClick={onDelete} type="button">
            Delete
          </button>
        ) : (
          <div />
        )}
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
