import { generateMock } from "@anatine/zod-mock";
import { z } from "zod";
import { faker } from "@faker-js/faker";

export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const generateMockUser = () =>
  generateMock(UserSchema, {
    stringMap: {
      firstName: faker.person.firstName,
      lastName: faker.person.lastName,
    },
  });
