import { generateMock } from "@anatine/zod-mock";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";

import { isEventTooLong, isTimeInPast } from "../utils";

const IdSchema = z.string().uuid();
const TitleSchema = z.string().min(5).max(35);

export const EventFormSchema = z
  .object({
    end_time: z.string().datetime(),
    group: IdSchema,
    start_time: z.string().datetime(),
    title: TitleSchema,
  })
  .refine((formData) => !isTimeInPast(dayjs(formData.start_time).valueOf()), {
    message: "Start date cannot be in the past",
    path: ["start_time"],
  })
  .refine(
    (formData) =>
      !dayjs(formData.end_time).isBefore(dayjs(formData.start_time)),
    {
      message: "End date must be after start date",
      path: ["end_time"],
    }
  )
  .refine(
    (formData) =>
      !isEventTooLong(
        dayjs(formData.start_time).valueOf(),
        dayjs(formData.end_time).valueOf()
      ),
    {
      message: "Event duration cannot exceed 24 hours",
      path: ["end_time"],
    }
  );

export const EventSchema = z.object({
  canMove: z.boolean(),
  canResize: z.boolean(),
  className: z.string(),
  end_time: z.number(),
  group: IdSchema,
  id: IdSchema,
  itemProps: z.object({
    "data-tip": z.string(),
  }),
  start_time: z.number(),
  title: TitleSchema,
});

export type Event = z.infer<typeof EventSchema>;
export type EventFormData = Pick<
  Event,
  "end_time" | "group" | "id" | "start_time" | "title"
>;

const getCanEdit = (startTime: number) => dayjs(startTime).isAfter(dayjs());

const getEndTime = (startDate: number) =>
  dayjs(
    startDate + faker.number.int({ min: 2, max: 20 }) * 15 * 60 * 1000
  ).valueOf();

const getStartTime = (startDate: number) =>
  Math.floor(dayjs(startDate).valueOf() / 10000000) * 10000000;

export const generateMockEvent = (groupId: string, startDate: number) => {
  const endTime = getEndTime(startDate);
  const startTime = getStartTime(startDate);
  const title = faker.lorem.words({ min: 3, max: 100 }).slice(0, 35);
  const canEdit = getCanEdit(startTime);
  const mockEvent = {
    ...generateMock(EventSchema, {
      stringMap: {
        className: () => (canEdit ? "" : "item-edit-disabled"),
        group: () => groupId,
        title: () => title,
      },
    }),
    canMove: canEdit,
    canResize: canEdit,
    itemProps: {
      "data-tip": title,
    },
    start_time: startTime,
    end_time: endTime,
  };

  return mockEvent;
};
