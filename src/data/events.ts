import { z } from "zod";
import { generateMock } from "@anatine/zod-mock";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export const EventSchema = z.object({
  className: z.string(),
  end_time: z.number(),
  group: z.string().uuid(),
  id: z.string().uuid(),
  itemProps: z.object({
    "data-tip": z.string(),
  }),
  start_time: z.number(),
  title: z.string().min(5).max(35),
});

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
  const title = faker.hacker.phrase();
  const mockEvent = {
    ...generateMock(EventSchema, {
      stringMap: {
        className: () => className,
        group: () => groupId,
        title: () => title,
      },
    }),
    itemProps: {
      "data-tip": title,
    },
    start_time: startTime,
    end_time: endTime,
  };

  return mockEvent;
};
