import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type EventForm, EventFormSchema } from "../../data/events";

import "./Form.css";
import dayjs from "dayjs";

export const dateFormat = "YYYY-MM-DDTHH:mm";

type FormProps = {
  event: EventForm;
  onDelete?: () => void;
  onSave: (event: EventForm) => void;
};

export const Form = ({ event, onDelete, onSave }: FormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: event,
    resolver: zodResolver(EventFormSchema),
  });

  const startTime = watch("start_time");

  return (
    <form
      className="event-form"
      onSubmit={handleSubmit((data) => {
        onSave(data);
      })}
    >
      <div>
        <label htmlFor="event-title">Event Name</label>
        <input {...register("title")} id="event-title" />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
      </div>
      <div className="flex">
        <div>
          <label htmlFor="start-time">Start Time</label>
          <input
            {...register("start_time", {
              setValueAs: (value) => dayjs(value).toISOString(),
            })}
            id="start-time"
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
