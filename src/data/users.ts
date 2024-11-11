import { z } from "zod";
import { generateMock } from "@anatine/zod-mock";

import { faker } from "@faker-js/faker";

export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;

export const generateMockUser = () =>
  generateMock(UserSchema, {
    stringMap: {
      firstName: faker.person.firstName,
      lastName: faker.person.lastName,
    },
  });
