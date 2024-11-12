import { z } from "zod";
import { generateMock } from "@anatine/zod-mock";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

const IdSchema = z.string().uuid();
const TitleSchema = z.string().min(5).max(35);

export const EventFormSchema = z.object({
  end_time: z.string().datetime(),
  group: IdSchema,
  start_time: z.string().datetime(),
  title: TitleSchema,
});

export type EventForm = z.infer<typeof EventFormSchema>;

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

const getCanEdit = (startTime: number) => dayjs(startTime).isAfter(dayjs());

const getClassName = (startDate: number) => {
  const day = dayjs(startDate).day();

  return day === 6 || day === 0 ? "item-weekend" : "";
};

const getEndTime = (startDate: number) =>
  dayjs(
    startDate + faker.number.int({ min: 2, max: 20 }) * 15 * 60 * 1000
  ).valueOf();

const getStartTime = (startDate: number) =>
  Math.floor(dayjs(startDate).valueOf() / 10000000) * 10000000;

export const generateMockEvent = (groupId: string, startDate: number) => {
  const className = getClassName(startDate);
  const endTime = getEndTime(startDate);
  const startTime = getStartTime(startDate);
  const title = faker.lorem.words({ min: 3, max: 100 }).slice(0, 35);
  const mockEvent = {
    ...generateMock(EventSchema, {
      stringMap: {
        className: () => className,
        group: () => groupId,
        title: () => title,
      },
    }),
    canMove: getCanEdit(startTime),
    canResize: getCanEdit(startTime),
    itemProps: {
      "data-tip": title,
    },
    start_time: startTime,
    end_time: endTime,
  };

  return mockEvent;
};
