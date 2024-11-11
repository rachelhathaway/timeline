import { z } from "zod";
import { generateMock } from "@anatine/zod-mock";

import { User } from "./users";

export const GroupSchema = z.object({
  id: z.string().uuid(),
  rightTitle: z.string(),
  title: z.string(),
});

export const generateMockGroup = (user: User) =>
  generateMock(GroupSchema, {
    stringMap: {
      id: () => user.id,
      rightTitle: () => user.lastName,
      title: () => user.firstName,
    },
  });
