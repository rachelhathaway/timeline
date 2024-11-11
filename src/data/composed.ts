import { faker } from "@faker-js/faker";

import { generateMockGroup } from "./groups";
import { generateMockUser } from "./users";
import { generateMockEvent } from "./events";

const getStartDate = (daysInPast: number) =>
  faker.date.recent({ days: daysInPast }).valueOf() +
  daysInPast * 0.3 * 86400 * 1000;

export const generateData = (
  numUsers: number = 30,
  numEvents: number = 100,
  daysInPast: number = 30
) => {
  const users = new Array(numUsers).fill(undefined).map(generateMockUser);
  const groups = users.map(generateMockGroup).sort((groupOne, groupTwo) => {
    const nameOne = groupOne.title.toUpperCase();
    const nameTwo = groupTwo.title.toUpperCase();

    if (nameOne < nameTwo) {
      return -1;
    }

    if (nameOne > nameTwo) {
      return 1;
    }

    return 0;
  });
  const events = new Array(numEvents).fill(undefined).map(() => {
    const group = faker.helpers.arrayElement(groups);
    const startDate = getStartDate(daysInPast);

    return generateMockEvent(group.id, startDate);
  });

  return { events, groups };
};
