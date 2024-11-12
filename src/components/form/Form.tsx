import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faker } from "@faker-js/faker";

import { type Event, EventSchema } from "../../data/events";

import "./Form.css";

type FormProps = {
  event: Partial<Event> &
    Pick<Event, "end_time" | "group" | "start_time" | "title">;
  onDelete?: () => void;
  onSave: (event: Event) => void;
};

export const Form = ({ event, onDelete, onSave }: FormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      canMove: true,
      canResize: true,
      className: "",
      id: faker.string.uuid(),
      itemProps: {
        "data-tip": "",
      },
      ...event,
    },
    resolver: zodResolver(EventSchema),
  });

  return (
    <form
      className="event-form"
      onSubmit={handleSubmit((data) => {
        const newEvent = {
          ...data,
          itemProps: {
            "data-tip": data.title,
          },
        };

        onSave(newEvent);
      })}
    >
      <div>
        <label htmlFor="event-title">Event Name</label>
        <input id="event-title" {...register("title")} />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
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